const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { osuDataFeedPort } = require("./config");

/**
 * Runs an executable which reads the memory of the osu! process
 * to determine the current song and status. The output of that data is via WebSocket
 */
function runOsuMemoryReader() {
  const exe = path.resolve(__dirname, "../GifToTheBeatDataProvider.exe");
  if (fs.existsSync(exe)) {
    console.log("Starting osu! memory reader...");
    execFile(exe, [osuDataFeedPort], (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        console.error("Error running osu! memory reader:");
        console.error(error);
        runOsuMemoryReader();
      }
    });
  } else {
    console.error(`File not found: ${exe}`);
    console.error(
      "This is downloaded separately, please refer to the instructions."
    );
    process.exit(1);
  }
}

module.exports = { runOsuMemoryReader };
