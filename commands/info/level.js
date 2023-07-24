const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { PREFIX } = require('../../config');
const Data = require("../../data/schemas/RankData.js")
const RankSettings = require("../../data/schemas/RankSettings.js")
const RankProfile = require("../../data/schemas/RankData.js")
const guildsConfig = require("../../data/schemas/guilds-config")
module.exports = {
  config: {
    name: "level",
    aliases: ['xp','rank'],
    category: 'info',
    description: 'Shows A User\'s Current XP Level',
    usage: '[mention | username | nickname | ID] (optional)',
    accessableby: 'everyone'
  },
  run: async (bot, message, args) => {
    const settings = await RankSettings.findOneAndUpdate({guildId: message.guild.id}, {guildId: message.guild.id}, {upsert: true, new:true})
    let { ModuleIs, DoubleXp } = settings
    
    if(ModuleIs === 1) {
      let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
      let getUserRank = await RankProfile.findOne({ guildId: message.guild.id, userId: user.id })
      if(!getUserRank) return message.reply(`This user is not ranked yet`)
      let { level, xp } = getUserRank
      const getNeededXP = level => level * level * 100
      let embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`**${user.user.tag}** Level Information`)
      .setDescription(`**Level**: ${level}\n**Xp**: ${xp}/${getNeededXP(level)}`)

      message.channel.send({embeds: [embed]});
    } else if(ModuleIs === 0) {
      message.reply(`You cant run this command because level system is turned off on this server use the command \`!setxp\` to turn it on`)
    }
  }
};
