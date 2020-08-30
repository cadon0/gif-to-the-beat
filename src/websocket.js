const WebSocket = require("ws");
const { getTimingPoints } = require("./scripts/updateTimingPoints");

runWebSocket = (config) => {
  console.log("Connecting to osu! update feed...");
  const ws = new WebSocket("ws://localhost:80/StreamCompanion/MapData/Stream");

  ws.onopen = () => {
    console.log("Connected to osu! update feed");
    setInterval(() => ws.ping(), 30000);
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log(data);
    const [bpm, mods] = data.bpmInfo.split(",");

    getTimingPoints(data.osuFile).then((timingPoints) => {
      config.bpm = bpm;
      config.mods = mods;
      config.timingPoints = timingPoints;
      config.lastUpdate = new Date().toISOString();
    });
  };

  ws.onclose = () => {
    const seconds = 5;
    console.log(
      `Disconnected from osu! update feed, reconnecting in ${seconds} seconds`
    );
    setTimeout(() => {
      runWebSocket(config);
    }, seconds * 1000);
  };

  ws.onerror = () => {};
};

module.exports = { runWebSocket };
