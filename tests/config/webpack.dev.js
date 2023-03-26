const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const conf = {
  mode: 'development',
};

module.exports = merge(common, conf);
