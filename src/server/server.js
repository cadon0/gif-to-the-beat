const express = require("express");
const path = require("path");

const config = require("../config");

console.log("Starting up server...");

runLiveDataWebSocket(config);
runMapDataWebSocket(config);

const app = express();

app.use(express.static(path.join(__dirname, "../../dist")));
app.use(express.static(path.join(__dirname, "../styles")));
app.use(express.static(path.join(__dirname, "../images")));

app.get("/config", (req, res) => {
  res.json(config);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

const port = config.port;
app.listen(port, () =>
  console.log(`Now hosting a website on http://localhost:${port} :-)`)
);
