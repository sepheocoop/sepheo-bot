# Self Employed Bots Helping Every One

Welcome to SEBHEO, a bot attached to the [Sepheo Coop](https://sepheo.co) matrix group and freelancer directory.

You will need:

- A nocodb instance
- A matrix space
- A matrix user operating as the bot

## Set-up instructions

1. Copy the .env.example into a .env file
2. Fill in the .env with details from nocodb and your matrix bot. Use the homeserver of the bot. Create a room in your matrix space for the bot. Must be unencrypted.
3. Run `npm install`
4. Run `npm run build`
5. Run `npm start`
6. Use the word `directory` in the bot's matrix room to trigger a directory query.
