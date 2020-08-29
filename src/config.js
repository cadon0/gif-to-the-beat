// ==============================================================================
//            Changing these settings requires reloading the website.
// If using OBS, click "Refresh cache of the current page" in the Browser source
// ==============================================================================
// Dimensions of the gif
const width = 112;
const height = 112;
const spritesheetWidth = 17696;
// The number of frames in the spritesheet
const frames = spritesheetWidth / width;
// The location of the gif in sprite sheet form,
// either a URL or a file within the images folder
const spritesheetLocation = "./catjam-spritesheet.png";
// "BPM" of the gif
const bpm = 124;
// Approximate gif length
const seconds = 6.3;

// ==============================================================================
//             Changing these settings requires restarting the server
// ==============================================================================
// The port the server will run on
const port = 727;
// Whether you are running StreamCompanion for BPM updates or not
const usingStreamCompanion = true;
// A file to read BPM changes from if not using StreamCompanion.
// It should only ever contain a single number
const bpmFile = "C:\\Program Files (x86)\\StreamCompanion\\Files\\bpm.txt";

module.exports = {
  width,
  height,
  spritesheetWidth,
  frames,
  spritesheetLocation,
  bpm,
  seconds,
  port,
  usingStreamCompanion,
  bpmFile,
};
