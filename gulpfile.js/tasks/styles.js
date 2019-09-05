"use strict";

const { src, dest } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'] });
const packageImporter = require('node-sass-package-importer');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sorting = require('postcss-sorting');
const browserSync = require('browser-sync').create();

const { paths } = require('../config/config');
const { isProduction } = require('../config/env');

const POST_OPTIONS = [
  autoprefixer({
    grid: true,
  }),
  cssnano({
    autoprefixer: false,
  }),
  sorting(),
];

const SASS_OPTIONS = {
  importer: packageImporter({
    extensions: ['.scss', '.css', '.sass'],
  }),
};

function styles() {
  let destPath = `${paths.src}css/`;
  let sourcemaps = true;
  let sourcemapsPath = './';
  if (isProduction) {
    destPath = `${paths.dist}css/`;
    sourcemaps = false;
    sourcemapsPath = false;
  }
  return src(`${paths.src}scss/**/*.scss`, { sourcemaps })
    .pipe(gulpLoadPlugins.plumber({
      errorHandler: gulpLoadPlugins.notify.onError('<%= error.message %>'),
    }))
    .pipe(gulpLoadPlugins.sassGlob())
    .pipe(gulpLoadPlugins.sass(SASS_OPTIONS))
    .pipe(gulpLoadPlugins.postcss(POST_OPTIONS))
    .pipe(dest(destPath, { sourcemaps: sourcemapsPath }))
    .pipe(gulpLoadPlugins.if(isProduction, browserSync.reload({ stream: true })));
}
exports.styles = styles;
