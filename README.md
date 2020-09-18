# gif-to-the-beat

Listens to stats on what's playing in osu! and syncs a gif to the beat

Designed such that it can be used as a "plugin" for [OBS](https://obsproject.com/)

[Demo](https://youtu.be/tGu67o-DhTE)

## Requirements:

- [Node.js](https://nodejs.org/en/download/)
- [A `GifToTheBeatDataProvider.exe` file](https://github.com/cadon0/ProcessMemoryDataFinder/releases/tag/v1.0.0)
  - the smaller one requires certain versions of .NET which may need to be installed separately
  - the `-full` one should work out of the box if the size isn't a concern, rename it to remove the `-full` suffix

> Note: This has only been tested on Windows

## How to use:

- Download [the latest release](https://github.com/cadon0/gif-to-the-beat/releases) or source code
- Place the `GifToTheBeatDataProvider.exe` file downloaded earlier into the root directory (main folder) of this project
- Double-click `start.bat`. It'll say when it's ready and start reporting osu! information
  - a manual setup is running the commands `npm ci` (first time only) and `npm start` from the root directory of this project
- Add a "Browser" source in OBS and enter the URL `http://localhost:727/`
  - this URL can also be opened in a browser, useful if you need to fiddle with offset values
  - the port number can be changed in [config.js](./src/config.js) (if in doubt edit with notepad)

> IMPORTANT: Next time, if OBS is opened _before/without_ starting the server first, the gif may not display.
> Please open the browser source settings once you have started the server and click "Refresh cache of the current page"

### Help! It doesn't work

Please [open an issue](https://github.com/cadon0/gif-to-the-beat/issues/new)

### It's out of sync!

In the configuration file - [config.js](./server/config.js) in the `server` folder (if in doubt open it with Notepad) - there are offset values for each gif.
Increase the offset if the gif appears to hit the beat before the song does, otherwise decrease

For now each change requires a restart

It's recommended to view the gif from a browser while tuning as the OBS preview is delayed. Note that the browser does not need to be refreshed

### Multiple gifs?

More sources can be added for more gifs by adding their names (this is the `gifName` in their [settings](./src/config.js)) to the end of the URL
e.g. the two samples provided are `http://localhost:727/catjam` and `http://localhost:727/pikachu`

## How do I add a different gif?

> WARNING: If a gif has an uneven cycle time for each "beat" it will likely get out of sync with the music.
> For example, certain frames of the CatJam gif had to be removed.
> You can edit the frames of a gif [here](https://ezgif.com/maker) (upload then select the "frames" button)

1. Take your gif and [generate a sprite sheet](https://ezgif.com/gif-to-sprite)

   - check the "Stack horizontally" box, the sprites should be in a single line from left to right

1. Place the sprite sheet in the [images](./app/images) folder or upload it somewhere

1. In [config.js](./server/config.js) there are settings for each gif. Copy or replace one, and be sure to enclose sections with `{` & `}`, and separate by `,`.
   The settings are:

   - `gifName` - this will be matched with the URL e.g. the settings with `gifName` "pikachu" are used at `http://localhost:727/pikachu`
   - `width`
   - `height`
   - `spritesheetWidth`
   - `spritesheetLocation`
   - `gifOffset` - if the gif is slightly out of sync with osu! in general or does not start on the "beat" this is how you get it to sync
     - rearranging the frames of the gif so it starts on-beat can make this easier (again [upload here](https://ezgif.com/maker), click "frames", then rearrange)
   - `originalBpm`
     - you can tap along to each "beat" of the gif at [this website](https://www.all8.com/tools/bpm.htm)
       or in the osu! editor (timing tab, mute the music and tap with `T`)
     - if the gif length (`seconds`) is already known this can be calculated by `60 * beatsInGif / seconds = originalBpm`.
       e.g. CatJam has 13 "beats", `60 * 13 / 5.72 = 136.363...`
   - `seconds`
     - if the `originalBpm` is already known `60 * beatsInGif / originalBpm = seconds`.
       e.g. CatJam has 13 "beats", `60 * 13 / 136.363... = 5.72`
     - a stopwatch is okay. Let the gif cycle fully a number of times and take the average
     - the accurate but highly painful method: the gif can be [converted into `.mp4`](https://ezgif.com/gif-to-mp4)
       and then played in [VLC media player](https://www.videolan.org/vlc/) with [an extension](https://addons.videolan.org/p/1154032/).
       Use pattern `[E]` for the extension. It's a bit weird - 3400 milliseconds will be displayed as `03,400`

## Missing features:

- Assisted offset tuning
- Only requiring a gif instead of a manual sprite sheet conversion
- A simpler way to calculate the exact length of a gif
- Electron GUI for automatic updates, adding/configuring gifs, etc.
