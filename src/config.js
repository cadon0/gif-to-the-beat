// ============================================
//     Changing settings requires a restart
// ============================================

// Dimensions of the gif
const width = 112;
const height = 112;
const spritesheetWidth = 16016;
// The number of frames in the spritesheet
const frames = spritesheetWidth / width;
// "BPM" of the gif
const bpm = 136.8;
// Gif length
const seconds = 5.69;
// The location of the gif in sprite sheet form,
// either a URL or a file within the images folder
const spritesheetLocation = "./catjam-spritesheet.png";

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
