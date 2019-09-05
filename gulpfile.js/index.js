'use strict';

const gulp = require('gulp');
const { server } = require('./tasks/server');
const { html } = require('./tasks/html');
const { styles } = require('./tasks/styles');
const { scripts } = require('./tasks/scripts');
const { images } = require('./tasks/images');
const { sprite, svgSprite, svgSymbolSprite } = require('./tasks/sprites');
const { watch } = require('./tasks/watch');
const { styleGuideWatch, styleGuideBuild } = require('./tasks/styleGuide');

exports.server = server;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.sprite = sprite;
exports.svgSprite = svgSprite;
exports.svgSymbolSprite = svgSymbolSprite;
exports.styleGuideWatch = styleGuideWatch;
exports.styleGuideBuild = styleGuideBuild;


// TASKS
// - - - - - - - - - - - - - - -
gulp.task('default', gulp.parallel(server, watch, scripts));
gulp.task('dist', gulp.series(images, html, styles, scripts));
