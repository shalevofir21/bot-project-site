const { MessageEmbed } = require("discord.js");
const guildsConfig = require("../../data/schemas/guilds-config")
module.exports = {
	config: {
		name: "invitations",
		aliases: ['invites'],
		category: "info",
		description: "Shows Users Joined Through Someone's Invites",
		usage: "[name | nickname | mention | ID] (optional)",
		accessableby: "everyone"
	},
	run: async (bot, message, args) => {
		try {
			let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

			let invites = await message.guild.invites.fetch()

			let memberInvites = invites.filter(i => i.inviter && i.inviter.id === member.user.id);

			if (memberInvites.size <= 0) {
				return message.channel.send(`**${member.displayName} didn't invite anyone to the server!**`, (member === message.member ? null : member));
			}

			let content = memberInvites.map(i => i.code).join("\n");
            console.log(content)
			let index = 0;
            console.log(index)
			memberInvites.forEach(invite => index += invite.uses);

			let embed = new MessageEmbed()
			.setColor("GREEN")
			.setFooter(message.guild.name, message.guild.iconURL())
			.setAuthor(`Invite Tracker for ${message.guild.name}`)
			.setDescription(`Information on Invites of ${member.displayName}`)
			.addField("**No. Invited Persons**", index)
			.addField("Invitation Codes\n\n", content);

			message.channel.send({embeds: [embed]});
		} catch (e) {
			return message.channel.send(e.message)
		}
	}
};