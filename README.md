# Self Employed Bots Helping Every One

Welcome to SEBHEO, a bot attached to the [Sepheo Coop](https://sepheo.co) matrix group and freelancer directory.

You will need:

- A nocodb instance
- A matrix space
- A matrix user operating as the bot
- A cloudron instance

## Set-up instructions

1. Copy the .env.example into a .env file
2. Fill in the .env with details from nocodb and your matrix bot. Use the homeserver of the bot. Create a room in your matrix space for the bot. Must be unencrypted.
3. Run `npm install`
4. Run `npm run build`
5. Run `npm start`
6. Use the word `directory` in the bot's matrix room to trigger a directory query.
7. Configuring the nocodb webhook: https://docs.nocodb.com/automation/webhook/create-webhook/
8. When adding the secret parameter to your webhook, make sure the box is ticked for it to be active

## Cloudron instructions

1. The cloudron instructions are here: https://docs.cloudron.io/packaging/tutorial/#overview
2. Then follow the docker image creation and cloudron installation instructions
4. After one round of that, you can use `npm run cloudron-install` and `npm run cloudron-update` because it remembers the previous repositories and images you've set up
5. Use `cloudron env set --app seb key1=value1 key2=value2...` to set the env variables for the app

See `.env.example` for the list of environment variables to set (although obviously no values are included). The up-to-date values of these should be stored in the organisational password manager. Ask an admin for details.

You can use `npm run cloudron-log` to list the logs from the Cloudron server, and therefore to diagnose errors if they occur during the install.
