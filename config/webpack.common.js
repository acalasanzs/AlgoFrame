const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const config = {
  target: 'web',
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'algoframe.js',
    library: 'AlgoFrame',
    libraryTarget: 'umd',
  },
  plugins: [new UnminifiedWebpackPlugin()],
};

module.exports = config;
