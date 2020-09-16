const WebSocket = require("ws");
const path = require("path");
const { osuDataFeedPort } = require("./config");

const { getTimingPoints } = require("./getTimingPoints");
const { getSongsDirectory } = require("./getSongsDirectory");

let songsDirectory;

runDataWebSocket = (config) => {
  if (!songsDirectory) songsDirectory = getSongsDirectory();

  const ws = new WebSocket(
    `ws://localhost:${osuDataFeedPort}/GifToTheBeatOsuDataFeed`
  );

  ws.onopen = () => {
    console.log(`Connected to feed of osu! data`);
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log(data);

    if (!data.relativeOsuFilePath) return;

    const osuFile = path.resolve(songsDirectory, data.relativeOsuFilePath);
    getTimingPoints(osuFile).then((timingPoints) => {
      config.status = data.status;
      config.bpmMultiplier = data.bpmMultiplier;
      config.lastUpdate = data.isoTime;
      config.osuFile = osuFile;
      config.timingPoints = timingPoints;
    });
  };

  ws.onclose = () => {
    console.log(`Disconnected from feed of osu! data, reconnecting...`);
    runDataWebSocket(config);
  };

  ws.onerror = () => {};
};

module.exports = { runDataWebSocket };