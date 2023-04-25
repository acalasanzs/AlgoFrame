const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const config = {
  target: 'web',
  entry: {
    index: './index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'algoframe.js',
    library: 'AlgoFrame',
    libraryTarget: 'umd',
  },
  plugins: [new UnminifiedWebpackPlugin()],
};

module.exports = config;
