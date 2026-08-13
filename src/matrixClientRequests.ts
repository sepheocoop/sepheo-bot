const { auth_token, homeserver } = process.env;

export const sendMessage = async (
  roomId: string,
  message: string,
  context = {}
) => {
  const response = await fetch(
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

  // fetch only rejects on network errors, so a rejection by matrix — a bad
  // token, an unknown room — has to be turned into an error here.
  if (!response.ok) {
    throw new Error(`matrix responded ${response.status}: ${await response.text()}`);
  }

  return response;
};
