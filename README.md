# gif-to-the-beat

Listens to stats on the song currently playing in osu! and syncs a gif to the beat

Designed such that it can be used as a "plugin" for [OBS](https://obsproject.com/)

[Video demonstration](https://www.youtube.com/watch?v=KW616nsW86k&feature=youtu.be)

## Requirements:

- [Node.js](https://nodejs.org/en/download/)
- [StreamCompanion](https://github.com/Piotrekol/StreamCompanion/releases) - please get [this version](https://github.com/Piotrekol/StreamCompanion/releases/tag/v200813.17) if the latest release does not work

> IMPORTANT: StreamCompanion as of v200813.17 is currently missing a key feature for syncing.
> You can manually patch it by downloading [this file](https://puu.sh/GpKpW/d05e1aa9ec.dll) and replacing the original in StreamCompanion's Plugin folder - e.g. `C:\Program Files (x86)\StreamCompanion\Plugins`

## How to use:

- Download a copy of this project (or clone it)
- Double-click `start.bat`. It'll say when it's ready
  - A manual setup is running the commands `npm ci` & `npm start`
- Add a "Browser" source in OBS and enter the URL `http://localhost:727/`
  - This URL can also be opened in a browser, useful if you need to fiddle with offset values
  - The port number can be changed in [config.js](./src/config.js) (if in doubt edit with notepad)

> IMPORTANT: Next time, if OBS is opened _before/without_ starting the server first, the gif may not display.
> Please open the browser source settings once you have started the server and click "Refresh cache of the current page"

### Integration with osu!

- Open StreamCompanion's settings to the "Output patterns" tab
- Add three entries, name them:
  - `liveInfo` with formatting `!status!,!time!,!isotime!`
  - `bpmInfo` with formatting `!mainbpm!,!mods!`
  - `osuFile` with formatting `!osufilelocation!`
- For each entry set the "Save event" dropdown to `All`
- Check "Enable WebSocketServer output of patterns"
- Click "Save"!

![image](https://user-images.githubusercontent.com/25311843/91656816-f2dfa000-eb0f-11ea-99aa-294c7a2dd7eb.png)

## Missing features:

- Adjust at bpm changes mid-song
- Detect song restarts
- osu! integration without StreamCompanion
- Ability to accept a gif instead of requiring a manual sprite sheet conversion
- GUI

## How do I adjust the speed of my own gif?

> WARNING: If a gif has an uneven cycle time for each "beat" it will likely get out of sync with the music.
> For example, certain frames of the CatJam gif had to be removed. You can edit the frames of a gif [here](https://ezgif.com/maker) (upload then select the "frames" button)

- Take your gif and [generate a sprite sheet](https://ezgif.com/gif-to-sprite)
  - Check the "Stack horizontally" box, the sprites should be in a single line from left to right
- In [config.js](./server/config.js) update:
  - width
  - height
  - spritesheetWidth
  - spritesheetLocation
  - originalBpm - you can tap along to each "beat" of the gif at [this website](https://www.all8.com/tools/bpm.htm)
  - seconds - you can time it with a stopwatch, gifs don't tend to tell you their length
  - offset - if the gif starts mid-cycle this is how you get it to sync
    - Rearranging the frames of the gif so it starts on-beat can make this easier (see link in warning above, but drag & drop frames)
