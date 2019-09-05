'use strict';

const browserSync = require('browser-sync').create();
const connectSSI = require('connect-ssi');

const { paths } = require('../config/config');

function server(done) {
  browserSync.init({
    server: {
      baseDir: paths.src,
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
  done();
}

exports.server = server;
