const minimist = require('minimist');

const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' },
});
const isProduction = options.env === 'production';

module.exports = { isProduction };
