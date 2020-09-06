import React from "react";
import ReactDOM from "react-dom";
import Tock from "tocktimer";

import config from "../../server/config";

const {
  width,
  height,
  spritesheetWidth,
  originalBpm,
  seconds,
  offset,
  spritesheetLocation,
} = config;
const frames = spritesheetWidth / width;

class GifToTheBeat extends React.Component {
  constructor() {
    super();
    this.state = {
      config: {
        ...config,
        mods: [],
      },
    };
    this.timers = [];
  }

  syncToSong = (config) => {
    const { timingPoints, mapTime, isoTime } = config;
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
      let msToNextBeat = timingPointOffset - mapTimeInMs;
      if (msToNextBeat < 0) {
        beatLength - (mapTimeInMs % beatLength);
        lastTimerSet = true;
      }

      let delay = msToNextBeat;
      // Start the gif before the next beat by the gif offset
      delay -= offset;
      // If there's not enough time for that, wait until the next beat
      if (delay < 0) delay += beatLength;

      // Use Tock as setTimeout is not precise
      const timer = Tock({
        countdown: true,
        complete: () => {
          this.setState({
            config: { ...config, bpm: (60 / beatLength) * 1000 },
          });
        },
      });
      const tockFriendlyDelay = Math.round(delay);
      timer.start(tockFriendlyDelay);
      this.timers.push(timer);
    });
  };

  handleConfig = (config) => {
    const { bpm, mods, timingPoints, status, mapTime } = config;

    // Only re-load the gif if these things changed
    const updateString = `${bpm}${mods}${status}${JSON.stringify(
      timingPoints
    )}`;
    if (updateString === this.lastUpdateString) return;

    // If the status changed to "Playing" wait until the map time isn't 0
    // since that would indicate loading has finished
    // TODO: Handle map time switching to 0 slightly after status updated to "Playing"
    if (status === "Playing" && mapTime === 0) return;

    this.lastUpdateString = updateString;

    // Editing offers slower playback which would currently be difficult to detect,
    // and lots of pausing/rewinding. It's probably not worth trying to sync with
    if (status === "Editing")
      return this.setState({ config: { ...config, bpm: originalBpm } });

    // No timing points available for syncing to song
    if (!timingPoints) return this.setState({ config });

    this.syncToSong(config);
  };

  loadConfig = () => {
    fetch("/config")
      .then((response) => response.json())
      .then(this.handleConfig)
      .catch((err) => {
        console.error(`Error loading config: ${err}`);
        console.error(`The config was: ${JSON.stringify(config)}`);
      });
  };

  componentDidMount() {
    setInterval(this.loadConfig, 500);
  }

  render() {
    if (!this.state.config) return null;

    const { mods, status } = this.state.config;
    let { bpm } = this.state.config;

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
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: `url(${spritesheetLocation}) left center`,
          animation: `play ${newSeconds}s steps(${frames}) infinite`,
        }}
      ></div>
    );
  }
}

ReactDOM.render(<GifToTheBeat />, document.getElementById("app"));
