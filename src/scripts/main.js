import React from "react";
import ReactDOM from "react-dom";

class CatJam extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleConfig = (config) => {
    const { bpm, mods, timingPoints } = config;
    // Only update if these things changed
    const updateString = `${bpm}${mods}${JSON.stringify(timingPoints)}`;
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

    const {
      seconds,
      originalBpm,
      mods,
      width,
      height,
      spritesheetWidth,
      spritesheetLocation,
    } = this.state.config;
    let { bpm } = this.state.config;

    // StreamCompanion saves map info on startup and doesn't
    // watch for new additions, resulting in it saying "0"
    if (bpm == 0) return;
    // TODO: When status available, only multiply if status is "Playing"
    if (mods.find((mod) => mod === "DT" || mod === "NC")) bpm *= 1.5;

    const frames = spritesheetWidth / width;
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
