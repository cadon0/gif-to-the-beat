# Gif speeder-upper

Or slower-downer...
Designed such that it can be used as a "plugin" for [OBS](https://obsproject.com/).

[Video demonstration](https://www.youtube.com/watch?v=KW616nsW86k&feature=youtu.be)

## Requirements:

- [Node.js](https://nodejs.org/en/download/) must be installed

## How to use:

- Clone or download a copy of this project
- Double-click `start.bat`. It'll say when it's ready
- Add a "Browser" source in OBS and enter the URL `http://localhost:727/`
  - Navigating to the URL in a browser is also an option
  - The port number can be changed in [config.js](./src/config.js) (requires server restart)

> IMPORTANT: Next time, if OBS is opened _before/without_ starting the server first, the gif may not display.
> Please open the Browser source once you have started the server and click "Refresh cache of the current page"

### Integration with osu!

Currently requires [StreamCompanion](https://github.com/Piotrekol/StreamCompanion)

- Open StreamCompanion's settings to the "Output patterns" tab
- Add a new entry and name it `bpm` and set the formatting to `!mainbpm!`
- Set the "Save event" dropdown to `All`, or whichever configuration you prefer
- Click "Save"!
- Update `bpmFile` in [config.js](./src/config.js)
  - The "General" tab of StreamCompanion's settings has an "Open" button to easily find the location

## Missing features:

- osu! integration without StreamCompanion
- Syncing the gif to the song (if possible)
- Detecting music paused/stopped
- Ability to accept a gif instead of requiring an outside sprite sheet conversion
- GUI

## How do I adjust the speed of my own gif?

- Take your gif and [generate a sprite sheet](https://ezgif.com/gif-to-sprite)
  - Check the "Stack horizontally" box, the sprites should be in a single line from left to right
- In [config.js](./src/config.js) update:
  - width
  - height
  - spritesheetWidth
  - spritesheetLocation
  - bpm - you can tap along to each "beat" of the gif at [this website](https://www.all8.com/tools/bpm.htm)
  - seconds - a stopwatch works fine
