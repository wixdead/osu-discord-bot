const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { getUserRecent, getBeatmapInfo } = require('../helpers/osuapi')
const getPP = require('../helpers/oppai.js')
const {UserScore} = require('../helpers/Models/UserScore')

const { getAsync, client} = require('../helpers/redisConnector')

function createEmbed(playInfo, beatmapData, ppinfo){
  const { title, version, difficultyrating, beatmapset_id, beatmap_id } = beatmapData
  const { score, count50, count100, count300, rank} = playInfo
  
  const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`${title} [${version}] (${Number(ppinfo.stars).toFixed(2)})`)
	.setURL(`https://osu.ppy.sh/b/${beatmap_id}`)
	.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
	// .setDescription(`PP: ${ppinfo.pp.toFixed(2)}\nJose`)
  .setDescription(`\u25B8 ${rank} \u25B8 ${ppinfo.pp.toFixed(2)}PP \u25B8 ${playInfo.getAcc()}%`)
	.setThumbnail(`https://b.ppy.sh/thumb/${beatmapset_id}l.jpg`)
	.setTimestamp()
	.setFooter(`${playInfo.date}`);
  return exampleEmbed
}

const recent = {
  data: new SlashCommandBuilder()
    .setName('recent')
    .setDescription('recent user scores')
    .addStringOption(option => option.setName('username').setDescription('Enter username'))
}

recent.execute = async function(interaction) {
  let getUsernameRedis = await getAsync(interaction.member.id)
  
  let username = interaction.options.getString('username') || getUsernameRedis //Detect if user submitted a player or if empty search for user in redis

  let recent = await getUserRecent(username) //Get info about last score submitted
  let score = new UserScore(null, recent.score, null, recent.user_id, recent.maxcombo, recent.count300, recent.count100, recent.count50, recent.countmiss, recent.rank, recent.date, null, recent.enabled_mods)
  
  let PPInfo = await getPP(recent) //Get pp from last score submitted
  let beatmapInfo = await getBeatmapInfo(recent.beatmap_id) //Get info about the score beatmap

  await client.set(`${interaction.guildId}:last_np`, recent.beatmap_id) //Save beatmap to use later in compare

  await interaction.reply({ content: ` `, embeds: [createEmbed(score, beatmapInfo, PPInfo)] })
}

module.exports = recent