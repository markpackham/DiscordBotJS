// Discord Bot in JS learned from https://www.youtube.com/watch?v=BmKXBVdEV0g
// never commit the .env file with bot ids to git for security reasons
// Discord JS documentation https://discord.js.org/#/docs/main/stable/general/welcome
require("dotenv").config();

const { Client, WebhookClient } = require("discord.js");
const client = new Client();
// can be any symbol other than "$"" but don't use a reserved symbol on Discord such as "@"
const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on("message", (message) => {
  // escape this function so the bot doesn't talk to itself in an infinite loop
  if (message.author.bot) return;
  console.log(`[${message.author.tag}]: ${message.content}`);
  if (message.content === "hello") {
    // message.reply("hello there");
    message.channel.send("hello");
  }
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      // regular expression to handle whitespace
      .split(/\s+/);

    // enter "$kick someUserId" in Discord to kick a user
    if (CMD_NAME === "kick") {
      //message.channel.send("Kicked the user");
      if (args.length === 0) return message.reply("Please provide an ID");
      const member = message.guild.members.cache.get(args[0]);

      if (member) {
        // obviously you need to give the bot a role in Discord with kicking powers
        // the bot needs a role higher than a Verified user's role
        member
          .kick()
          .then((member) => message.channel.send(`${member} was kicked.`))
          .catch((err) =>
            message.channel.send("Bot lacks permissions to kick member")
          );
      } else {
        message.channel.send("That member was not found");
      }
    }
  }
});

// use the environment variable
client.login(process.env.DISCORDJS_BOT_TOKEN);
