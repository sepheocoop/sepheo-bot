const { auth_token, homeserver } = process.env;

export const sendMessage = (roomId: string, message: string, context = {}) => {
  return fetch(
    `https://${homeserver}/_matrix/client/v3/rooms/${roomId}/send/m.room.message`,
    {
      method: "POST",
      body: JSON.stringify({
        body: message,
        msgtype: "m.text",
        context,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
};
