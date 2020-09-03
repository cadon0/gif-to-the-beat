module.exports = {
  entry: "./app/scripts/main",
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
  output: {
    filename: "app.bundle.js",
  },
};
