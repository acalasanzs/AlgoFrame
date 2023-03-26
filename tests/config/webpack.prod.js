const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const conf = {
  mode: 'production',
};

module.exports = merge(common, conf);
