const gcg = require('../gulp-configurer')
const createConfigurator = gcg.createConfigurator

createConfigurator({
  pathSource: 'in',
  pathOut: 'out',
  templateEngine: gcg.templateEngines.pug,
  cssPreprocessor: gcg.cssPreprocessors.less,
  indexPageTemplateEngine: gcg.templateEngines.pug,
  // bundler: gcg.bundlers.webpack,
  // webpackConfig: require('./webpack.config.js'),
  useBrowserSync: true,
  verbose: true,
  gulp: require('gulp')
})()
