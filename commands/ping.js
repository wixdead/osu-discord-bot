const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const { getUserInfo } = require('../helpers/osuapi')

const ping = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong')
}

ping.execute = async function(interaction) {
  await interaction.reply({ content: `pong` })
}

module.exports = ping