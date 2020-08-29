const fs = require("fs");
const path = require("path");

/**
 * Checks specified file for a new BPM value
 * @returns {string} the BPM the gif should play at
 */
getBpmFromFile = (currentBpm, config) => {
  const newBpm = fs.readFileSync(path.resolve(config.bpmFile), "utf-8");
  if (currentBpm != newBpm) console.log(`Changing BPM to ${newBpm}`);
  return newBpm;
};

module.exports = { getBpmFromFile };
