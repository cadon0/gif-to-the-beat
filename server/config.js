// ==========================================================
//     Changing settings requires a restart of the server
//   Refreshing the browser source or any open browser tabs
//       is also required after the restart is complete
// ==========================================================

// Dimensions of the gif
const width = 112;
const height = 112;
const spritesheetWidth = 16016;
// "BPM" of the Original gif
const originalBpm = 136.8;
// Length of the original gif
const seconds = 5.69;
// Milliseconds until the gif hits the first "beat"
const offset = 0;
// The location of the gif in sprite sheet form,
// either a URL or a file within the images folder
const spritesheetLocation = "./catjam-spritesheet.png";

// The port the server will run on
const port = 727;

module.exports = {
  width,
  height,
  spritesheetWidth,
  originalBpm,
  bpm: originalBpm,
  seconds,
  offset,
  spritesheetLocation,
  port,
};
