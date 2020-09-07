# gif-to-the-beat

Listens to stats on the song currently playing in osu! and syncs a gif to the beat

Designed such that it can be used as a "plugin" for [OBS](https://obsproject.com/)

[Video demonstration](https://www.youtube.com/watch?v=KW616nsW86k&feature=youtu.be)

## Requirements:

- [Node.js](https://nodejs.org/en/download/)
- [StreamCompanion](https://github.com/Piotrekol/StreamCompanion/releases) -
  please get [this version](https://github.com/Piotrekol/StreamCompanion/releases/tag/v200813.17) if the latest release does not work

> IMPORTANT: StreamCompanion as of `v200813.17` is currently missing a key feature for syncing.
> You can manually patch it by taking `OsuMemoryEventSource.dll` from the [dll folder](./dll) once you download this project,
> and replace the original in StreamCompanion's Plugin folder (after making a backup of course) - e.g. `C:\Program Files (x86)\StreamCompanion\Plugins`

## How to use:

- Download a copy of this project (or clone it)
- Double-click `start.bat`. It'll say when it's ready
  - A manual setup is running the commands `npm ci` and `npm start`
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

![image](https://user-images.githubusercontent.com/25311843/92326306-36ed1a80-f0a5-11ea-9cd8-80211f9b3fc9.png)

## Missing features:

- osu! integration without StreamCompanion
- Only requiring a gif instead of a manual sprite sheet conversion
- A simpler way to calculate the exact length of a gif
- GUI

## How do I adjust the speed of my own gif?

> WARNING: If a gif has an uneven cycle time for each "beat" it will likely get out of sync with the music.
> For example, certain frames of the CatJam gif had to be removed.
> You can edit the frames of a gif [here](https://ezgif.com/maker) (upload then select the "frames" button)

Take your gif and [generate a sprite sheet](https://ezgif.com/gif-to-sprite)

- Check the "Stack horizontally" box, the sprites should be in a single line from left to right

Place the sprite sheet in the images folder or upload it somewhere.

In [config.js](./server/config.js) update:

- width
- height
- spritesheetWidth
- spritesheetLocation
- gifOffset - if the gif is slightly out of sync with osu! in general or does not start on the "beat" this is how you get it to sync
  - Rearranging the frames of the gif so it starts on-beat can make this easier
    (again [upload here](https://ezgif.com/maker), click "frames", then rearrange)

There are two more settings where accuracy is very important:

- seconds
  - a stopwatch is okay. Attempt a few times and take the average, or let the gif cycle 5 times and divive by 5 or something
  - the accurate but highly painful method: the gif can be [converted into `.mp4`](https://ezgif.com/gif-to-mp4)
    and then played in [VLC media player](https://www.videolan.org/vlc/) with [an extension](https://addons.videolan.org/p/1154032/).
    Use pattern `[E]` for the extension. It's a bit weird - 3400 milliseconds will be displayed as `03,400`
- originalBpm
  - assuming `seconds` is accurate, this can be calculated by `60 / seconds * beatsInGif`.
    e.g. CatJam has 13 "beats", `60 / 5.72 * 13 = 136.363...`
  - you can tap along to each "beat" of the gif at [this website](https://www.all8.com/tools/bpm.htm)
    or in the osu! editor (timing tab, mute the music and tap with `T`)
