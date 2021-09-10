const { osu_apikey: apikey} = require('./config.json')
const axios = require('axios')

const osu = axios.create({
  baseURL: 'https://osu.ppy.sh/api/'
})

async function getUserRecent(username) {
  let params = {
    k: apikey,
    m: 0,
    u: username
  }
  const response = await osu.get('/get_user_recent', {params})
  const data = await response.data
  return data
}

getUserRecent('keko jones').then(data => {console.log(data.length)})