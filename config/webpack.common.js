const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const config = {
  target: 'web',
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
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
  plugins: [
    new UnminifiedWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'our project',
      template: 'src/index.html',
    }),
  ],
};

module.exports = config;
