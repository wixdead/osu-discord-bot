const { osu_apikey: apikey} = require('../config.json')
const axios = require('axios')

const osu = axios.create({
  baseURL: 'https://osu.ppy.sh/api/'
})

async function getUserInfo(username) {
  let params = {
    k: apikey,
    m: 0,
    u: username
  }
  const response = await osu.get('/get_user', {params})
  const data = await response.data[0]
  return data
}

async function getUserRecent(username) {
  let params = {
    k: apikey,
    m: 0,
    u: username
  }
  const response = await osu.get('/get_user_recent', {params})
  const data = await response.data[0]
  return data
}

async function getBeatmapInfo(beatmapId) {
  let params = {
    k: apikey,
    m: 0,
    b: beatmapId
  }
  const response = await osu.get('/get_beatmaps', {params})
  const data = await response.data[0]
  return data
}

async function getScores(beatmap, username) {
  let params = {
    k: apikey,
    b: beatmap,
    u: username,
    m: 0,
    limit: 3
  }
  const response = await osu.get('/get_scores', {params})
  const data = await response.data
  return data
}

module.exports = {getUserInfo, getUserRecent, getBeatmapInfo, getScores}