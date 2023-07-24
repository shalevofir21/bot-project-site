const { MessageEmbed } = require("discord.js")
const db = require("quick.db")
const config = require("../../../config.json");

const guildsConfig = require("../../data/schemas/guilds-config")
const savedCoins = require("../../data/schemas/savedCoins")

module.exports = {
	config: {
		name: "shop",
		aliases: ['sh'],
		category: "coins",
		description: "show the shop  ",
		usage: "!shop",
		accessableby: "everyone"
	},
	run: async (bot, message, args) => {
		const guildDB = await guildsConfig.get(message.guild.id);
		if(!guildDB.coinModule) return message.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription("<:keybot_x_mark:884120897269674044> Coins system is disabled.")]})

		if(!guildDB.coinsShop || guildDB.coinsShop.length < 1) return message.channel.send({
			embeds: [
			new MessageEmbed()
			.setTitle("Items shop")
			.setColor("BLUE")
			.setDescription("There are no items in the shop.\n\nDo `!buy {item number}` to buy an item.\nDo `!inventory / !inv` to see your items inventory.")
		]})

		let textShop = ``
		guildDB.coinsShop.sort((a, b) => (Number(a.price) > Number(b.price)) ? 1 : -1)
		let number = 0
		guildDB.coinsShop.forEach(item => {
			number++
			textShop = textShop + ` ${number}. <@&${item.RoleID}> - ${item.price} <:keybot_coin:875357452353286174>\n`
		});
		const shopembed = new MessageEmbed()
		.setTitle("Items shop")
		.setColor("BLUE")
		.setDescription(`Shop url: ${config.url}/shop/${message.guild.id}\n\n`+textShop+"\nDo `!inventory / !inv` to see your items inventory.")//\nDo ```!buy {item number}``` to buy an item.

		message.channel.send({embeds: [shopembed]}) 
	},
};