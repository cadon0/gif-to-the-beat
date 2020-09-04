const WebSocket = require("ws");

const { getTimingPoints } = require("./getTimingPoints");
const name = "MapData";

runMapDataWebSocket = (config) => {
  const ws = new WebSocket(`ws://localhost:80/StreamCompanion/${name}/Stream`);

  ws.onopen = () => {
    console.log(`Connected to osu! ${name} update feed`);
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log(data);
    const [bpm, ...mods] = data.bpmInfo.split(",");

    getTimingPoints(data.osuFile).then((timingPoints) => {
      config.bpm = bpm;
      config.mods = mods;
      config.timingPoints = timingPoints;
      config.lastUpdate = new Date().toISOString();
    });
  };

  ws.onclose = () => {
    console.log(`Disconnected from osu! ${name} update feed, reconnecting...`);
    runMapDataWebSocket(config);
  };

  ws.onerror = () => {};
};

module.exports = { runMapDataWebSocket };
