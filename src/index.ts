import "dotenv/config";
import * as matrixSDK from "matrix-js-sdk";
import { RoomEvent, ClientEvent } from "matrix-js-sdk";
import express from "express";
import handleMessage from "./messages";
import handleReaction from "./reactions";

const { bot_user_id, homeserver, auth_token, nocodb_secret } = process.env;

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

app.get("/", (request, response) => {
  console.log("visit to the root location");

  response.send("Hello friends");
});

app.post("/api", (request, response) => {
  const { secret } = request.params;

  if (secret === nocodb_secret) {
    console.log("new form submission");
  }
});

app.listen(5000);
