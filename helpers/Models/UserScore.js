const moment = require('moment')

class UserScore {
  constructor(beatmap = null, score, username = null, userid, maxcombo, count300, count100, count50, countmiss, rank, date, pp = null, mods){
    this.beatmap = beatmap
    this.score = score
    this.username = username
    this.userid = userid
    this.maxcombo = maxcombo
    this.count300 = +count300
    this.count100 = +count100
    this.count50 = +count50
    this.countmiss = +countmiss
    this.rank = rank
    this.date = moment().format(date)
    this.pp = pp
    this.mods = mods
  }
  getAcc(){
    const accuracy = (50*this.count50 + 100*this.count100 + 300*this.count300) / (300*(this.countmiss + this.count50 + this.count100 + this.count300))
    const fixedAccuracy = (accuracy * 100).toFixed(2)
    return fixedAccuracy
  }
}


module.exports = {UserScore}