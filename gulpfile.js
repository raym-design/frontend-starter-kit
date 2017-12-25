'use strict';

// LIBRARIES
// - - - - - - - - - - - - - - -
// gulp
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*'] });
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync').create();
const connectSSI = require('connect-ssi');
const bulkSass = require('gulp-sass-bulk-import');
const packageImporter = require('node-sass-package-importer');
const autoprefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');
const named = require('vinyl-named');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackDevConfig = require('./webpack.dev.js');
const webpackProdConfig = require('./webpack.prod.js');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const merge = require('merge-stream');
const pugSetting = require('./src/pug/setting.json');
const fractal = require('./fractal.config.js');
const del = require('del');
const runSequence = require('run-sequence');

// VARIABLES
// - - - - - - - - - - - - - - -
const ROOT_PATH = './';
const SRC_PATH = './src/';
const DIST_PATH = './dist/';

// config
const config = {
  html: {
    files: [
      `${SRC_PATH}pug/**/!(_)*.pug`,
    ],
    watchFiles: [
      `${SRC_PATH}pug/*`,
      `${SRC_PATH}pug/**/*`,
    ],
    output: SRC_PATH,
  },
  sass: {
    files: [
      `${SRC_PATH}scss/**/*.scss`,
    ],
    watchFiles: [
      `${SRC_PATH}scss/*`,
      `${SRC_PATH}scss/**/*`,
    ],
    output: `${SRC_PATH}css/`,
  },
  js: {
    files: [
      `${SRC_PATH}js/app.js`,
    ],
    output: `${SRC_PATH}js/`,
  },
  image: {
    files: [
      `${SRC_PATH}**/*.+(jpg|jpeg|png|gif|svg)`,
    ],
    output: `${SRC_PATH}img/`,
  },
  sprite: {
    files: {
      png: [`${SRC_PATH}img/sprite/png/*.png`],
      svg: [`${SRC_PATH}img/sprite/svg/*.svg`],
    },
    output: {
      png: {
        imgPath: `${SRC_PATH}img/`,
        scssPath: `${SRC_PATH}scss/foundation/variables/`,
      },
      svg: {
        imgPath: `${SRC_PATH}img/`,
        scssPath: '../scss/foundation/variables/',
      },
    },
  },
  dist: {
    files: [
      `${SRC_PATH}*.html`,
      `${SRC_PATH}img/**`,
    ],
    output: {
      base: DIST_PATH,
      css: `${DIST_PATH}css/`,
      js: `${DIST_PATH}js/`,
    },
  },
};

// FUNCTIONS
// - - - - - - - - - - - - - - -
function handleErrors(...args) {
  gulpLoadPlugins.notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>',
  }).apply(this, args);
  this.emit('end');
}

// SERVER
// - - - - - - - - - - - - - - -
gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: ROOT_PATH,
      middleware: [
        connectSSI({
          baseDir: `${__dirname}/`,
          ext: '.html',
        }),
      ],
    },
    proxy: false,
    ghostMode: {
      location: true,
    },
  });
});

// PUG
// - - - - - - - - - - - - - - -
gulp.task('pug', () => {
  const builder = gulp.src(config.html.files)
    .pipe(gulpLoadPlugins.pugLinter())
    .pipe(gulpLoadPlugins.pugLinter.reporter())
    .pipe(gulpLoadPlugins.data(() => pugSetting))
    .pipe(gulpLoadPlugins.plumber({
      errorHandler: handleErrors,
    }))
    .pipe(gulpLoadPlugins.pug({ pretty: true }))
    .pipe(gulp.dest(config.html.output))
    .pipe(browserSync.reload({ stream: true }));
  return builder;
});

// SASS
// - - - - - - - - - - - - - - -
gulp.task('sass:dev', () => {
  const builder = gulp.src(config.sass.files)
    .pipe(gulpLoadPlugins.plumber({
      errorHandler: handleErrors,
    }))
    .pipe(gulpLoadPlugins.sourcemaps.init())
    .pipe(bulkSass())
    .pipe(gulpLoadPlugins.sass({
      importer: packageImporter({
        extensions: ['.scss', '.css', '.sass'],
      }),
    }))
    .pipe(gulpLoadPlugins.postcss([
      autoprefixer(),
      cssMqpacker(),
    ]))
    .pipe(gulpLoadPlugins.sourcemaps.write('./'))
    .pipe(gulp.dest(config.sass.output))
    .pipe(browserSync.reload({ stream: true }));
  return builder;
});

gulp.task('sass:prod', () => {
  const builder = gulp.src(config.sass.files)
    .pipe(gulpLoadPlugins.plumber({
      errorHandler: handleErrors,
    }))
    .pipe(bulkSass())
    .pipe(gulpLoadPlugins.sass({
      importer: packageImporter({
        extensions: ['.scss', '.css', '.sass'],
      }),
    }))
    .pipe(gulpLoadPlugins.postcss([
      autoprefixer(),
      cssMqpacker(),
    ]))
    .pipe(gulpLoadPlugins.csso())
    .pipe(gulp.dest(config.dist.output.css));
  return builder;
});

