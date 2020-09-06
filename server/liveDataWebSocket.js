const WebSocket = require("ws");

const name = "LiveData";
const debug = false;

runLiveDataWebSocket = (config) => {
  const ws = new WebSocket(`ws://localhost:80/StreamCompanion/${name}/Stream`);

  ws.onopen = () => {
    console.log(`Connected to osu! ${name} update feed`);
  };

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    // This feed updates ~10 times per second
    if (debug) console.log(data);
    const [status, mapTime, isoTime] = data.liveInfo.split(",");

    config.status = status;
    config.mapTime = mapTime;
    config.isoTime = isoTime;
  };

  ws.onclose = () => {
    console.log(`Disconnected from osu! ${name} update feed, reconnecting...`);
    runLiveDataWebSocket(config);
  };

  ws.onerror = () => {};
};

module.exports = { runLiveDataWebSocket };
