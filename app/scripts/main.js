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

    this.setState({
      config,
    });
    this.lastUpdateString = updateString;
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
        "StreamCompanion doesn't detect newly added maps, using default bpm"
      );
    }

    const doubleTimeActive =
      status === "Playing" && mods.find((mod) => mod === "DT" || mod === "NC");
    if (doubleTimeActive) bpm *= 1.5;

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
