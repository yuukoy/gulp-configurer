const gulpConfigurer = require('../dist/gulp-configurer')

gulpConfigurer({
  gulp: require('gulp'),
  verbose: true,
  useBrowserSync: true
})()
