const { MessageEmbed } = require("discord.js")
const db = require("quick.db")
const guildsConfig = require("../../data/schemas/guilds-config")
const savedCoins = require("../../data/schemas/savedCoins")


module.exports = {
	config: {
		name: "coins",
		aliases: ['c'],
		category: "coins",
		description: "show how many coins do you have",
		usage: "!coins",
		accessableby: "everyone"
},
	run: async (bot, message, args) => {
		const guildDB = await guildsConfig.get(message.guild.id);
		if(!guildDB.coinModule) return message.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription("<:keybot_x_mark:884120897269674044> Coins system is disabled.")]})

		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
		const userCoins = await savedCoins.get(message.guild.id, member.id);
		const userCoinsEmbed = new MessageEmbed()
		.setColor("BLUE")
		.setTitle(`${member.user.username} have ${userCoins.coins} coins <:keybot_coin:875357452353286174>`)

		message.channel.send({ embeds: [userCoinsEmbed] })
	},
};