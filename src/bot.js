// Discord Bot in JS learned from https://www.youtube.com/watch?v=BmKXBVdEV0g
// never commit the .env file with bot ids to git for security reasons
// Discord JS documentation https://discord.js.org/#/docs/main/stable/general/welcome
require("dotenv").config();

const { Client, WebhookClient } = require("discord.js");
const client = new Client({
  // we need to use partials for data that isn't cached (eg adding roles and keeping those roles)
  partials: ["MESSAGE", "REACTION"],
});

// webhook needs to be created in Discord first and added to .env file
const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN
);

// can be any symbol other than "$"" but don't use a reserved symbol on Discord such as "@"
const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on("message", async (message) => {
  // escape this function so the bot doesn't talk to itself in an infinite loop
  if (message.author.bot) return;
  // console.log(`[${message.author.tag}]: ${message.content}`);
  // if (message.content === "hello") {
  //   // message.reply("hello there");
  //   message.channel.send("hello");
  // }
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      // regular expression to handle whitespace
      .split(/\s+/);

    // enter "$kick someUserId" in Discord to kick a user
    if (CMD_NAME === "kick") {
      //message.channel.send("Kicked the user");
      if (!message.message.hasPermission("KICK_MEMBERS"))
        return message.reply("You lack the power to kick members");

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
    } else if (CMD_NAME === "ban") {
      if (!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("Bot lacks permissions to ban member");
      if (args.length === 0) return message.reply("Please provide an Id");
      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send("User was banned successfully");
      } catch (err) {
        console.log(err);
        message.channel.send(
          "Error, bot either lacks permissions or the user was not found"
        );
      }
    } else if (CMD_NAME === "announce") {
      console.log(args);
      const msg = args.join(" ");
      console.log(msg);
      webhookClient.send(msg);
    }
  }
});

// add member roles
client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "738666523408990258") {
    switch (name) {
      case "🍎":
        member.roles.add("738664659103776818");
        break;
      case "🍌":
        member.roles.add("738664632838782998");
        break;
      case "🍇":
        member.roles.add("738664618511171634");
        break;
      case "🍑":
        member.roles.add("738664590178779167");
        break;
    }
  }
});

// remove roles
client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "738666523408990258") {
    switch (name) {
      case "🍎":
        member.roles.remove("738664659103776818");
        break;
      case "🍌":
        member.roles.remove("738664632838782998");
        break;
      case "🍇":
        member.roles.remove("738664618511171634");
        break;
      case "🍑":
        member.roles.remove("738664590178779167");
        break;
    }
  }
});

// use the environment variable
client.login(process.env.DISCORDJS_BOT_TOKEN);
