const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const JSRules = {
  test: /\.js$/,
  loader: "babel-loader",
  options: {
    presets: ["@babel/preset-env"],
  },
};
const CSSRules = {
  test: /\.css$/,
  use: ["style-loader", "css-loader"],
};

module.exports = {
  output: {
    path: path.resolve(__dirname, "site"),
  },
  module: {
    rules: [JSRules, CSSRules],
  },
  plugins: [new HtmlWebpackPlugin({ template: "src/index.html" })],
};
