const fs = require("fs");
const path = require("path");

writeCss = (gifConfigs) => {
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
};

module.exports = { writeCss };
