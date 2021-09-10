const redis = require('redis')
const { promisify } = require("util");


const client = redis.createClient({
  socket: {
    url: 'redis://127.0.0.1:6379'
  }
}) 

const getAsync = promisify(client.get).bind(client);

module.exports = {getAsync, client}