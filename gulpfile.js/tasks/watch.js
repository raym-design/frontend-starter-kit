'use strict';

const gulp = require('gulp');
const { paths } = require('../config/config');

function watch(done) {
  gulp.watch([`${paths.src}pug/*`, `${paths.src}pug/**/*`], gulp.task('html'));
  gulp.watch([`${paths.src}scss/*`, `${paths.src}scss/**/*`], gulp.task('styles'));
  gulp.watch([`${paths.src}img/sprite/png/*.png`], gulp.task('sprite'));
  gulp.watch([`${paths.src}img/sprite/svg/*.svg`], gulp.task(['svgSprite', 'svgSymbolSprite']));
  done();
}

exports.watch = watch;
