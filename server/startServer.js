const express = require("express");
const path = require("path");

const { gifDetails, port } = require("./config");
const { runMapDataWebSocket } = require("./mapDataWebSocket");
const { runLiveDataWebSocket } = require("./liveDataWebSocket");

console.log("Starting up server...");

const app = express();

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../app/styles")));
app.use(express.static(path.join(__dirname, "../app/images")));

// WebSockets write the output from StreamCompanion to this object
const config = {};

app.get("/config", (req, res) => {
  const gifName = req.query.gifName;
  let gifConfig = gifDetails.find((details) => details.gifName === gifName);
  if (!gifConfig) gifConfig = gifDetails[0];
  res.json({
    ...gifConfig,
    ...config,
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../app/index.html"));
});

app.listen(port, () => {
  console.log(`
========================================================================
          Now hosting a website on http://localhost:${port} :-)
========================================================================
`);
  runMapDataWebSocket(config);
  runLiveDataWebSocket(config);
});
