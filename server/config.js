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
const originalBpm = 136.3636;
// Length of the original gif
const seconds = 5.72;
// Milliseconds until the gif hits the first "beat".
// Increase to start earlier, decrease to start later
const gifOffset = 15;
// The location of the sprite sheet for the gif, either a URL
// or the name of a file in the images folder with "./" in front
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
  gifOffset,
  spritesheetLocation,
  port,
};
