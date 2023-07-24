const { MessageEmbed } = require("discord.js")
const db = require("quick.db")

const guildsConfig = require("../../data/schemas/guilds-config")
const itemsInventory = require("../../data/schemas/itemsInventory")
const savedCoins = require("../../data/schemas/savedCoins")
const config = require("../../../config.json");

module.exports = {
	config: {
		name: "inventory",
		aliases: ['inv'],
		category: "coins",
		description: "show your item inventory",
		usage: "!inventory",
		accessableby: "everyone"
	},
	run: async (bot, message, args) => {
		const guildDB = await guildsConfig.get(message.guild.id);
		const inventory = await itemsInventory.get(message.guild.id, message.member.id);
		const userCoins = await savedCoins.get(message.guild.id, message.member.id)
		if(!guildDB.coinModule) return message.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription("<:keybot_x_mark:884120897269674044> Coins system is disabled.")]})

		if(!inventory.items || inventory.items.length < 1) return message.channel.send({
			embeds: [
			new MessageEmbed()
			.setTitle("Items inventory")
			.setColor("BLUE")
			.setDescription("There are no items in your inventory.\n\nDo ``!shop`` to see the shop.")
		]})
		

		let textShop = ``
		let number = 0
		inventory.items.forEach(item => {
			if(!guildDB.coinsShop.find(element => element.id === item.item)) return;
			number++

			textShop = textShop + ` ${number}. <@&${guildDB.coinsShop.find(element => element.id == item.item).RoleID}> ${message.member.roles.cache.has(guildDB.coinsShop.find(element => element.id == item.item).RoleID) ? "- Used" : ""}\n`
		});
		const shopembed = new MessageEmbed()
		.setTitle("Items inventory")
		.setColor("BLUE")
		.setDescription(`Shop url: ${config.url}/shop/${message.guild.id}\n\nCoins: ${userCoins.coins}\n\n`+textShop+"\nDo `!shop` to see the shop.")//\nDo ``!use {item number}`` to use item.

		message.channel.send({embeds: [shopembed]}) 
	},
};