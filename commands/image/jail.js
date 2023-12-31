const Discord = require("discord.js");
const { AME_API } = require('../../config');
const AmeClient = require('amethyste-api');
const AmeAPI = new AmeClient(AME_API);
const guildsConfig = require("../../data/schemas/guilds-config")
module.exports = {
	config: {
		name: "jail",
		category: "image",
		noalias: [''],
		description: "Sends User To Jail",
		usage: "[username | nickname | mention | ID] (optional)",
		accessableby: "everyone"
	},
	run: async (bot, message, args) => {
		let user = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
		let m = await message.channel.send("**Please Wait...**");
		let buffer = await AmeAPI.generate("jail", { url: user.user.displayAvatarURL({ format: "png", size: 1024 }) });
		let attachment = new Discord.MessageAttachment(buffer, "jail.png");
		setTimeout(() => m.delete(), 5000);
        
		message.channel.send({files: [attachment]});
	}
};
