const express = require("express");
const path = require("path");

const config = require("./config");
const { runMapDataWebSocket } = require("./mapDataWebSocket");
const { runLiveDataWebSocket } = require("./liveDataWebSocket");

console.log("Starting up server...");

runMapDataWebSocket(config);
runLiveDataWebSocket(config);

const app = express();

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../app/styles")));
app.use(express.static(path.join(__dirname, "../app/images")));

app.get("/config", (req, res) => {
  res.json(config);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../app/index.html"));
});

const port = config.port;
app.listen(port, () =>
  console.log(`Now hosting a website on http://localhost:${port} :-)`)
);
