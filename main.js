import {
  html,
  Component,
  render,
} from "https://unpkg.com/htm/preact/standalone.module.js";

// The location of the gif in sprite sheet form,
// either a URL or a file path within this directory
const spritesheetLocation = "./catjam-spritesheet.png";
// Dimensions of the original gif
const width = 112;
const height = 112;
// Width of the entire spritesheet of the gif
const spritesheetWidth = 17696;
// "BPM" of the original gif
const bpm = 124;
// Approximate gif length in seconds
const seconds = 6.3;

// Calculate number of sprites in the spritesheet
const frames = spritesheetWidth / width;

class CatJam extends Component {
  constructor() {
    super();
    this.state = {
      newBpm: bpm,
    };
  }

  componentDidMount() {
    setInterval(() => {
      fetch("./config.json")
        .then((response) => response.json())
        .then((json) => {
          // Use default speed if the BPM is more than just a single number,
          // e.g. a range "159-194 (194)"
          this.setState({
            newBpm: isNaN(json.bpm) ? bpm : json.bpm,
          });
        });
    }, 1000);
  }

  render() {
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
