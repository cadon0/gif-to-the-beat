const fs = require("fs");
const path = require("path");
const prompt = require("prompt-sync")({ sigint: true });

const songDirectoryFile = path.resolve(__dirname, "./song-directory.txt");

let songDirectory;

getSongsDirectory = () => {
  try {
    // Check if songs directory saved already
    songDirectory = fs.readFileSync(songDirectoryFile, { encoding: "utf-8" });
  } catch (error) {
    // File doesn't exist yet
  }

  if (!songDirectory) {
    console.log("First time? Please enter the path to the osu! songs folder.");
    console.log(
      "\tFor example: C:\\Users\\<your_username>\\AppData\\Local\\osu!\\Songs"
    );
    while (!songDirectory) {
      const songDirectoryFromUser = prompt(">");
      if (fs.existsSync(songDirectoryFromUser)) {
        fs.writeFileSync(songDirectoryFile, songDirectoryFromUser);
        console.log("Thanks! It's been saved for next time.");
        songDirectory = songDirectoryFromUser;
      } else {
        console.log(
          "That directory doesn't appear to exist, please try again."
        );
      }
    }
  }

  console.log(songDirectory);
  return songDirectory;
};

getSongsDirectory();

module.exports = { getSongsDirectory };
