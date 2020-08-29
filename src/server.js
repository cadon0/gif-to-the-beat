const express = require("express");
const path = require("path");

const config = require("./config");
const { runWebSocket } = require("./webSocket");
const { getBpmFromFile } = require("./scripts/getBpmFromFile");
const { bpmFile } = config;

console.log("Starting up server...");

if (config.usingStreamCompanion) {
  runWebSocket(config);
}

const app = express();

app.use(express.static(path.join(__dirname, "./scripts")));
app.use(express.static(path.join(__dirname, "./styles")));
app.use(express.static(path.join(__dirname, "./images")));

app.get("/bpm", (req, res) => {
  if (!config.usingStreamCompanion && bpmFile) {
    const currentBpm = req.query.currentBpm;
    return res.json(getBpmFromFile(currentBpm, bpmFile, res));
  }
  return res.json(config.bpm);
});

app.get("/config", (req, res) => {
  res.json(config);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

const port = config.port;
app.listen(port, () =>
  console.log(`Now hosting a website on http://localhost:${port} :-)`)
);
