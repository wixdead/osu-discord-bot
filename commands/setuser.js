const { SlashCommandBuilder } = require('@discordjs/builders')
const { client } = require('../helpers/redisConnector')

const setuser = {
  data: new SlashCommandBuilder()
    .setName("setuser")
    .setDescription("Set user")
    .addStringOption(option => option.setName('username').setDescription('Enter username').setRequired(true))
}

setuser.execute = async function(interaction){
  const username = interaction.options.getString('username')
  await client.set(interaction.member.id, username);
  await interaction.reply("Listo brother")
}

module.exports = setuser