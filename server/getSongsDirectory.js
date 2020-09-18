const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")({ sigint: true });

const songDirectoryFile = path.resolve(__dirname, "../song-directory.txt");

let songDirectory;

/**
 * Gets the osu! "songs" directory, as .osu files contain a song's timing points
 * which are necessary for syncing over the duration of a song
 */
function getSongsDirectory() {
  if (fs.existsSync(songDirectoryFile)) {
    songDirectory = fs.readFileSync(songDirectoryFile, { encoding: "utf-8" });
    console.log(`Loaded songs directory from ${songDirectoryFile}`);
  } else {
    console.log(
      "\n\nFirst time? Please enter the path to the osu! songs folder"
    );
    console.log(
      "\te.g. C:\\Users\\<your_username>\\AppData\\Local\\osu!\\Songs"
    );
    while (!songDirectory) {
      const songDirectoryFromUser = path.resolve(prompt(">"));
      if (fs.existsSync(songDirectoryFromUser)) {
        fs.writeFileSync(songDirectoryFile, songDirectoryFromUser);
        console.log("Saved songs directory for next time");
        songDirectory = songDirectoryFromUser;
      } else {
        console.log("That directory doesn't appear to exist, please try again");
      }
    }
  }

  return songDirectory;
}

module.exports = { getSongsDirectory };
