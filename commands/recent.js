const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { getUserRecent, getBeatmapInfo } = require('../helpers/osuapi')
const getPP = require('../helpers/oppai.js')

const { getAsync, client} = require('../helpers/redisConnector')

function createEmbed(playInfo, beatmapData, ppinfo){
  const { title, version, difficultyrating, beatmapset_id, beatmap_id } = beatmapData
  const { score, count50, count100, count300, rank} = playInfo
  

  const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${title} [${version}] (${Number(difficultyrating).toFixed(2)})`)
	.setURL(`https://osu.ppy.sh/b/${beatmap_id}`)
	.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
	.setDescription(`PP: ${ppinfo.pp.toFixed(2)}`)
	.setThumbnail(`https://b.ppy.sh/thumb/${beatmapset_id}l.jpg`)
	.setTimestamp()
	.setFooter(`${playInfo.date}`, 'https://i.imgur.com/AfFp7pu.png');
  return exampleEmbed
}

const recent = {
  data: new SlashCommandBuilder()
    .setName('recent')
    .setDescription('recent user scores')
    .addStringOption(option => option.setName('username').setDescription('Enter username'))
}

recent.execute = async function(interaction) {
  let getRedis = await getAsync(interaction.member.id)
  
  let username = interaction.options.getString('username') || getRedis
  let osuResponse = await getUserRecent(username)
  let ppinfo = await getPP(osuResponse)
  let beatmapInfo = await getBeatmapInfo(osuResponse.beatmap_id)

  console.log(`${interaction.guildId}:last_np`, osuResponse.beatmap_id)  
  await client.set(`${interaction.guildId}:last_np`, osuResponse.beatmap_id)

  await interaction.reply({ content: ` `, embeds: [createEmbed(osuResponse, beatmapInfo, ppinfo)] })
}

module.exports = recent