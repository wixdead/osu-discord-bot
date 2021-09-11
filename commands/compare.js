const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { getAsync } = require('../helpers/redisConnector')
const { getScores, getBeatmapInfo} = require('../helpers/osuapi')
const getMods = require('../helpers/bitwise')
const {UserScore} = require('../helpers/Models/UserScore')
const moment = require('moment')

const nf = new Intl.NumberFormat() //Separate number by commas

function createEmbed(beatmapInfo, scores){
  const { title, version, beatmapset_id, beatmap_id } = beatmapInfo

  const exampleEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setAuthor(`Plays from ${scores[0].username} on ${title} [${version}]`, `https://a.ppy.sh/${scores[0].userid}?1601599554.png`, `https://osu.ppy.sh/b/${beatmap_id}`)
    .setThumbnail(`https://b.ppy.sh/thumb/${beatmapset_id}l.jpg`)
    .setTimestamp()

  for(let score of scores) {
    console.log(`score ${score.score} - maxcombo ${score.maxcombo}`)
    exampleEmbed.addField(`\`${getMods(score.mods)}\` score`, 
      ` \u27B8 ${nf.format(score.score)} - ${score.getAcc()}% - ${(+score.pp).toFixed(2)}PP - ${moment(score.date).fromNow()}`)
  }

  return exampleEmbed
}

const compare = {
  data: new SlashCommandBuilder()
    .setName('compare')
    .setDescription('compare user scores')
}

compare.execute = async function(interaction) {
  const getRedisLastMap = await getAsync(`${interaction.guildId}:last_np`)
  const getRedisUsername = await getAsync(interaction.member.id)

  let scores = await getScores(getRedisLastMap, getRedisUsername) //Array of scores

  let scoresArray = []
  for(let score of scores) {
    const dateDay = score.date.split(' ')
    scoresArray.push(new UserScore(getRedisLastMap,score.score, score.username,score.user_id, score.maxcombo, score.count300, score.count100, score.count50, score.countmiss, score.rank, dateDay[0], score.pp, score.enabled_mods))
  }

  const beatmapInfo = await getBeatmapInfo(getRedisLastMap)

  await interaction.reply({ content: ' ', embeds: [createEmbed(beatmapInfo, scoresArray)]})
}

module.exports = compare
