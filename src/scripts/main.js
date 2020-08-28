import {
  html,
  Component,
  render,
} from "https://unpkg.com/htm/preact/standalone.module.js";

class CatJam extends Component {
  constructor() {
    super();
    this.state = {
      isLoadingConfig: true,
    };
  }

  getBpm = () => {
    fetch(`/bpm?currentBpm=${this.state.newBpm}`)
      .then((response) => response.json())
      .then((newBpm) =>
        this.setState({
          // Fall back to original BPM if value isn't a number
          newBpm: !isNaN(newBpm) ? newBpm : this.state.config.bpm,
        })
      )
      .catch((err) => {
        console.error(`Error checking for new BPM: ${err}`);
      });
  };

  componentDidMount() {
    fetch("/config")
      .then((response) => response.json())
      .then((config) => {
        this.setState({
          config,
          newBpm: config.bpm,
          isLoadingConfig: false,
        });
        if (config.bpmFile) setInterval(this.getBpm, 1000);
      })
      .catch((err) => {
        console.error(`Error loading config: ${err}`);
      });
  }

  render() {
    if (this.state.isLoadingConfig) return;

    const {
      seconds,
      bpm,
      width,
      height,
      spritesheetLocation,
      frames,
    } = this.state.config;
    const newSeconds = (seconds * bpm) / this.state.newBpm;

    return html`<div
      style="
        width: ${width}px;
        height: ${height}px;
        background: url(${spritesheetLocation}) left center;
        animation: play ${newSeconds}s steps(${frames}) infinite;
      "
    ></div>`;
  }
}

render(html`<${CatJam} />`, document.body);
