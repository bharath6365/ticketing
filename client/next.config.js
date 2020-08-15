const withLess = require('@zeit/next-less');
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');

module.exports = withCss(withSass(withLess({
  // Once every 300 ms detect if files have changed.
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  },
  lessLoaderOptions: {
    javascriptEnabled: true
  }
})));