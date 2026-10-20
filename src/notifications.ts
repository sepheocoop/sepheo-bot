import { sendMessage } from "./matrixClientRequests.js";
import type { ContactEvent } from "./contactEvents.js";

const { notification_room_id } = process.env;

const notificationFor = ({ firstName, event }: ContactEvent) => {
  return event === "create"
    ? {
        message: `Hello friends, ${firstName} has filled in the registration form!`,
        purpose: "notifying of new registration",
      }
    : {
        message: `Hello friends, ${firstName} has updated their profile.`,
        purpose: "notifying of profile update",
      };
};

export const notifyOfContactEvent = async (contactEvent: ContactEvent) => {
  if (notification_room_id === undefined) {
    console.error(`No environment variable: notification_room_id`);
    return;
  }

  const { message, purpose } = notificationFor(contactEvent);
  await sendMessage(notification_room_id, message, { purpose });
};
