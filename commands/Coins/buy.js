const { MessageEmbed, MessageActionRow,MessageButton } = require("discord.js")
const db = require("quick.db")

const guildsConfig = require("../../data/schemas/guilds-config")
const savedCoins = require("../../data/schemas/savedCoins")


module.exports = {
	config: {
			name: "buy",
			aliases: ['b'],
			category: "coins",
			description: "buy role in the shop ",
			usage: "!buy (role id)",
			accessableby: "everyone"
	},
	run: async (bot, message, args) => {  
        const guildDB = await guildsConfig.get(message.guild.id);
		if(!guildDB.coinModule) return message.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription("<:keybot_x_mark:884120897269674044> Coins system is disabled.")]})
		// const guildDB = await guildsConfig.get(message.guild.id);
		// if(!guildDB.coinModule) return;

		// const NumberItem = args[0]
		
		// const sortItems = guildDB.coinsShop.sort((a, b) => (Number(a.price) > Number(b.price)) ? 1 : -1)
		// const NUM = Number(NumberItem) - 1
		// const searchItem = sortItems[NUM]
		// const userCoins = await savedCoins.get(message.guild.id, message.member.id);
		// const Role = message.guild.roles.cache.find(role => role.id === searchItem.RoleID)
		// if(!Role) return message.channel.send("Cant find the role on the server.")

		// if (message.member.roles.cache.has(Role.id)) return message.reply("You cant buy the same role again.")
					
		// const BotRole = message.guild.me.roles.highest
		// if(!BotRole) return;
	

		 const row = new MessageActionRow()
              .addComponents(
                  new MessageButton()
                      .setLabel('Shop')
                      .setStyle('LINK')
                      .setURL(`https://keybot.xyz/shop/${message.guild.id}`),
              );
    message.reply({ content: 'Here you go! <:KeyBot:772742735736078347> ', components: [row] });
        
	},

};