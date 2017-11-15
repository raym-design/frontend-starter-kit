'use strict';

// LIBRARIES
// - - - - - - - - - - - - - - -
const browserSync     = require('browser-sync');
const bulkSass        = require('gulp-sass-bulk-import');
const buffer          = require('vinyl-buffer');
const connectSSI      = require('connect-ssi');
const fractal         = require('./fractal.config.js')
const logger          = fractal.cli.console;
const gulp            = require('gulp');
const gulpif          = require('gulp-if');
const gulpLoadPlugins = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'] });
const named           = require('vinyl-named');
const pngquant        = require('imagemin-pngquant');
const pugLinter       = require('gulp-pug-linter');
const webpack         = require('webpack');
const webpackStream   = require('webpack-stream');
const webpackDevConfig  = require('./webpack.dev.js');
const webpackProdConfig = require('./webpack.prod.js');
const minimist        = require('minimist');

// VARIABLES
// - - - - - - - - - - - - - - -
const bsProxy         = false;
const rootPath        = './';
const srcPath         = './src/';
const distPath        = './dist/';
const nodePath        = './node_modules/';
const htmlPath        = distPath + '/';
const pugPath         = srcPath + '/pug/';
const cssPath         = distPath + '/css/';
const scssPath        = srcPath + '/scss/';
const imgPath         = srcPath + '/img/';
const imgDistPath     = distPath + '/img/';
const jsPath          = srcPath + '/js/';
const fontPath        = srcPath + '/fonts/';
const docsPath        = srcPath + '/docs/';
const docsDistPath    = distPath + '/docs/';

// env
const envOption = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
};
const processOptions  = minimist(process.argv.slice(2), envOption);
const isProduction = (processOptions.env === 'production') ? true : false;
console.log('[build env]', processOptions.env, '[is production]', isProduction);

// SERVER
// - - - - - - - - - - - - - - -
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: rootPath,
      middleware: [
        connectSSI({
          baseDir: __dirname + "/",
          ext: ".html"
        })
      ]
    },
    proxy: bsProxy,
    ghostMode: {
      location: true
    }
  });
});

// PUG
// - - - - - - - - - - - - - - -
gulp.task('pug', function() {
  return gulp.src([pugPath + '**/!(_)*.pug'])
    .pipe(gulpLoadPlugins.pugLinter())
    .pipe(gulpLoadPlugins.pugLinter.reporter())
    .pipe(gulpLoadPlugins.data(function() {
      return require(pugPath + 'setting.json')
    }))
    .pipe(gulpLoadPlugins.plumber({
      errorHandler: handleErrors
    }))
    .pipe(gulpLoadPlugins.changed(htmlPath, {
      extension: '.html',
      hashChanged: gulpLoadPlugins.changed.compareSha1Digest
    }))
    .pipe(gulpLoadPlugins.pug({ pretty: true }))
    .pipe(gulp.dest(htmlPath))
    .pipe(gulpif(!isProduction, browserSync.reload({stream:true})));
});

// STYLESHEET
// - - - - - - - - - - - - - - -
gulp.task('sass', function() {
  return gulp.src(scssPath + '**/*.scss')
    .pipe(gulpLoadPlugins.plumber({
      errorHandler: handleErrors
    }))
    .pipe(bulkSass())
    .pipe(gulpLoadPlugins.sass({
      includePaths: [
        nodePath + 'font-awesome/scss'
      ]
    }))
    .pipe(gulpLoadPlugins.pleeease({
      "autoprefixer": {"browsers": ["last 4 versions", "ie 10", "ie 9"]},
      "minifier": false
    }))
    .pipe(gulpLoadPlugins.csscomb())
    .pipe(gulpLoadPlugins.csslint())
    .pipe(gulpif(isProduction, gulpLoadPlugins.csso()))
    .pipe(gulp.dest(cssPath))
    .pipe(gulpif(!isProduction, browserSync.reload({stream:true})));
});

