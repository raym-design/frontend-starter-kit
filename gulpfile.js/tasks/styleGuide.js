'use strict';

const fractal = require('../config/fractal.config.js');

function styleGuideWatch() {
  const server = fractal.web.server({
    server: {
      sync: true,
      port: 4000,
    },
  });
  server.on('error', (err) => fractal.cli.console.error(err.message));
  return server.start().then(() => {
    fractal.cli.console.success(`Fractal server is now running at ${server.url}`);
  });
}
exports.styleGuideWatch = styleGuideWatch;

function styleGuideBuild() {
  const builder = fractal.web.builder();
  builder.on('progress', (completed, total) => fractal.cli.console.update(`Exported ${completed} of ${total} items`, 'info'));
  builder.on('error', (err) => fractal.cli.console.error(err.message));
  return builder.build().then(() => {
    fractal.cli.console.success('Fractal build completed!');
  });
}
exports.styleGuideBuild = styleGuideBuild;
