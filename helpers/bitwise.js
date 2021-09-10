const enums = {
  NOMOD: 0,
  NF: 1,
  EZ: 2,
  TD: 4,
  HD: 8,
  HR: 16,
  SD: 32,
  DT: 64,
  RX: 128,
  HT: 256,
  NC: 512, // Only set along with DoubleTime. i.e: NC only gives 576
  FL: 1024,
  AT: 2048,
  SO: 4096,
  AP: 8192,    // Autopilot
  PF: 16384, // Only set along with SuddenDeath. i.e: PF only gives 16416  
}

function getMods(mods) {
  const usedMods = []
  for (const [key, value] of Object.entries(enums)) {
    if ((mods & value) === value) {
      usedMods.push(key)
    }
  }

  return (usedMods.slice(1).join(''))
}

module.exports = getMods