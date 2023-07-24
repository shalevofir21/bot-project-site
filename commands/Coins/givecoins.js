const { MessageEmbed } = require("discord.js")
const db = require("quick.db")

const guildsConfig = require("../../data/schemas/guilds-config")
const savedCoins = require("../../data/schemas/savedCoins")


module.exports = {
	config: {
		name: "givecoins",
		aliases: ['gc'],
		category: "coins",
		description: "give coins to your friend ",
		usage: "!givecoins @user amount",
		accessableby: "everyone"
	},
	run: async (bot, message, args) => {
		const guildDB = await guildsConfig.get(message.guild.id);
		if(!guildDB.coinModule) return sendEmbed("Coins system is disabled.", "RED")

		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if(!member) return sendEmbed("You must provide a member", "RED")
		if (member.user.bot) return sendEmbed('**Cannot Give coins to bots**', "RED");
		const amount = args[1]
		if(!amount) return sendEmbed("Please provide the amount you want to give the member.", "RED")
		if(isNaN(amount)) return sendEmbed("Please provide a valid number for the amount.", "RED")
		if(amount < 1) return sendEmbed("Please provide a number higher then 0.", "RED")

		const userCoins = await savedCoins.get(message.guild.id, message.member.id);
		if(userCoins.coins < Number(amount)) return sendEmbed("You dont have that amount of coins to give.", "RED")
		const targetCoins = await savedCoins.get(message.guild.id, member.id);
		if((targetCoins.coins + Number(amount)) > 999999999999) return sendEmbed("Maximum coins that a member can have is 999999999999.", "RED")

		userCoins.coins = userCoins.coins - Number(amount)
		targetCoins.coins = targetCoins.coins  + Number(amount)
		userCoins.save()
		targetCoins.save()
		sendEmbed("Coins has been successfully transferred.", "GREEN")

		function sendEmbed(text, color){
			message.channel.send({embeds:[new MessageEmbed().setColor(color).setDescription(color === "GREEN" ? `<:keybot_v_mark:884120897391304714> ${text}` : `<:keybot_x_mark:884120897269674044> ${text}`)]})
		}
	},
};