const { SlashCommandBuilder } = require('@discordjs/builders')
const redis = require('redis')

const client = redis.createClient({
  socket: {
    url: 'redis://127.0.0.1:6379'
  }
})  

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