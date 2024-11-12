
const Discord = require("discord.js")
const cooldowns = new Discord.Collection();
const config = require("../config.json")
module.exports = (client, message) => {
  if (!message.guild) return;

  let prefix;
  prefix = config.prefix

  if (message.author.bot) return;

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd = client.commands.get(command);
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  cmd.run(client, message, args);
};
