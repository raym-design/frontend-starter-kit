'use strict';

/* Create a new Fractal instance and export it for use elsewhere if required */
const fractal = module.exports = require('@frctl/fractal').create();

/* Set the title of the project */
fractal.set('StyleGuide', 'Component Library');

/* Tell Fractal where the components will live */
fractal.components.set('path', __dirname + '/../../src/docs/components');

/* Tell Fractal where the documentation pages will live */
fractal.docs.set('path', __dirname + '/../../src/docs');

/* Specify a directory of static assets */
fractal.web.set('static.path', __dirname + '/../../docs/public');

/* Set the static HTML build destination */
fractal.web.set('builder.dest', __dirname + '/../../docs/build');
