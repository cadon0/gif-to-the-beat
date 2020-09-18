const WebSocket = require("ws");
const path = require("path");
const { osuDataFeedPort } = require("./config");

const { getTimingPoints } = require("./getTimingPoints");
const { getSongsDirectory } = require("./getSongsDirectory");

let songsDirectory;

let osuData = {};

/**
 * Returns the latest data received by the listener WebSocket connection
 */
function getOsuData() {
  return osuData;
}

/**
 * Opens a WebSocket connection to listen to and process the output from the osu! memory reader
 */
function runListenerWebSocket() {
  let messageCount;
  if (!songsDirectory) songsDirectory = getSongsDirectory();

  const ws = new WebSocket(
    `ws://localhost:${osuDataFeedPort}/GifToTheBeatOsuDataFeed`
  );

  ws.onopen = () => {
    console.log(
      "Connected to feed of osu! data. Occasionally the data will be logged"
    );
    messageCount = 0;
    setTimeout(() => {
      // Messages are simply not received after establishing the connection on occasion.
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
    if (messageCount % 20 === 0) {
      console.log(data);
    }

    if (!data.relativeOsuFilePath) return;

    const osuFile = path.resolve(songsDirectory, data.relativeOsuFilePath);
    getTimingPoints(osuFile).then((timingPoints) => {
      osuData.status = data.status;
      osuData.mapTime = data.mapTime;
      osuData.isoTime = data.isoTime;
      osuData.bpmMultiplier = data.bpmMultiplier;
      osuData.osuFile = osuFile;
      osuData.timingPoints = timingPoints;
    });
  };

  ws.onclose = () => {
    console.log("Disconnected from feed of osu! data, reconnecting...");
    runListenerWebSocket(osuData);
  };

  ws.onerror = () => {};
}

module.exports = { getOsuData, runListenerWebSocket };
