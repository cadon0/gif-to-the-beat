const WebSocket = require("ws");
const path = require("path");
const { osuDataFeedPort } = require("./config");

const { getTimingPoints } = require("./getTimingPoints");
const { getSongsDirectory } = require("./getSongsDirectory");

let songsDirectory;

runListenerWebSocket = (config) => {
  let messageCount;
  if (!songsDirectory) songsDirectory = getSongsDirectory();

  const ws = new WebSocket(
    `ws://localhost:${osuDataFeedPort}/GifToTheBeatOsuDataFeed`
  );

  ws.onopen = () => {
    console.log("Connected to feed of osu! data");
    messageCount = 0;
    setTimeout(() => {
      // Messages are simply not received after establishing the connection occasionally.
      // Unsure if the problem is here or in the provider
      if (messageCount === 0) {
        console.log(
          "osu! data isn't being received. Disconnecting to try again..."
        );
        ws.close();
      }
    }, 3000);
  };

  ws.onmessage = (message) => {
    messageCount++;
    const data = JSON.parse(message.data);

    if (!data.relativeOsuFilePath) return;

    const osuFile = path.resolve(songsDirectory, data.relativeOsuFilePath);
    getTimingPoints(osuFile).then((timingPoints) => {
      config.status = data.status;
      config.mapTime = data.mapTime;
      config.isoTime = data.isoTime;
      config.bpmMultiplier = data.bpmMultiplier;
      config.osuFile = osuFile;
      config.timingPoints = timingPoints;
    });
  };

  ws.onclose = () => {
    console.log("Disconnected from feed of osu! data, reconnecting...");
    runListenerWebSocket(config);
  };

  ws.onerror = () => {};
};

module.exports = { runListenerWebSocket };
