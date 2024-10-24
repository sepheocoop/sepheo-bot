import { directoryResponse } from "./types";
import { sendMessage } from "./matrixClientRequests";
import { getDirectory } from "./nocodbRequests";

export const directory = async (event = null) => {
  const response = await getDirectory();
  const result = (await response.json()) as directoryResponse;

  const { list } = result;

  const looking = list.filter((member) => member.Availability === "Looking");
  const notLooking = list.filter(
    (member) => member.Availability === "Not looking"
  );

  const message = `Thanks for asking, friend. The SEPHEO directory has ${
    list.length
  } members. There are ${looking.length} members looking for work and ${
    notLooking.length
  } members not looking. The members looking for work are: ${looking
    .map((member) => `\n- ${member.FirstNames} ${member.Surname}`)
    .join("")}`;

  sendMessage(event.event.room_id, message, {
    purpose: "answer to directory query",
  });
};

const thankYou = (event) => {
  sendMessage(event.event.room_id, "thanks for the message, friend", {
    purpose: "simple reply",
  });
};

const handleMessage = (event) => {
  console.log("reaction to message", event);

  const message = event.event.content.body;

  if (message.includes("directory")) {
    directory(event);
  } else {
    thankYou(event);
  }
};

export default handleMessage;
