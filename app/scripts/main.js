import React from "react";
import ReactDOM from "react-dom";
import Tock from "tocktimer";

class GifToTheBeat extends React.Component {
  constructor() {
    super();
    this.state = {
      config: {
        mods: [],
      },
    };
    this.timers = [];
  }

  /**
   * Sets timers to sync the gif for the rest of the current songs duration.
   * One for each time the bpm will change, and one almost immediately
   *
   * @param {Object} config
   */
  syncToSong = (config) => {
    const { timingPoints, mapTime, isoTime, gifOffset } = config;

    // Clear previous timers
    this.timers.forEach((timer) => timer.stop());
    this.timers = [];

    // Calculate how far through the song is currently
    const msSinceSnapshot = new Date() - new Date(isoTime);
    const mapTimeInMs = mapTime * 1000 + msSinceSnapshot;

    let lastTimerSet;
    // Iterate through the timing points while setting timers
    // which change the bpm once they've counted down.
    // Reverse order allows ignoring any timing points that have already passed
    timingPoints.reverse().forEach((timingPoint) => {
      if (lastTimerSet) return;

      const [timingPointOffset, beatLength] = timingPoint.split(",");
      // Calculate how long until this timing point becomes active
      let msToNextBeat = timingPointOffset - mapTimeInMs;
      // The gif should also start relative to this by its offset
      msToNextBeat -= gifOffset;
      if (msToNextBeat < 0) {
        // Under 0 means that this timing point is active right now,
        // so to sync the gif it simply needs to start at the next beat
        const msSinceCurrentTimingPointStarted =
          mapTimeInMs - timingPointOffset;
        const msThroughCurrentBeat =
          msSinceCurrentTimingPointStarted % beatLength;
        msToNextBeat = beatLength - msThroughCurrentBeat;
        lastTimerSet = true;
      }

      // Use Tock as setTimeout is not precise
      const timer = Tock({
        countdown: true,
        complete: () => {
          this.setState({
            config: { ...config, bpm: (60 / beatLength) * 1000 },
          });
        },
      });
      const tockFriendlyDelay = Math.round(msToNextBeat);
      timer.start(tockFriendlyDelay);
      this.timers.push(timer);
    });
  };

  /**
   * Handles the latest config from the server.
   * It starts by returning early if there's no need to re-sync the gif
   * to the song, so that the gif animation will not be interrupted
   *
   * @param {Object} config
   */
  handleConfig = (config) => {
    const { originalBpm, timingPoints, status, osuFile } = config;
    const mapTime = Number(config.mapTime);

    const osuFileChanged = osuFile !== this.lastOsuFile;
    if (!osuFileChanged) {
      // Song is unchanged but many things can affect the time it's at
      const mapTimeDiffInSeconds = mapTime - this.lastMapTime;
      const mapTimeMovedBackward = mapTimeDiffInSeconds < 0;
      const mapTimeMovedAhead = mapTimeDiffInSeconds > 2;
      if (!mapTimeMovedBackward && !mapTimeMovedAhead) {
        this.lastMapTime = mapTime;
        return;
      }
    }

    if (status === "Playing") {
      // Wait until the map time is past 0 since that would indicate loading has finished
      if (mapTime <= 0) return;
    } else if (status !== "Playing") {
      // The LiveData socket can still be sending data for the previous song for a while after a change
      if (!this.waitOneCycle) {
        this.waitOneCycle = true;
        return;
      } else {
        this.waitOneCycle = false;
      }
    }

    // Gif will be synced past this point
    this.lastOsuFile = osuFile;
    this.lastMapTime = mapTime;

    // Editing offers slower playback which would currently be difficult to detect,
    // and lots of pausing/rewinding. It's probably not worth trying to sync with
    if (status === "Editing")
      return this.setState({ config: { ...config, bpm: originalBpm } });

    // No timing points available for syncing to song
    if (!timingPoints || !timingPoints.length) return this.setState({ config });

    this.syncToSong(config);
  };

  loadConfig = () => {
    const gifName = window.location.pathname.slice(1);
    fetch(gifName ? `/config?gifName=${gifName}` : "/config")
      .then((response) => response.json())
      .then(this.handleConfig)
      .catch((err) => {
        console.error(`Error loading config: ${err}`);
        console.error(`The config was: ${JSON.stringify(this.state.config)}`);
      });
  };

  componentDidMount() {
    setInterval(this.loadConfig, 500);
  }

  render() {
    if (!this.state.config) return null;

    const {
      gifName,
      width,
      height,
      spritesheetWidth,
      spritesheetLocation,
      seconds,
      originalBpm,
      bpm,
      mods,
      status,
      mapTime,
    } = this.state.config;
    const frames = spritesheetWidth / width;

    if (bpm == 0) {
      console.error(
        "StreamCompanion doesn't detect the bpm of maps added in the osu! session, using default bpm"
      );
      bpm = originalBpm;
    }

    if (status === "Playing") {
      const doubleTimeActive = mods.find((mod) => mod === "DT" || mod === "NC");
      if (doubleTimeActive) bpm *= 1.5;
      const halfTimeActive = mods.find((mod) => mod === "HT");
      if (halfTimeActive) bpm *= 0.75;
    }

    const newSeconds = (seconds * originalBpm) / bpm;

    return (
      <div
        // If a song rewinds and the bpm is the same then the style values here will not change either.
        // The gif needs to be redrawn to sync back to the song but React will not do that
        // if the render content is unchanged. Using this key ensures the render content changes
        key={mapTime}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: `url(${spritesheetLocation}) left center`,
          animation: `${gifName} ${newSeconds}s steps(${frames}) infinite`,
        }}
      ></div>
    );
  }
}

ReactDOM.render(<GifToTheBeat />, document.getElementById("app"));
