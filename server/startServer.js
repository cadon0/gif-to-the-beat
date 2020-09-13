const express = require("express");
const path = require("path");

const { writeCss } = require("./writeCss");
const { gifConfigurations, port } = require("./config");
const { runMapDataWebSocket } = require("./mapDataWebSocket");
const { runLiveDataWebSocket } = require("./liveDataWebSocket");

writeCss(gifConfigurations);

console.log("Starting up server...");

const app = express();

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../app/styles")));
app.use(express.static(path.join(__dirname, "../app/images")));

// WebSockets write the output from StreamCompanion to this object
const config = {};

app.get("/config", (req, res) => {
  const gifName = req.query.gifName;
  let gifConfigToUse = gifConfigurations.find(
    (gifConfiguration) => gifConfiguration.gifName === gifName
  );

  if (!gifConfigToUse) gifConfigToUse = gifConfigurations[0];

  res.json({
    ...gifConfigToUse,
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
