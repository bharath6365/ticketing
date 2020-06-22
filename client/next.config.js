const withLess = require('@zeit/next-less');

module.exports = withLess({
  // Once every 300 ms detect if files have changed.
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  },
  lessLoaderOptions: {
    javascriptEnabled: true
  }
});