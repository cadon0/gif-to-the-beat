const express = require("express");
const path = require("path");

const { writeCss } = require("./writeCss");
const {
  gifConfigurations,
  webServerPort,
  disableSyncInEditor,
} = require("./config");
const { getOsuData, runListenerWebSocket } = require("./listenerWebSocket");
const { runOsuMemoryReader } = require("./runOsuMemoryReader");

console.log("\n\nStarting up...");

writeCss(gifConfigurations);

runOsuMemoryReader();

runListenerWebSocket();

const app = express();

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../app/styles")));
app.use(express.static(path.join(__dirname, "../app/images")));

app.get("/config", (req, res) => {
  const gifName = req.query.gifName;
  let gifConfigToUse = gifConfigurations.find(
    (gifConfiguration) => gifConfiguration.gifName === gifName
  );

  if (!gifConfigToUse) gifConfigToUse = gifConfigurations[0];

  res.json({
    ...gifConfigToUse,
    ...getOsuData(),
    disableSyncInEditor,
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../app/index.html"));
});

app.listen(webServerPort, () => {
  console.log(`
=====================================================================
            Now hosting a website on http://localhost:${webServerPort}
=====================================================================
`);
});
