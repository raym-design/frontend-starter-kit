const common = require('./webpack.common.js');
const merge = require('webpack-merge');

const config = {
  mode: 'production',
  watch: false,
};

module.exports = merge(common, config);
