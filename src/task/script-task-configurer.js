import webpack from 'webpack'
import PluginError from 'plugin-error'

import TaskConfigurer from './task-configurer'

import {infectBrowserSyncTasks} from './utils'

export default class ScriptTaskConfigurer extends TaskConfigurer {
  constructor(configuration) {
    super(configuration)

    this.gulpWrapper = configuration.get('gulpWrapper')

    this.globs = configuration.get('globs')
    this.paths = configuration.get('paths')

    let options = configuration.get('options')
    this.bundler = options.get('bundler')
    this.webpackConfig = options.get('webpackConfig')
    this.useScript = options.get('useScript')
  }

  defineScriptCleanTask() {
    this.gulpWrapper.defineCleanTask('clean:script', this.globs.get('out_script'))
  }

  defineScriptBundleTask() {
    let scriptTasks = {
      'webpack': () => {
        return (callback) => {
          webpack(this.webpackConfig, (err, stats) => {
            if (err) {
              throw new PluginError('webpack:build', err);
            }

            // log('[webpack:build]', 'Build');
            
            callback();
          });
        }
      },
      'plain': () => {
        return () => {
          return this.gulpWrapper.src(this.globs.get('in_script'))
            .pipe(this.gulpWrapper.dest(this.paths.get('out_script')))
        }
      },
      'default': function () {
        // throw new UnknownBundlerError(bundler)
        throw new Error('')
      }
    }

    let gulpCallback = (scriptTasks[this.bundler] || scriptTasks['default'])()

    this.gulpWrapper.defineTask('bundle:script', gulpCallback)
  }

  defineScriptTask() {
    let subtasks = ['clean:script',
                    'bundle:script']

    subtasks = infectBrowserSyncTasks(this.configuration, subtasks)

    this.gulpWrapper.defineSerialTask('script', subtasks)
  }

  configure() {
    if (this.useScript) {
      this.defineScriptCleanTask()
      this.defineScriptBundleTask()
      this.defineScriptTask()
    }
  }
}
