;(function() {
  'use strict'
  
  const path = require('path')

  const clean = require('gulp-clean'),
        pug = require('gulp-pug'),
        less = require('gulp-less'),
        log = require('fancy-log'),
        PluginError = require('plugin-error');

  const webpack = require('webpack');

  const browserSync = require('browser-sync');

  const errorTypes = {
    unknownTemplateEngine: Symbol('Unknown template engine'),
    unknownCssPreprocessor: Symbol('Unknown css preprocessor'),
    unknownBundler: Symbol('Unknown bundler'),
    generalError: Symbol('General error')
  }

  const indexPageFilenames = {
    plain: 'index.html',
    pug: 'index.pug'
  }

  const templateEngines = {
    plain: 'plain',
    pug: 'pug'
  }

  const cssPreprocessors = {
    plain: 'plain',
    less: 'less'
  }

  const bundlers = {
    plain: 'plain',
    webpack: 'webpack'
  }

  function createObjectPathPropertySetter(object) {
    return function([propertyName, ...pathParts]) {
      object[propertyName] = path.join.apply(null, pathParts)
    }
  }

  function logFileChanged(event) {
    log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  }

  function GenericError(message) {
    console.log(message)
    this.type = errorTypes.generalError
    this.message = message
  }

  function UnknownCssPreprocessorError(cssPreprocessor) {
    this.type = errorTypes.unknownCssPreprocessor,
    this.message = 'Unknown css preprocessor: ' + cssPreprocessor
  }

  function UnknownBundlerError(bundler) {
    this.type = errorTypes.unknownBundler,
    this.message = 'Unknown bundler: ' + bundler
  }

  function UnknownTemplateEngineError(templateEngine) {
    this.type = errorTypes.unknownTemplateEngine,
    this.message = 'Unknown template engine: ' + templateEngine
  }

  function fail(message) {
    throw new GenericError(message)
  }

  function createConfigurator(userOptions) {
    const options = userOptions || {}
    const pathSource = options.pathSource || 'src'
    const pathOut = options.pathOut || 'out'
    const templateEngine = options.templateEngine || templateEngines.plain
    const indexPageTemplateEngine = options.indexPageTemplateEngine || templateEngine
    const cssPreprocessor = options.cssPreprocessor || cssPreprocessors.plain
    const verbose = options.verbose || false
    const useBrowserSync = options.useBrowserSync || false
    const gulp = options.gulp || fail('gulp is not provided')
    const bundler = options.bundler || bundlers.plain
    const webpackConfig = options.bundler === bundlers.webpack
          ? options.webpackConfig || fail('webpack configuration is not provided')
          : null

    const filenameIndexPage = (function() {
      let filenames = {
        'pug': function () {
          return indexPageFilenames.pug
        },
        'plain': function () {
          return indexPageFilenames.plain
        },
        'default': function () {
          throw new UnknownTemplateEngineError(indexPageTemplateEngine)
        }
      }

      return (filenames[templateEngine] || filenames['default'])()
    })()

    function gulpDefineCleanTask(taskName, glob) {
      gulp.task(taskName, () => {
        return gulp.src(glob, {read: false, allowEmpty: true})
          .pipe(clean());
      })
    }

    function gulpDefineDestinationTask(taskName, {globIn, pipes, outDir}) {
      gulp.task(taskName, () => {
        let stream = gulp.src(globIn)

        pipes.forEach(pipe => stream = stream.pipe(pipe()))

        return stream.pipe(gulp.dest(outDir))
      })
    }

    function gulpDefineTask(taskName, task) {
      gulp.task(taskName, task)
    }

    function gulpCreateWatcher(glob, taskToExecute) {
      let watcher = gulp.watch(glob, gulp.series(taskToExecute))
      watcher.on('change', logFileChanged)
    }

    function gulpDefineSubtask(taskName, parentTask, task) {
      gulp.task(taskName, parentTask, task)
    }

    let paths = {}
    let globs = {}

    let configurePaths = function () {
      [['in_view', pathSource, 'view'],
       ['in_index', pathSource, filenameIndexPage],
       ['in_style', pathSource, 'style'],
       ['in_script', pathSource, 'script'],

       ['out_view', pathOut, 'view'],
       ['out_index', pathOut],
       ['out_style', pathOut, 'static', 'style'],
       ['out_script', pathOut, 'static', 'script'],
      ].forEach(createObjectPathPropertySetter(paths))

      if (verbose) {
        console.log('paths')
        console.log(paths)
      }
    }

    let getInViewGlobPart = (function () {
      let globs = {
        'pug': function () {
          return '*.pug'
        },
        'plain': function () {
          return '*.html'
        },
        'default': function () {
          throw new UnknownTemplateEngineError(templateEngine)
        }
      }

      return function () {
        return (globs[templateEngine] || globs['default'])()
      }
    })()
    
    let getInStyleGlobPart = (function () {
      let globs = {
        'less': function () {
          return '*.less'
        },
        'plain': function () {
          return '*.css'
        },
        'default': function () {
          throw new UnknownCssPreprocessorError(cssPreprocessor)
        }
      }

      return function () {
        return (globs[cssPreprocessor] || globs['default'])()
      }
    })()

    let configureGlobs = function () {
      [['in_index', paths.in_index],
       ['in_view',  paths.in_view, '**', getInViewGlobPart()],
       ['in_style', paths.in_style, '**', getInStyleGlobPart()],
       ['in_script', paths.in_script, '**', '*.js'],

       ['out_index', paths.out_index, 'index.html'],
       ['out_view', paths.out_view, '**', '*.html'],
       ['out_style', paths.out_style, '**', '*.css'],
       ['out_script', paths.out_script, '**', '*.js']
      ].forEach(createObjectPathPropertySetter(globs))

      if (verbose) {
        console.log('globs:')
        console.log(globs)
      }
    }

    let defineBrowserSyncReloadTask = function() {
      gulpDefineTask('browser-sync:reload', (callback) => {
        browserSync.reload();
        callback();
      })
    }

    let configureBrowserSyncTasks = function() {
      if (useBrowserSync) {
        defineBrowserSyncReloadTask()
      }
    }

    let infectBrowserSyncTask = function(tasks) {
      let infectedTasks = tasks
      
      if (useBrowserSync) {
        infectedTasks = infectedTasks.concat('browser-sync:reload')
      }

      return infectedTasks
    }

    let defineIndexCleanTask = function() {
      gulpDefineCleanTask('clean:index', globs.out_index)
    }

    let defineIndexBundleTask = (function() {
      let pipes = {
        'pug': function () {
          return [pug]
        },
        'plain': function () {
          return []
        },
        'default': function () {
          throw new UnknownTemplateEngineError(indexPageTemplateEngine)
        }
      }
      
      let selectedPipes = (pipes[indexPageTemplateEngine] || pipes['default'])()

      return function() {
        gulpDefineDestinationTask('bundle:index',
                                  {globIn: paths.in_index,
                                   pipes: selectedPipes,
                                   outDir: paths.out_index})
      }
    })()

    let defineIndexTask = function() {
      let subtasks = ['clean:index',
                      'bundle:index']

      subtasks = infectBrowserSyncTask(subtasks)

      gulpDefineTask('index', gulp.series.apply(null, subtasks))
    }
    
    let configureIndexPageTasks = function() {
      defineIndexCleanTask()
      defineIndexBundleTask()
      defineIndexTask()
    }

    let defineViewCleanTask = function() {
      gulpDefineCleanTask('clean:view', globs.out_view)
    }

    let defineViewBundleTask = (function() {
      let pipes = {
        'pug': function () {
          return [pug]
        },
        'plain': function () {
          return []
        },
        'default': function () {
          throw new UnknownTemplateEngineError()
        }
      }

      let selectedPipes = (pipes[indexPageTemplateEngine] || pipes['default'])()

      return function() {
        gulpDefineDestinationTask('bundle:view',
                                  {globIn: globs.in_view,
                                   pipes: selectedPipes,
                                   outDir: paths.out_view})
      }
    })()

    let defineViewTask = function() {
      let subtasks = ['clean:view',
                      'bundle:view']

      subtasks = infectBrowserSyncTask(subtasks)

      gulpDefineTask('view', gulp.series.apply(null, subtasks))
    }
    
    let configureViewTasks = function () {
      defineViewCleanTask()
      defineViewBundleTask()
      defineViewTask()
    }

    let defineStyleCleanTask = function() {
      gulpDefineCleanTask('clean:style', globs.out_style)
    }

    let defineStyleBundleTask = (function() {
      let pipes = {
        'less': function () {
          return [less]
        },
        'plain': function () {
          return []
        },
        'default': function () {
          throw new UnknownCssPreprocessorError(cssPreprocessor)
        }
      }

      return function() {
        let selectedPipes = (pipes[cssPreprocessor] || pipes['default'])()

        gulpDefineDestinationTask('bundle:style',
                                  {globIn: globs.in_style,
                                   pipes: selectedPipes,
                                   outDir: paths.out_style})
      }
    })()

    let defineStyleTask = function() {
      let subtasks = ['clean:style',
                      'bundle:style']

      subtasks = infectBrowserSyncTask(subtasks)

      gulpDefineTask('style', gulp.series.apply(null, subtasks))
    }

    let configureStyleTasks = function() {
      defineStyleCleanTask()
      defineStyleBundleTask()
      defineStyleTask()
    }

    let defineScriptCleanTask = function() {
      gulpDefineCleanTask('clean:script', globs.out_script)
    }

    let defineScriptBundleTask = (function() {
      let gulpTasks = {
        'webpack': function() {
          return function(callback) {
            webpack(webpackConfig, (err, stats) => {
              if (err) {
                throw new PluginError('webpack:build', err);
              }

              log('[webpack:build]', 'Build');
              
              callback();
            });
          }
        },
        'plain': function () {
          return function () {
            return gulp.src(globs.in_script)
              .pipe(gulp.dest(paths.out_script))
          }
        },
        'default': function () {
          throw new UnknownBundlerError(bundler)
        }
      }

      let gulpCallback = (gulpTasks[bundler] || gulpTasks['default'])()

      return function() {
        gulpDefineTask('bundle:script', gulpCallback)
      }
    })()

    let defineScriptTask = function() {
      let subtasks = ['clean:script',
                      'bundle:script']

      subtasks = infectBrowserSyncTask(subtasks)

      gulpDefineTask('script', gulp.series.apply(null, subtasks))
    }

    let configureScriptTasks = function() {
      defineScriptCleanTask()
      defineScriptBundleTask()
      defineScriptTask()
    }

    let defineWatchTask = function() {
      gulpDefineTask('watch',() => {
        if (useBrowserSync) {
          browserSync.init({
            server: {
              baseDir: paths.out_index,
              index: 'index.html'
            }
          })
        }

        gulpCreateWatcher(globs.in_index, 'index')
        gulpCreateWatcher(globs.in_view, 'view')
        gulpCreateWatcher(globs.in_style, 'style')
        gulpCreateWatcher(globs.in_script, 'script')
      })
    }

    let configureWatchTask = function() {
      defineWatchTask()
    }

    let configureDefaultTask = function() {
      let subtasks = ['index', 'view', 'style', 'script']
      
      gulpDefineTask('default', gulp.parallel.apply(null, subtasks))
    }

    let configureTasks = function () {
      configureBrowserSyncTasks()

      configureIndexPageTasks()
      configureViewTasks()
      configureStyleTasks()
      configureScriptTasks()

      configureWatchTask()
      configureDefaultTask()
    }

    return function () {
      try {
        configurePaths()
        configureGlobs()
        configureTasks()
      }
      catch(e) {
        console.log(e)
      }
    }
  }

  module.exports = {
    templateEngines,
    cssPreprocessors,
    bundlers,
    createConfigurator 
  }
})()
