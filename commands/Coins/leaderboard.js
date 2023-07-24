const { MessageEmbed } = require("discord.js")
const db = require("quick.db")

const guildsConfig = require("../../data/schemas/guilds-config")
const savedCoins = require("../../data/schemas/savedCoins")


module.exports = {
    config: {
        name: "leaderboard",
        aliases: ['lead'],
        category: "coins",
        description: "show the top 10 in the server ",
        usage: "",
        accessableby: "everyone"
    },
    run: async (bot, message, args) => {
        const guildDB = await guildsConfig.get(message.guild.id);
        if(!guildDB.coinModule) return message.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription("<:keybot_x_mark:884120897269674044> Coins system is disabled.")]})

        const data = await savedCoins.getall(message.guild.id)
        if(data.length < 1) return message.channel.send({embeds: [new MessageEmbed().setColor("RED").setDescription("<:keybot_x_mark:884120897269674044> No coins in this server.")]})

        let textLeaderboard = ``
        let counter = 0
        data.sort((a, b) => (Number(a.coins) < Number(b.coins)) ? 1 : -1)
        data.forEach( async(userCoins) => {
            const userID = userCoins._id.slice(19)
            counter++
            if(counter > 10) return;
            if(counter == 1){
                textLeaderboard = textLeaderboard + `🥇. <@${userID}> - ${userCoins.coins} <:keybot_coin:875357452353286174>\n`
            } else if(counter == 2){
                textLeaderboard = textLeaderboard + `🥈. <@${userID}> - ${userCoins.coins} <:keybot_coin:875357452353286174>\n`
            } else if(counter == 3){
                textLeaderboard = textLeaderboard + `🥉. <@${userID}> - ${userCoins.coins} <:keybot_coin:875357452353286174>\n`
            } else {
                textLeaderboard = textLeaderboard + `**${counter}**. <@${userID}> - ${userCoins.coins} <:keybot_coin:875357452353286174>\n`
            }
        });

        const leaderboardEmbed = new MessageEmbed()
        .setColor("GOLD")
        .setTitle("Top 10 members with the most coins.")
        .setDescription(textLeaderboard)

        message.channel.send({ embeds: [leaderboardEmbed] })
    },
};