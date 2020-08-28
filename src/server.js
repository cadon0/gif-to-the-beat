const express = require("express");
const path = require("path");
const { getBpm } = require("./scripts/getBpmFromFile");

const config = require("./config");

console.log("Starting up server...");

const app = express();

app.use(express.static(path.join(__dirname, "./scripts")));
app.use(express.static(path.join(__dirname, "./styles")));
app.use(express.static(path.join(__dirname, "./images")));

app.get("/bpm", (req, res) => {
  const currentBpm = req.query.currentBpm;
  res.json(getBpm(currentBpm, config, res));
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
