'use strict';

const gulp = require('gulp');
const webpack = require('webpack');
const vinylNamed = require('vinyl-named');
const webpackStream = require('webpack-stream');
const { paths } = require('../config/config');
const { isProduction } = require('../config/env');
const webpackDevConfig = require('../config/webpack.dev.js');
const webpackProdConfig = require('../config/webpack.prod.js');

function scripts() {
  let config = webpackDevConfig;
  let destPath = `${paths.src}js/`;
  if (isProduction) {
    config = webpackProdConfig;
    destPath = `${paths.dist}js/`;
  }
  return gulp.src(`${paths.src}js/app.js`)
    .pipe(vinylNamed())
    .pipe(webpackStream(config, webpack))
    .pipe(gulp.dest(destPath));
}
exports.scripts = scripts;
