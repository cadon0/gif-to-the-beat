# gif-to-the-beat

Listens to stats on what's playing in osu! and syncs a gif to the beat. [Video demonstration](https://youtu.be/aDBeuo3ENqU)

Designed such that it can be used as a "plugin" for [OBS](https://obsproject.com/)

This will not work with [osu!lazer](https://github.com/ppy/osu) and has only been tested on Windows

A thank you to [Piotrekol](https://github.com/Piotrekol) for providing software
which can extract information from osu!, such as [ProcessMemoryDataFinder](https://github.com/Piotrekol/ProcessMemoryDataFinder).
For other osu! stream overlays you may be interested in their [StreamCompanion](https://github.com/Piotrekol/StreamCompanion) project

# Contents

- [Requirements](#requirements)
- [Settings](#settings)
- [How to use](#how-to-use)
  - [Short version](#short-version)
  - [Long version](#long-version)
- [Multiple gifs?](#multiple-gifs)
- [Help! It doesn't work](#help-it-doesnt-work)
- [It's out of sync!](#its-out-of-sync)
- [How do I add a different gif?](#how-do-i-add-a-different-gif)
- [Missing features](#missing-features)
- [License](#license)

# Requirements:

- [Node.js](https://nodejs.org/en/download/) must be installed. Latest LTS recommended.

# Settings

Configuration or settings are mentioned a few times throughout the instructions.
They can usually be found in the [`config.js`](./server/config.js) file in the `server` folder

If in doubt it can always be opened and edited with Nodepad

# How to use:

#### Short version:

- Download [this .zip file](https://github.com/cadon0/gif-to-the-beat/releases/download/v1.0.1/gif-to-the-beat.zip). Extract it anywhere
- Open the folder and double-click `start.bat`
  - You will be asked to enter the osu! "Songs" folder if running for the first time
- Add a "Browser" source in OBS with URL `http://localhost:727/catjam` and `width`/`height` 112
  - Open the URL in a web browser to check that it's syncing correctly as the OBS preview is delayed

> IMPORTANT: The gif may not display next time if OBS is opened _before/without_ running `start.bat` first.
> Please open the settings for the source in OBS once it is running, and click "Refresh cache of the current page"

#### Long version:

- Download:

  - The [latest release](https://github.com/cadon0/gif-to-the-beat/releases) or [source code](https://github.com/cadon0/gif-to-the-beat/archive/master.zip)
  - A [`GifToTheBeatDataProvider.exe` file](https://github.com/cadon0/ProcessMemoryDataFinder/releases)

- Place `GifToTheBeatDataProvider.exe` into the main folder like so:

  ![image](https://user-images.githubusercontent.com/25311843/93601811-e1eec400-fa15-11ea-81c6-2cd2864433a3.png)

- Run `start.bat`
  - An alternative is to run the commands `npm ci` (first time only) and `npm start` from the root directory of this project
- Provide the osu! "Songs" folder location if this is the first time
  - The songs folder location is saved in `song-directory.txt`. If there was a mistake this file can be edited or deleted
- Add a "Browser" source in OBS and enter the URL e.g. `http://localhost:727/catjam`
  - this URL can also be opened in a browser, useful if you need to fiddle with offset values
  - the port number is a setting that can be changed

# Multiple gifs?

More sources can be added to OBS for more gifs by adding their names (this is the `gifName` in their [settings](./server/config.js)) to the end of the URL
e.g. the two samples would be `http://localhost:727/catjam` and `http://localhost:727/pikachu`

# Help! It doesn't work

Please check the common issues below, or [open an issue](https://github.com/cadon0/gif-to-the-beat/issues/new)

- The `.exe` file may need to be updated, check for the latest one [here](https://github.com/cadon0/ProcessMemoryDataFinder/releases)

- > The application to execute does not exist: 'C:\Users\<name>\AppData\Local\Temp.net\GifToTheBeatDataProvider\xvqwwjrg.y50\GifToTheBeatDataProvider.dll'.`

  Please delete this folder it mentions and try again: `C:\Users\<name>\AppData\Local\Temp.net\GifToTheBeatDataProvider`

# It's out of sync!

In the osu! editor? The `disableSyncInEditor` setting can be changed to `false`

In the configuration file there are offset values for each gif.
Increase the offset if the gif appears to hit the beat after the song does, otherwise decrease

Each change to settings requires a restart

It's recommended to view the gif from a browser while tuning as the OBS preview is delayed. Note that the browser does not need to be refreshed

# How do I add a different gif?

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

1. Add or edit your browser source in OBS, the end of the link should match the `gifName`. Refresh the cache if the image or settings don't update in OBS

![image](https://user-images.githubusercontent.com/25311843/128113821-ca254db4-8881-4ae9-b1b4-f21bf79d6f88.png)

# Missing features:

- Assisted offset tuning
- Only requiring a gif instead of a manual sprite sheet conversion
- A simpler way to calculate the exact length of a gif
- Electron GUI for automatic updates, adding/configuring gifs, etc.

# License

[MIT](./LICENSE)
