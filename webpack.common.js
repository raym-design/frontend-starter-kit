const path    = require('path');
const webpack = require('webpack');

const config = {
  entry: './src/js/app.js',
  output: {
    filename: 'build.js',
    path: path.join(__dirname, 'dist/js')
  },
  externals: {
    jquery: 'jQuery'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }]
    }, {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }]
  }
};

module.exports = config;
