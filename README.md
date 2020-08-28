# Gif speeder-upper

Or slower-downer...
Designed such that it can be used as a "plugin" for [OBS](https://obsproject.com/).

[Video demonstration](https://www.youtube.com/watch?v=KW616nsW86k&feature=youtu.be)

## Requirements:

- [Node.js](https://nodejs.org/en/download/) must be installed

## How to use:

- Clone or download a copy of this project
- Run `npm install` from the projects root directory. You should only need to do this once per update to the project
  - A simple way to start running commands is, File -> Open Windows PowerShell, then enter them
- `npm start` may now be run. It starts a teeny web server on your machine which handles everything
- Add a "Browser" source in OBS and enter the URL `http://localhost:727/`
  - Navigating to the URL in your favourite browser is also an option
  - The port number can be changed in [./src/server.js](./src/server.js) (requires server restart)

> IMPORTANT: Next time, if OBS is opened _before/without_ starting the server first, the gif may not display.
> Please open the Browser source once you have started the server and click "Refresh cache of the current page"

### Integration with osu!

Currently requires [StreamCompanion](https://github.com/Piotrekol/StreamCompanion)

- Open StreamCompanion's settings to the "Output patterns" tab
- Add a new entry and name it `bpm` and set the formatting to `!mainbpm!`
- Set "Save event" to `All`, or whichever configuration you prefer
- Click "Save"!
- From the root directory of this project run `node src/scripts/watchBpmFile.js`
  - While running it'll continually copy the BPM output from StreamCompanion into this projects [config](./src/config/config.json)

## Missing features:

- One command (or click) to run
- Integration with osu! without StreamCompanion
- Detecting music paused/stopped
- Smarts for only reading files if they've changed
- Ability to accept a gif instead of requiring an outside sprite sheet conversion
- GUI

## How do I adjust the speed of my own gif?

- Take your gif and [generate a sprite sheet](https://ezgif.com/gif-to-sprite)
  - Check the "Stack horizontally" box, the sprites should be in a single line from left to right
- In [./src/scripts/main.js](./src/scripts/main.js) update:
  - spritesheetPath
  - width
  - height
  - spritesheetWidth
  - bpm - you can tap along to each "beat" of the gif at [this website](https://www.all8.com/tools/bpm.htm)
  - seconds - a stopwatch works fine
- For a fixed BPM update [./src/config/config.json](./src/config/config.json)
