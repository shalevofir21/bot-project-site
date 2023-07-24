const {MessageEmbed} = require("discord.js");
const guildsConfig = require("../../data/schemas/guilds-config")
module.exports = {
  config: {
    name: "avatar",
    aliases: ["av"],
    category: "image",
    description: "Shows Avatar",
    usage: "[username | nickname | mention | ID](optional)",
    accessableby: "everyone"
  },
  run: async (bot, message, args) => { 
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

    if (args[0]) {
      let embed = new MessageEmbed()
      .setTitle(`${user.user.username}'s Avatar`)
      .setColor("0xFFEFD5")
      .setImage(`${user.user.displayAvatarURL({dynamic: true})}` + '?size=4096')
      .setFooter(message.guild.name, message.guild.iconURL())
      .setTimestamp();

      message.channel.send({embeds: [embed]});
    }
    else if (!args[0]) {
      let embed = new MessageEmbed()
      .setTitle(`${user.user.username}'s Avatar`)
      .setColor("0xFFEFD5")
      .setImage(`${user.user.displayAvatarURL({ dynamic: true })}` + '?size=4096')
      .setFooter(message.guild.name, message.guild.iconURL())
      .setTimestamp();

      message.channel.send({embeds: [embed]});
    }
  }
}