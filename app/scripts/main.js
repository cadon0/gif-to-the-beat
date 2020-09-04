import React from "react";
import ReactDOM from "react-dom";
import Tock from "tocktimer";

import config from "../../server/config";

const {
  width,
  height,
  spritesheetWidth,
  seconds,
  offset,
  spritesheetLocation,
} = config;
const frames = spritesheetWidth / width;

class CatJam extends React.Component {
  constructor() {
    super();
    this.state = {
      config: {
        ...config,
        mods: [],
      },
    };
  }

  handleConfig = (config) => {
    const { bpm, mods, timingPoints, status, mapTime } = config;

    // Wait until the song starts,
    // starting the gif during loading would leave it out of sync
    if (status === "Playing" && mapTime <= 0) return;

    // Only re-load the gif if these things changed
    const updateString = `${bpm}${mods}${status}${JSON.stringify(
      timingPoints
    )}`;
    if (updateString === this.lastUpdateString) return;
    this.lastUpdateString = updateString;

    // Calculate delay to get in sync with song
    let delay = 0;
    if (timingPoints) {
      const mapTimeInMs = mapTime / 1000;
      const beatLength = timingPoints[0].split(",")[1];
      const msToNextBeat = beatLength - (mapTimeInMs % beatLength);
      delay = msToNextBeat;
      // Start the gif before the next beat by the offset
      delay -= offset;
      // If there's not enough time for that, wait until the next beat
      if (delay < 0) delay += beatLength;
    }

    const tockFriendlyDelay = Math.round(delay);
    // Use Tock as setTimeout is not precise
    var timer = Tock({
      countdown: true,
      complete: () => {
        this.setState({
          config,
        });
      },
    });
    timer.start(tockFriendlyDelay);
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

    const { originalBpm, mods, status } = this.state.config;
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

ReactDOM.render(<CatJam />, document.getElementById("app"));
