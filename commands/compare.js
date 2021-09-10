const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

const { getAsync, client} = require('../helpers/redisConnector')

const { getScores, getBeatmapInfo} = require('../helpers/osuapi')
const { getPP } = require('../helpers/oppai')


function createEmbed(playInfo, beatmapInfo, scores){
  const { score, username, maxcombo, count100, count300, count50, countmiss, rank} = playInfo
  const { title, version, difficultyrating, beatmapset_id, beatmap_id } = beatmapInfo

  const exampleEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Plays from *user* on ${title} [${version}] (${Number(difficultyrating).toFixed(2)})`)
    .setURL(`https://osu.ppy.sh/b/${beatmap_id}`)
    .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
    .setDescription(`PP:`)
    .setThumbnail(`https://b.ppy.sh/thumb/${beatmapset_id}l.jpg`)
    .setTimestamp()
    .setFooter(`${playInfo.date}`, 'https://i.imgur.com/AfFp7pu.png');

  for(scorex of scores) {
    console.log(`score ${scorex.score} - maxcombo ${scorex.maxcombo}`)
    exampleEmbed.addField('Score', `score ${scorex.score} - maxcombo ${scorex.maxcombo}`)
  }

  return exampleEmbed
}

const compare = {
  data: new SlashCommandBuilder()
    .setName('compare')
    .setDescription('compare user scores')
}
// , count100, count300, count50, countmiss, rank, date, pp
class userPlay {
  constructor(score, username, maxcombo){
    this.score = score
    this.username = username
    this.maxcombo = maxcombo
  }
}

compare.execute = async function(interaction) {
  let getRedisLastMap = await getAsync(`${interaction.guildId}:last_np`)
  let getRedisUsername = await getAsync(interaction.member.id)



  let scores = await getScores(getRedisLastMap, getRedisUsername) //Array of scores

  let testArray = []

  for(score of scores) {
    testArray.push(new userPlay(score.score, score.username, score.maxcombo))
  }

  console.log(testArray)

  let scoron = scores[0]

  let beatmapInfo = await getBeatmapInfo(getRedisLastMap)
  // console.log(beatmapInfo)




  await interaction.reply({ content: `${getRedisLastMap}, ${getRedisUsername}`, embeds: [createEmbed(scoron, beatmapInfo, testArray)]})
}

module.exports = compare
