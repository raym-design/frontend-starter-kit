const common = require('./webpack.common.js');
const merge = require('webpack-merge');

const config = {
  watch: true,
  devtool: 'source-map',
};

module.exports = merge(common, config);
