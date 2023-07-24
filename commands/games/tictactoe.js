const Discord = module.require("discord.js");

module.exports = {
	config: {
		name: 'tictactoe',
		aliases: ['ttt', 'tictac'],
		category: 'games',
		usage: '[name | nickname | mention | ID]',
		description: 'Play A Game Of TicTacToe With Another User',
		accessableby: "everyone"
	},
	run: async (bot, message, args, ops) => {
        const simplydjs = require("simply-djs")
simplydjs.tictactoe(bot, message, {
    xEmoji: '❌', //default: ❌
    oEmoji: '⭕', //default: ⭕
    credit: false,
    idleEmoji: '➖', //default: ➖
    embedColor: ' #075FFF', //default: #075FFF
    embedFoot: 'KeyBot - Make sure to win :) ' //default: 'Make sure to win ;)' 
})
    }
};

