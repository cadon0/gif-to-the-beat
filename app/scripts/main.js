import React from "react";
import ReactDOM from "react-dom";

import config from "../../server/config";

const { width, height, spritesheetWidth, spritesheetLocation } = config;
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
    const { bpm, mods, timingPoints, status } = config;
    // Only update if these things changed
    const updateString = `${bpm}${mods}${status}${JSON.stringify(
      timingPoints
    )}`;
    if (updateString === this.lastUpdateString) return;

    // Sync to song
    let delay = 0;
    if (timingPoints) {
      const { mapTime } = config;
      // Assuming 40ms delay from snapshot of map time until now
      const mapTimeInMs = mapTime / 1000 + 40;
      const beatLength = timingPoints[0].split(",")[1];
      const msToNextBeat = beatLength - (mapTimeInMs % beatLength);
      delay = msToNextBeat;
    }

    this.lastUpdateString = updateString;
    setTimeout(
      () =>
        this.setState({
          config,
        }),
      // Assuming approx. 250ms delay between setTimeout and render
      delay - 250
    );
  };

  loadConfig = () => {
    fetch("/config")
      .then((response) => response.json())
      .then(this.handleConfig)
      .catch((err) => {
        console.error(`Error loading config: ${err}`);
      });
  };

  componentDidMount() {
    setInterval(this.loadConfig, 1000);
  }

  render() {
    if (!this.state.config) return null;

    const { seconds, originalBpm, mods, status } = this.state.config;
    let { bpm } = this.state.config;

    if (bpm == 0) {
      bpm = originalBpm;
      console.error(
        "StreamCompanion doesn't detect maps added in the osu! session, using default bpm"
      );
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
