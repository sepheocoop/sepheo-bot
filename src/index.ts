import "dotenv/config";
import * as matrixSDK from "matrix-js-sdk";
import { RoomEvent, ClientEvent } from "matrix-js-sdk";
import express from "express";
import handleMessage from "./messages";
import handleReaction from "./reactions";
import { normalisePayload } from "./contactEvents";
import { notifyOfContactEvent } from "./notifications";

const {
  bot_user_id,
  homeserver,
  auth_token,
  nocodb_secret,
} = process.env;

const client = matrixSDK.createClient({
  baseUrl: `https://${homeserver}`,
  accessToken: auth_token,
  userId: bot_user_id,
});

const startMatrixClient = async () => {
  await client.startClient();

  client.once(ClientEvent.Sync, async (state, prevState, res) => {
    // state will be 'PREPARED' when the client is ready to use
    console.log(state);
  });

  const scriptStart = Date.now();

  client.on(
    RoomEvent.Timeline,
    async function (event, room, toStartOfTimeline) {
      const eventTime = event.event.origin_server_ts;

      if (scriptStart > eventTime) {
        return; //don't run commands for old messages
      }

      if (event.event.sender === bot_user_id) {
        return; //don't reply to yourself
      }

      if (
        event.getType() !== "m.room.message" &&
        event.getType() !== "m.reaction"
      ) {
        console.log("skipping event:", event);
        return; // only use messages or reactions
      }

      if (event.getType() === "m.room.message") handleMessage(event);

      if (event.getType() === "m.reaction") handleReaction(event);
    }
  );
};

startMatrixClient();

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
  console.log("visit to the root location");

  response.send("Hello friends");
});

// Espo retries non-2xx responses 4 times, 10 minutes apart, so the status code
// decides whether a failed notification is lost or redelivered. The sends are
// awaited before responding — express 4 does not catch rejected promises from
// an async handler, so the try/catch here is what keeps the process alive.
app.post("/api", async (request, response) => {
  const { secret } = request.query;

  if (secret !== nocodb_secret) {
    console.log("rejected webhook: incorrect secret");
    response.status(401).send("incorrect secret, check the parameter");
    return;
  }

  const contactEvents = normalisePayload(request.body);

  try {
    for (const contactEvent of contactEvents) {
      await notifyOfContactEvent(contactEvent);
    }
  } catch (error) {
    console.error("failed to send notification to matrix:", error);
    response.status(500).send("failed to send notification to matrix");
    return;
  }

  console.log(`sent ${contactEvents.length} notification(s)`);
  response.status(200).send(`sent ${contactEvents.length} notification(s)`);
});

app.listen(5000);
