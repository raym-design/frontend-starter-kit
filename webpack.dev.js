const common  = require('./webpack.common.js');
const merge   = require('webpack-merge');
const webpack = require('webpack');

const config = {
  watch: true,
  devtool: 'source-map'
};

module.exports = merge(common, config);
