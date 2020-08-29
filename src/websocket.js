const WebSocket = require("ws");

(openConnection = () => {
  console.log("Connecting to osu! update feed...");
  const ws = new WebSocket("ws://localhost:80/StreamCompanion/MapData/Stream");

  ws.onopen = function () {
    console.log("Connected to osu! update feed");
    setInterval(() => ws.ping(), 30000);
  };

  ws.onmessage = function (e) {
    console.log(e.data);
  };

  ws.onclose = function () {
    console.log(
      "Disconnected from osu! update feed, reconnecting in 5 seconds"
    );
    setTimeout(() => {
      openConnection();
    }, 5000);
  };

  ws.onerror = () => {};
})();
