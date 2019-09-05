'use strict';

const fs = require('fs');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'] });
const browserSync = require('browser-sync').create();

const pugSetting = JSON.parse(fs.readFileSync('./src/pug/setting.json', 'utf8'));
const { paths } = require('../config/config');
const { isProduction } = require('../config/env');

function html() {
  let destPath = paths.src;
  if (isProduction) {
    destPath = paths.dist;
  }
  return gulp.src(`${paths.src}pug/**/!(_)*.pug`)
    .pipe(gulpLoadPlugins.pugLinter({ reporter: 'default' }))
    .pipe(gulpLoadPlugins.data(() => pugSetting))
    .pipe(gulpLoadPlugins.plumber({
      errorHandler: gulpLoadPlugins.notify.onError('<%= error.message %>'),
    }))
    .pipe(gulpLoadPlugins.pug({ pretty: true }))
    .pipe(gulp.dest(destPath))
    .pipe(gulpLoadPlugins.if(isProduction, browserSync.reload({ stream: true })));
}

exports.html = html;
