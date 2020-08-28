const fs = require("fs");

const configPath = "./config.json";

const readAndUpdateBpm = () => {
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const bpm = fs.readFileSync(config.bpmFile, "utf-8");
  if (bpm === config.bpm) return;
  console.log(`Changing BPM to ${bpm}`);
  config.bpm = bpm;
  fs.writeFileSync(configPath, JSON.stringify(config, "", 2));
};

console.log("Watching for BPM changes...");
setInterval(readAndUpdateBpm, 1000);