// JAVASCRIPT
// - - - - - - - - - - - - - - -
gulp.task('webpack:dev', function() {
  return gulp.src(jsPath + '/app.js')
    .pipe(named())
    .pipe(webpackStream(webpackDevConfig, webpack))
    .pipe(gulp.dest(distPath + '/js/'));
});

gulp.task('webpack:prod', function() {
  return gulp.src(jsPath + '/app.js')
    .pipe(named())
    .pipe(webpackStream(webpackProdConfig, webpack))
    .pipe(gulp.dest(distPath + '/js/'));
});

// SPRITE
// - - - - - - - - - - - - - - -
gulp.task('sprite', function() {
  let spriteData = gulp.src(imgPath + 'sprite/*.png')
    .pipe(gulpLoadPlugins.spritesmith({
      imgName: 'sprite.png',
      imgPath: imgPath + 'sprite.png',
      cssName: '_sprite.scss',
      cssTemplate: '.sprite-template',
      algorithm: 'top-down',
      padding: 20,
      algorithmOpts: {
        sort: false
      }
    }));

  // minify images
  spriteData.img
    .pipe(buffer())
    .pipe(gulp.dest(imgPath))
    .pipe(browserSync.reload({ stream:true }));

  // compile scss
  spriteData.css
    .pipe(gulp.dest(scssPath + 'foundation/mixins/'))
    .pipe(browserSync.reload({ stream:true }));
});

// STYLE GUIDE
// - - - - - - - - - - - - - - -
gulp.task('fractal:start', function(){
  const server = fractal.web.server({
    sync: true,
    port: 4000
  });
  server.on('error', err => logger.error(err.message));
  return server.start().then(() => {
    logger.success(`Fractal server is now running at ${server.url}`);
  });
});

gulp.task('fractal:build', function(){
  const builder = fractal.web.builder();
  builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
  builder.on('error', err => logger.error(err.message));
  return builder.build().then(() => {
    logger.success('Fractal build completed!');
  });
});

// IMAGE
// - - - - - - - - - - - - - - -
gulp.task('imagemin', function() {
  return gulp.src(imgPath + '**/*.+(jpg|jpeg|png|gif|svg)', {base:imgPath})
    .pipe(gulpLoadPlugins.imagemin({
      progressive: true,
      use: [pngquant({ quality: '70-80', speed: 1 })]
    }))
    .pipe(gulp.dest(imgDistPath))
});

// FONTS
// - - - - - - - - - - - - - - -
gulp.task('fontawesome:copy', function() {
  return gulp.src(nodePath + 'font-awesome/fonts/*')
    .pipe(gulp.dest(fontPath))
    .pipe(gulp.dest(distPath + 'fonts/'))
});

gulp.task('fontawesome:replace', function() {
  return gulp.src( scssPath + 'app.scss' )
    .pipe(gulpLoadPlugins.replace('// @import "font-awesome";', '@import "font-awesome";'))
    .pipe(gulp.dest(scssPath))
});

// TASKS
// - - - - - - - - - - - - - - -
// Watch tasks
gulp.task('watch', function() {
  // Watch Pug
  gulpLoadPlugins.watch([pugPath + '*', pugPath + '**/*'], function(){
    gulp.start('pug');
  });

  // Watch Sprite
  gulpLoadPlugins.watch([imgPath + 'sprite/*.png'], function(){
    gulp.start('sprite');
  });

  // Watch Sass
  gulpLoadPlugins.watch([scssPath + '*', scssPath + '**/*'], function(){
    gulp.start('sass');
  });
});

gulp.task('build', ['fontawesome:copy', 'fontawesome:replace']);

gulp.task('default', ['browser-sync', 'sprite', 'watch', 'webpack:dev']);

gulp.task('dist', ['pug', 'sass', 'webpack:prod', 'sprite', 'imagemin', 'fractal:build']);

// FUNCTIONS
// - - - - - - - - - - - - - - -
function handleErrors() {
  let args = Array.prototype.slice.call(arguments);
  gulpLoadPlugins.notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
}

