const fs = require("fs");
const path = require("path");

/**
 * Writes a `@keyframes` setting into CSS to match each gif configuration,
 * since it depends on each sprite sheet's size.
 * This means only the configuration needs to be maintained
 *
 * @param {Object[]} gifConfigs - the configurations for each available gif
 */
function writeCss(gifConfigs) {
  let css = `body {
  margin: 0;
}\n`;

  gifConfigs.forEach((gifConfig) => {
    css += `\n@keyframes ${gifConfig.gifName} {
  100% {
    background-position: -${gifConfig.spritesheetWidth}px;
  }
}\n`;
  });
  try {
    fs.writeFileSync(path.resolve(__dirname, "../app/styles/styles.css"), css);
  } catch (error) {
    throw new Error(
      `Failed to write "styles.css" file for animations: ${error.message}`
    );
  }
}

module.exports = { writeCss };
