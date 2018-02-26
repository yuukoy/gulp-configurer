import less from 'gulp-less'

import TaskConfigurer from './task-configurer'

import {infectBrowserSyncTasks} from './utils'

export default class StyleTaskConfigurer extends TaskConfigurer {
  constructor(configuration) {
    super(configuration)
    
    this.configuration = configuration
    this.gulpWrapper = configuration.get('gulpWrapper')
    this.options = configuration.get('options')
    this.globs = configuration.get('globs')
    this.paths = configuration.get('paths')
    this.cssPreprocessor = this.options.get('cssPreprocessor')

    this.pipes = {
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
  }

  defineStyleCleanTask() {
    this.gulpWrapper.defineCleanTask('clean:style', this.globs.get('out_style'))
  }

  defineStyleBundleTask() {
    let pipes = this.pipes
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
    this.defineStyleCleanTask()
    this.defineStyleBundleTask()
    this.defineStyleTask()
  }
}
