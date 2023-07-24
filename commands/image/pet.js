const { MessageEmbed, MessageAttachment } = require("discord.js")
const pet = require("pet-pet-gif")
const guildsConfig = require("../../data/schemas/guilds-config")
module.exports = {
	config: {
		name: 'pet',
		aliases: [],
		category: 'image',
		usage: '!pet',
		description: 'pet',
		acessableby: 'everyone'
	},
	run: async (bot, message, args, ops) => {
		const u = message.mentions.users.first() || message.author
		let gif = await pet(u.displayAvatarURL({dynamic: false, format: "png"}))
		const i = new MessageAttachment(gif, "image.gif")
		message.channel.send({files: [i]})
	}
}