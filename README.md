# Gif speeder-upper

Or slower-downer...
Designed such that it can be used as a "plugin" for [OBS](https://obsproject.com/).

## Requirements:
- [Node.js](https://nodejs.org/en/download/) must be installed

## How to use:
- Clone this project
- Run `npx serve` from the projects root directory
- Copy the Local URL once displayed, e.g. http://localhost:5000/
- Add a "Browser" source in OBS and enter the URL or;
- Navigate to the URL in your favourite browser

## Roadmap:
- Integration with a live BPM feed

## How do I adjust the speed of my own gif?
- Take your gif and [generate a sprite sheet](https://ezgif.com/gif-to-sprite)
  - Check the "Stack horizontally" box, the sprites should be in a single line from left to right
- In [main.js](./main.js) update:
  - spritesheetPath
  - width
  - height
  - spritesheetWidth
  - bpm - you can tap at each "beat" with [this website](https://www.all8.com/tools/bpm.htm)
  - seconds - a stopwatch works fine
- In [config.json](./config.json) set a desired BPM
