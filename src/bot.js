// Discord Bot in JS learned from https://www.youtube.com/watch?v=BmKXBVdEV0g
// never commit the .env file with bot ids to git for security reasons
// Discord JS documentation https://discord.js.org/#/docs/main/stable/general/welcome
require("dotenv").config();

const { Client, WebhookClient } = require("discord.js");

const client = new Client();
client.on("ready", () => {
  console.log(`${client.user.tag} has logged in.`);
});

// use the environment variable
client.login(process.env.DISCORDJS_BOT_TOKEN);
