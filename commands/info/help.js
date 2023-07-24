const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const db = require('quick.db');
const { stripIndents } = require("common-tags");
const { cyan } = require("../../JSON/colours.json");
const { PREFIX } = require('../../config');
const guildsConfig = require("../../data/schemas/guilds-config");
const config = require("../../../config.json");

module.exports = {
  config: {
    name: "help",
    usage: "[command name] (optional)",
    category: "info",
    description: "Displays all commands that the bot has.",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => {
    let prefix;
    let fetched = await db.fetch(`prefix_${message.guild.id}`);
    const guildDB = await guildsConfig.get(message.guild.id);

    if (fetched === null) {
      prefix = PREFIX
    } else {
      prefix = fetched
    }

    const embed = new MessageEmbed()
    .setColor(cyan)
    .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL())
    .setThumbnail(bot.user.displayAvatarURL())

    if (!args[0]) {
      embed.setDescription(`**[invite](https://discord.com/oauth2/authorize?client_id=770670637823557632&permissions=8&scope=bot)** | **[support server](https://discord.gg/z5qRDyzFmP)** | **[website](https://keybot.xyz)**\n**[Check out Novonode](https://novonode.com/billing/aff.php?aff=40)**\n**These Are the Available Commands For ${message.guild.me.displayName}\nBot's Global Prefix Is \`${PREFIX}\`\nServer Prefix Is \`${prefix}\`\n\nFor Help Related To A Particular Command Type -\n\`${prefix}help [command name | alias]\`**`)
      embed.setFooter(`${message.guild.me.displayName} | Total Commands - ${bot.commands.size - 1}`, bot.user.displayAvatarURL());            embed.setFooter(`${message.guild.me.displayName} | Total Commands - ${bot.commands.size - 1} Loaded`, bot.user.displayAvatarURL());
      embed.addField(`Games [9] -`, `akinator, connectfour, gunfight, rps, russianroulette, tictactoe`)
      embed.addField(`Image [16] -`,  `avatar, avatarfusion, captcha, clyde, facepalm, fire, jail, love, mission, rip, scary, tobecontinued, triggered, tweet, wasted, pet`)
      embed.addField(`Info [10] - `,  `channelinfo, team, help, invitations, level, ping, roleinfo, rolememberinfo, serverinfo, uptime, whois, invite`)
      embed.addField(`Moderation [22] -`, `ban, disablemodlogchannel, disablemuterole, disablewelcomechannel, kick, mute, purge, removerole, setlogs, setmodlogchannel, setmuterole, setnick, setprefix, unban, unmute, warn`)
      embed.addField(`transform [3] -`, `rolelist, setrole, deleterole`)
      embed.addField(`level system [8] -`, `level, setxp, top, doublexp, setlevelmessage, resetxp, resetallxp, rolelevel`)
      embed.addField(`discord activity [5] -`, `start-fishing, start-poker, start-betrayal, start-youtube, start-chess`)
      embed.addField(`Coins [5] -` , `coins, inventory, givecoins, leaderboard, shop, ${guildDB.coinModule ? `[online shop](${config.url}/shop/${message.guild.id})` : ""}`)
      embed.addField(`Coins - Admins [2] -` , `addcoins, removecoins, [online config](${config.url}/server/${message.guild.id}/coins)`)
      embed.addField(`Owner [3] -` , `eval, getinvite, serverlist`)

      embed.setTimestamp()

      return message.channel.send({embeds: [embed]});
    } else {
      let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
      if (!command) return message.channel.send(embed.setTitle("**Invalid Command!**").setDescription(`**Do \`${prefix}help\` For the List Of the Commands!**`))
      command = command.config

      embed.setDescription(stripIndents`**KeyBot Prefix Is \`${prefix}\`**\n
      ** Command -** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\n
      ** Description -** ${command.description || "No Description provided."}\n
      ** Usage -** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No Usage"}\n
      ** Needed Permissions -** ${command.accessableby || "everyone can use this command!"}\n
      ** Aliases -** ${command.aliases ? command.aliases.join(", ") : "None."}`)
      embed.setFooter(message.guild.name, message.guild.iconURL())

      return message.channel.send({embeds: [embed]});
    }
  }
};