'use strict';

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'] });
const pngquant = require('imagemin-pngquant');

const { paths, config } = require('../config/config');
const { isProduction } = require('../config/env');

function images() {
  let destPath = `${paths.src}img/`;
  if (isProduction) {
    destPath = `${paths.dist}img/`;
  }
  return gulp.src(`${paths.src}**/*.+(jpg|jpeg|png|gif|svg)`, {
    base: `${paths.src}img/`,
    since: gulp.lastRun(images),
  })
    .pipe(gulpLoadPlugins.imagemin([
      pngquant(config.quality.png),
      gulpLoadPlugins.imagemin.jpegtran({
        quality: config.quality.jpg,
        progressive: true,
      }),
      gulpLoadPlugins.imagemin.svgo(),
      gulpLoadPlugins.imagemin.optipng(),
      gulpLoadPlugins.imagemin.gifsicle(),
    ]))
    .pipe(gulp.dest(destPath));
}
exports.images = images;
