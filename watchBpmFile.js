const fs = require("fs");

const configFile = "./config.json";

const readAndUpdateBpm = () => {
  const config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
  const bpm = fs.readFileSync(config.bpmFile, "utf-8");
  config.bpm = bpm;
  fs.writeFileSync("./config.json", JSON.stringify(config, "", 2));
};

setInterval(readAndUpdateBpm, 1000);
