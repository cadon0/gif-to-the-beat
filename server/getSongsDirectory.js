const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")({ sigint: true });

const songDirectoryFile = path.resolve(__dirname, "../song-directory.txt");

let songDirectory;

getSongsDirectory = () => {
  try {
    // Check if songs directory saved already
    songDirectory = fs.readFileSync(songDirectoryFile, { encoding: "utf-8" });
  } catch (error) {
    // File doesn't exist yet
  }
  if (songDirectory) {
    console.log(`Loaded songs directory from ${songDirectoryFile}`);
  }
  if (!songDirectory) {
    console.log(
      "\n\nFirst time? Please enter the path to the osu! songs folder."
    );
    console.log(
      "\te.g. C:\\Users\\<your_username>\\AppData\\Local\\osu!\\Songs"
    );
    while (!songDirectory) {
      const songDirectoryFromUser = path.resolve(prompt(">"));
      if (fs.existsSync(songDirectoryFromUser)) {
        fs.writeFileSync(songDirectoryFile, songDirectoryFromUser);
        console.log("Saved songs directory for next time.");
        songDirectory = songDirectoryFromUser;
      } else {
        console.log(
          "That directory doesn't appear to exist, please try again."
        );
      }
    }
  }

  return songDirectory;
};

module.exports = { getSongsDirectory };
