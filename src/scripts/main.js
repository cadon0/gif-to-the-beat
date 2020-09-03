import React from "react";
import ReactDOM from "react-dom";

class CatJam extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  loadConfig = () => {
    fetch("/config")
      .then((response) => response.json())
      .then((config) => {
        this.setState({
          config,
        });
      })
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
      bpm,
      width,
      height,
      spritesheetWidth,
      spritesheetLocation,
    } = this.state.config;

    // StreamCompanion saves map info on startup and doesn't
    // watch for new additions, resulting in it saying "0"
    if (bpm == 0) return;

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
