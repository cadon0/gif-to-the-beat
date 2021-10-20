// ==========================================================
//     Changing settings requires a restart of the server
//   Refreshing the browser source or any open browser tabs
//       is also required after the restart is complete
// ==========================================================

// The ports to run on
const webServerPort = 727;
const osuDataFeedPort = 7270;

// By default, play gif at default speed while in the osu! editor because:
// - The editor offers slower playback which is not easily detectable
// - Keeping the gif in sync through pauses is not supported
// - Mapping often means a lot of short rewinds
// It can be enabled, but the experience may be poor
const disableSyncInEditor = true;

const gifConfigurations = [
  {
    // A name - used to match with URLs e.g. http://localhost:727/catjam
    gifName: "catjam",
    // Dimensions of the gif
    width: 112,
    height: 112,
    spritesheetWidth: 16016,
    // "BPM" of the Original gif
    originalBpm: 136.3636,
    // Length of the original gif
    seconds: 5.72,
    // Milliseconds until the gif hits the first "beat".
    // Increase to start the gif earlier relative to the music, decrease to start later
    gifOffset: 15,
    // The location of the sprite sheet for the gif, either a URL
    // or the name of a file in the images folder with "./" in front
    spritesheetLocation: "./catjam-spritesheet.png",
  },
];

module.exports = {
  webServerPort,
  osuDataFeedPort,
  disableSyncInEditor,
  gifConfigurations,
};
