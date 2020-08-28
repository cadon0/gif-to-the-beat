// Dimensions of the gif
const width = 112;
const height = 112;
const spritesheetWidth = 17696;
// The location of the gif in sprite sheet form,
// either a URL or a file within the images folder
const spritesheetLocation = "./catjam-spritesheet.png";
// "BPM" of the gif
const bpm = 124;
// Approximate gif length
const seconds = 6.3;

// The path to a file to get BPM updates from,
// it should only ever contain a single number
const bpmFile = "C:\\Program Files (x86)\\StreamCompanion\\Files\\bpm.txt";
// The port the server will run on
const port = 727;

module.exports = {
  bpmFile,
  port,
  spritesheetLocation,
  width,
  height,
  spritesheetWidth,
  frames: spritesheetWidth / width,
  bpm,
  seconds,
};
