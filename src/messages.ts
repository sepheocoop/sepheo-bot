import { directoryResponse } from "./types.js";
import { sendMessage } from "./matrixClientRequests.js";
import { getDirectory } from "./nocodbRequests.js";
import { MatrixEvent } from "matrix-js-sdk";

export const directory = async (event: MatrixEvent | null = null) => {
  const response = await getDirectory();
  const result = (await response.json()) as directoryResponse;

  const { list } = result;

  const looking = list.filter((member) => member.Availability === "Looking");
  const notLooking = list.filter(
    (member) => member.Availability === "Not looking",
  );

  const message = `Thanks for asking, friend. The SEPHEO directory has ${
    list.length
  } members. There are ${looking.length} members looking for work and ${
    notLooking.length
  } members not looking. The members looking for work are: ${looking
    .map((member) => `\n- ${member.FirstNames} ${member.Surname}`)
    .join("")}`;

  if (!event || event.event.room_id == undefined) return;

  try {
    await sendMessage(event.event.room_id, message, {
      purpose: "answer to directory query",
    });
  } catch (error) {
    console.error("failed to send directory reply:", error);
  }
};

const thankYou = (event: MatrixEvent) => {
  if (event.event.room_id == undefined) return;

  sendMessage(event.event.room_id, "thanks for the message, friend", {
    purpose: "simple reply",
  }).catch((error) => console.error("failed to send reply:", error));
};

const handleMessage = (event: MatrixEvent) => {
  console.log("reaction to message", event);

  if (event.event.content?.body == undefined) return;

  const message = event.event.content.body;

  if (message.includes("directory")) {
    directory(event);
  } else {
    thankYou(event);
  }
};

export default handleMessage;