// JAVASCRIPT
// - - - - - - - - - - - - - - -
gulp.task('webpack:dev', () => {
  const builder = gulp.src(config.js.files)
    .pipe(named())
    .pipe(webpackStream(webpackDevConfig, webpack))
    .pipe(gulp.dest(config.js.output));
  return builder;
});

gulp.task('webpack:prod', () => {
  const builder = gulp.src(config.js.files)
    .pipe(named())
    .pipe(webpackStream(webpackProdConfig, webpack))
    .pipe(gulp.dest(config.dist.output.js));
  return builder;
});

// IMAGE
// - - - - - - - - - - - - - - -
gulp.task('imagemin', () => {
  const builder = gulp.src(config.image.files, { base: config.image.output })
    .pipe(gulpLoadPlugins.imagemin([
      pngquant({
        quality: '70-80',
        speed: 1,
        floyd: 0,
      }),
      mozjpeg({
        quality: 80,
        progressive: true,
      }),
      gulpLoadPlugins.imagemin.svgo(),
      gulpLoadPlugins.imagemin.optipng(),
      gulpLoadPlugins.imagemin.gifsicle(),
    ]))
    .pipe(gulp.dest(config.image.output));
  return builder;
});

// SPRITE
// - - - - - - - - - - - - - - -
gulp.task('sprite:png', () => {
  const spriteData = gulp.src(config.sprite.files.png)
    .pipe(gulpLoadPlugins.spritesmith({
      imgName: 'sprite.png',
      imgPath: '../img/sprite.png',
      cssName: '_sprite-png.scss',
      cssTemplate: '.sprite-png-template',
      algorithm: 'top-down',
      padding: 20,
      algorithmOpts: {
        sort: false,
      },
    }));
  const imgStream = spriteData.img
    .pipe(buffer())
    .pipe(gulp.dest(config.sprite.output.png.imgPath))
    .pipe(browserSync.reload({ stream: true }));
  const cssStream = spriteData.css
    .pipe(gulp.dest(config.sprite.output.png.scssPath))
    .pipe(browserSync.reload({ stream: true }));
  return merge(imgStream, cssStream);
});

gulp.task('sprite:svg', () => {
  const builder = gulp.src(config.sprite.files.svg)
    .pipe(gulpLoadPlugins.svgSprite({
      shape: {
        spacing: {
          padding: 20,
        },
      },
      mode: {
        css: {
          dest: './',
          layout: 'vertical',
          sprite: './sprite.svg',
          bust: false,
          render: {
            scss: {
              dest: `${config.sprite.output.svg.scssPath}_sprite-svg.scss`,
              template: '.sprite-svg-template',
            },
          },
        },
      },
      variables: {
        mapname: 'icons',
      },
    }))
    .pipe(gulp.dest(config.sprite.output.svg.imgPath));
  return builder;
});


// STYLE GUIDE
// - - - - - - - - - - - - - - -
gulp.task('fractal:start', () => {
  const server = fractal.web.server({
    server: {
      sync: true,
      port: 4000,
    },
  });
  server.on('error', err => fractal.cli.console.error(err.message));
  return server.start().then(() => {
    fractal.cli.console.success(`Fractal server is now running at ${server.url}`);
  });
});

gulp.task('fractal:build', () => {
  const builder = fractal.web.builder();
  builder.on('progress', (completed, total) => fractal.cli.console.update(`Exported ${completed} of ${total} items`, 'info'));
  builder.on('error', err => fractal.cli.console.error(err.message));
  return builder.build().then(() => {
    fractal.cli.console.success('Fractal build completed!');
  });
});

// WATCH
// - - - - - - - - - - - - - - -
gulp.task('watch', () => {
  gulpLoadPlugins.watch(config.html.watchFiles, () => {
    gulp.start('pug');
  });

  gulpLoadPlugins.watch(config.sprite.files.png, () => {
    gulp.start('sprite:png');
  });

  gulpLoadPlugins.watch(config.sprite.files.svg, () => {
    gulp.start('sprite:svg');
  });

  gulpLoadPlugins.watch(config.sass.watchFiles, () => {
    gulp.start('sass:dev');
  });
});

// CLEAN
// - - - - - - - - - - - - - - -
gulp.task('clean', del.bind(null, ['dist']));


// COPY
// - - - - - - - - - - - - - - -
gulp.task('copy', () => {
  const builder = gulp.src(config.dist.files, { base: SRC_PATH })
    .pipe(gulp.dest(config.dist.output.base));
  return builder;
});

// TASKS
// - - - - - - - - - - - - - - -
gulp.task('default', ['browser-sync', 'watch', 'webpack:dev']);

gulp.task('dist', (callback) => {
  const sequence = runSequence('clean', 'imagemin', 'webpack:prod', 'sass:prod', 'copy', callback);
  return sequence;
});
