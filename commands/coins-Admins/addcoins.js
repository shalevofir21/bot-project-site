const { MessageEmbed } = require("discord.js")
const db = require("quick.db")

const guildsConfig = require("../../data/schemas/guilds-config")
const savedCoins = require("../../data/schemas/savedCoins")

module.exports = {
	config: {
		name: "addcoins",
		aliases: ['addc'],
		category: "admin - coins",
		description: "add coins to user ",
		usage: "!addcoins @user amount",
		accessableby: "everyone"
	},
	run: async (bot, message, args) => {
		if (!message.member.permissions.has("ADMINISTRATOR")) return sendEmbed("<:keybot_x_mark:884120897269674044> You Do Not Have The Required Permissions! - [ADMINISTRATOR].", "RED")
		
		const guildDB = await guildsConfig.get(message.guild.id);
		if(!guildDB.coinModule) return sendEmbed("Coins system is disabled.", "RED")

		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if(!member) return sendEmbed("You must provide a member.", "RED")

		const amount = args[1]
		if(!amount) return sendEmbed( "Please provide the amount you want to give the member.", "RED")
		if(isNaN(amount)) return sendEmbed( "Please provide a valid number for the amount.", "RED")
		if(amount < 10) return sendEmbed( "Please provide a number higher then 10.", "RED")
		if(amount > 999999999999) return sendEmbed("Please provide a number lower then 999999999999.", "RED")

		const userCoins = await savedCoins.get(message.guild.id, member.id);
		if((userCoins.coins + Number(amount)) > 999999999999) return sendEmbed("Maximum coins that a member can have is 999999999999.", "RED")
		userCoins.coins = userCoins.coins + Number(amount)
		userCoins.save()
		sendEmbed("Added " + amount + " coins to the user.", "GREEN")
		function sendEmbed(text, color){
			message.channel.send({embeds:[new MessageEmbed().setColor(color).setDescription(color === "GREEN" ? `<:keybot_v_mark:884120897391304714> ${text}` : `<:keybot_x_mark:884120897269674044> ${text}`)]})
		}
	},
};