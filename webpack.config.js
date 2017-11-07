const webpack = require('webpack');
const path = require('path');
const PRODUCTION = process.env.NODE_ENV === 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.ProvidePlugin({
    $: 'jquery'
  })
];

if(PRODUCTION){
  plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}

const config = {
  watch: PRODUCTION ? false : true,
  entry: './src/js/app.js',
  output: {
    filename: 'build.js',
    path: path.join(__dirname, 'dist/js')
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
  },
  devtool: 'source-map',
  plugins: plugins
};

module.exports = config;