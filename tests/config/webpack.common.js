const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const config = {
  context: path.resolve(__dirname, '../src'),
  devtool: 'source-map',
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
      {
        test: /\.css$/,
        use: [
          {
            loader: 'css-modules-typescript-loader',
            options: {
              mode: process.env.CI ? 'verify' : 'emit',
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
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
      template: '../public/index.html',
    }),
  ],
};

module.exports = config;
