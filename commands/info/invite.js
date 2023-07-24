const { MessageEmbed } = require("discord.js")
const { greenlight } = require("../../JSON/colours.json")
const guildsConfig = require("../../data/schemas/guilds-config")
module.exports = {
	config: {
		name: "invite",
		description: "invite the bot ",
		usage: " ",
		category: "info",
			accessableby: "everyone"
	},
	run: async (bot, message, args) => {
		let embed = new MessageEmbed()
		.setColor(greenlight)
		.setTitle("hello ! you can invite the bot here :")
		.addField("click here",`[invite](https://discord.com/oauth2/authorize?client_id=770670637823557632&permissions=8&scope=bot)`)
		.addField("if you need help join to the support server",`[support server](https://discord.gg/z5qRDyzFmP)`);

		message.channel.send({embeds: [embed]});
	}  
}
