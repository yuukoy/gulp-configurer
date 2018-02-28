import less from 'gulp-less'

import TaskConfigurer from './task-configurer'

import {infectBrowserSyncTasks} from './utils'

export default class StyleTaskConfigurer extends TaskConfigurer {
  constructor(configuration) {
    super(configuration)
    
    this.globs = configuration.get('globs')
    this.paths = configuration.get('paths')
    this.gulpWrapper = configuration.get('gulpWrapper')

    let options = configuration.get('options')
    this.useStyle = options.get('useStyle')
    this.cssPreprocessor = options.get('cssPreprocessor')
  }

  defineStyleCleanTask() {
    this.gulpWrapper.defineCleanTask('clean:style', this.globs.get('out_style'))
  }

  defineStyleBundleTask() {
    let pipes = {
      'less': function () {
        return [less]
      },
      'plain': function () {
        return []
      },
      'default': function () {
        // throw new UnknownCssPreprocessorError(cssPreprocessor)
        throw new Error('')
      }
    }

    let selectedPipes = (pipes[this.cssPreprocessor] || pipes['default'])()

    this.gulpWrapper.defineDestinationTask('bundle:style',
                                           {globIn: this.globs.get('in_style'),
                                            pipes: selectedPipes,
                                            outDir: this.paths.get('out_style')})
  }

  defineStyleTask() {
    let subtasks = ['clean:style',
                    'bundle:style']

    subtasks = infectBrowserSyncTasks(this.configuration, subtasks)

    this.gulpWrapper.defineSerialTask('style', subtasks)
  }

  configure() {
    if (this.useStyle) {
      this.defineStyleCleanTask()
      this.defineStyleBundleTask()
      this.defineStyleTask()
    }
  }
}
