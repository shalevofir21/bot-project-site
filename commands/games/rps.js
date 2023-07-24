const Discord = module.require("discord.js");
const simplydjs = require("simply-djs")

module.exports = {
	config: {
			name: "rps",
			category: "games",
			aliases: ['rockpaperscissors'],
			description: "Rock Paper Scissors Game. React to one of the emojis to play the game.",
			usage: " ",
			accessableby: "everyone"
	},
	run: async (bot, message, args) => {
simplydjs.rps(message, {
            embedColor: " #075FFF", // default: #075FFF
            credit: false,	// default: SECONDARY
            timeoutEmbedColor: "#c90000", // default: #c90000
            drawEmbedColor: "#075FFF", // default: #075FFF
            winEmbedColor: "#06bd00", // default: #06bd00
            embedFooter: "Keybot - A Game of RPS",
            rockColor: "SECONDARY", // default: SECONDARY
            paperColor: "SECONDARY", // default: SECONDARY
            scissorsColor: "SECONDARY",
        })  },
};

