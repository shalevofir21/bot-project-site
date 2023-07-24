const { MessageEmbed } = require("discord.js")
const db = require("quick.db")
const ms = require("parse-ms")
const guildsConfig = require("../../data/schemas/guilds-config")
const savedCoins = require("../../data/schemas/savedCoins")


module.exports = {
	config: {
		name: "daily",
		category: "coins",
		description: " ",
		usage: "",
		accessableby: "everyone"
	},
	run: async (bot, message, args) => {
		const guildDB = await guildsConfig.get(message.guild.id);
		if(!guildDB.coinModule) return message.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription("<:keybot_x_mark:884120897269674044> Coins system is disabled.")]})
//               let cooldown = await db.fetch(`cooldown_active.${message.guild.id}.${message.author.id}`);
//   let cooldowns = 86400000;
//   if (cooldown !== null && cooldowns - (Date.now() - cooldown) > 0) {
// let timeObj = (cooldowns - (Date.now() - cooldown));console.log(timeObj);return message.reply(`**You take today's coins, try again tomorrow!  **`);}
//   db.set(`cooldown_active.${message.guild.id}.${message.author.id}`,Date.now());
//   if(!message.member.permissions.has("ADMINISTRATOR")){
//   db.set(`cooldown_active.${message.guild.id}.${message.author.id}`,Date.now());
//   }
		let user = message.author;
		let timeout = 86400000;

		let daily = await db.get(`daily_${user.id}_${message.guild.id}`);
		if (daily !== null && timeout - (Date.now() - daily) > 0) {
			let time = ms(timeout - (Date.now() - daily));

			let timeEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription(`<:keybot_x_mark:884120897269674044> You've already collected your daily reward\n\nCollect it again in ${time.hours}h ${time.minutes}m ${time.seconds}s `);
			message.channel.send({ embeds: [timeEmbed]})
		} else {
			function randomNumber(min, max) { // min and max included 
				return Math.floor(Math.random() * (max - min + 1) + min)
			}			
			const targetCoins = await savedCoins.get(message.guild.id, message.member.id);
			let amount = randomNumber(guildDB.coinDaily.min, guildDB.coinDaily.max);
			targetCoins.coins = targetCoins.coins + Number(amount)
			targetCoins.save()
			message.channel.send({embeds: [new MessageEmbed().setColor("GREEN").setDescription("<:keybot_v_mark:884120897391304714> You've collected your daily reward of " + `${amount}` + " coins.")]})
			db.set(`daily_${user.id}_${message.guild.id}`, Date.now())
		}
	},
};


