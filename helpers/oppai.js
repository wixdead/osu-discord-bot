const { spawn } = require('child_process');
const getMods = require('./bitwise')

function getPP(info) {
  const { beatmap_id, maxcombo, count50, count100, count300, countmiss, enabled_mods } = info

  const accuracy = (50*+count50 + 100*+count100 + 300*+count300) / (300*(+countmiss + +count50 + +count100 + +count300))
  const fixedAccuracy = (accuracy * 100).toFixed(2)
  console.log(fixedAccuracy)

  const chunks = []

  const curl = spawn('curl', [`https://osu.ppy.sh/osu/${beatmap_id}`]);
  const oppai = spawn('./oppai/oppai', ['-',  `+${getMods(enabled_mods)}`, `${fixedAccuracy}%`, `${maxcombo}x`, `${countmiss}m` ,'-ojson'])

  curl.stdout.pipe(oppai.stdin)

  return new Promise((resolve, reject) => {
    oppai.stdout.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    oppai.stdout.on('error', (err) => reject(err));
    oppai.stdout.on('end', () => resolve(JSON.parse(Buffer
                                          .concat(chunks)
                                          .toString('utf8'))));
  })

}


module.exports = getPP