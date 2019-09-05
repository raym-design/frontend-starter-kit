'use strict';

const gulp  = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'] });
const vinylBuffer = require('vinyl-buffer');
const mergeStream = require('merge-stream');
const browserSync = require('browser-sync').create();
const { paths } = require('../config/config');
const { isProduction } = require('../config/env');

const pngConfig = {
  imgName: 'sprite.png',
  imgPath: '../img/sprite.png',
  cssName: '_sprite-png.scss',
  cssTemplate: '.sprite-png-template',
  algorithm: 'top-down',
  padding: 20,
  algorithmOpts: {
    sort: false,
  },
};

const svgConfig = {
  mode: {
    css: {
      dest: './',
      layout: 'vertical',
      sprite: './sprite.svg',
      bust: false,
      render: {
        scss: {
          dest: '../scss/foundation/variables/_sprite-svg.scss',
          template: '.sprite-svg-template',
        },
      },
    },
  },
  variables: {
    mapname: 'icons',
  },
};

const svgSymbolConfig = {
  mode: {
    symbol: {
      sprite: '../sprite.symbol.svg',
    },
  },
  shape: {
    transform: [
      {
        svgo: {
          plugins: [
            { 'removeTitle': true },
            { 'removeXMLNS': true },
          ],
        },
      },
    ],
  },
  svg: {
    xmlDeclaration: false,
  },
};

let destPath = `${paths.src}img/`;
if (isProduction) {
  destPath = `${paths.dist}img/`;
}

function sprite() {
  const spriteData = gulp.src(`${paths.src}img/sprite/png/*.png`)
    .pipe(gulpLoadPlugins.spritesmith(pngConfig));
  const imgStream = spriteData.img
    .pipe(vinylBuffer())
    .pipe(gulp.dest(destPath))
    .pipe(gulpLoadPlugins.if(isProduction, browserSync.reload({ stream: true })));
  const cssStream = spriteData.css
    .pipe(gulp.dest(`${paths.src}scss/foundation/variables/`))
    .pipe(gulpLoadPlugins.if(isProduction, browserSync.reload({ stream: true })));
  return mergeStream(imgStream, cssStream);
}
exports.sprite = sprite;

function svgSprite() {
  return gulp.src(`${paths.src}img/sprite/svg/*.svg`)
    .pipe(gulpLoadPlugins.svgSprite(svgConfig))
    .pipe(gulp.dest(destPath))
    .pipe(gulpLoadPlugins.if(isProduction, browserSync.reload({ stream: true })));
}
exports.svgSprite = svgSprite;

function svgSymbolSprite() {
  return gulp.src(`${paths.src}img/sprite/svg/*.svg`)
    .pipe(gulpLoadPlugins.svgSprite(svgSymbolConfig))
    .pipe(gulp.dest(destPath))
    .pipe(gulpLoadPlugins.if(isProduction, browserSync.reload({ stream: true })));
}
exports.svgSymbolSprite = svgSymbolSprite;
