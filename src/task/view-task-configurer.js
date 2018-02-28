import pug from 'gulp-pug'
import markdown from 'gulp-markdown'

import TaskConfigurer from './task-configurer'

import {infectBrowserSyncTasks} from './utils'

export default class ViewTaskConfigurer extends TaskConfigurer {
  constructor(configuration) {
    super(configuration)
    
    this.gulpWrapper = configuration.get('gulpWrapper')

    this.options = configuration.get('options')
    this.paths = configuration.get('paths')
    this.globs = configuration.get('globs')

    this.templateEngine = this.options.get('templateEngine')

    this.pipes = {
      'pug': function () {
        return [pug]
      },
      'markdown': function () {
        return [markdown]
      },
      'plain': function () {
        return []
      },
      'default': function () {
        // throw new UnknownTemplateEngineError()
        throw new Error('')
      }
    }
  }

  defineViewCleanTask() {
    this.gulpWrapper.defineCleanTask('clean:view', this.globs.get('out_view'))
  }

  defineViewBundleTask() {
    let pipes = this.pipes
    let selectedPipes = (pipes[this.templateEngine] || pipes['default'])()

    this.gulpWrapper.defineDestinationTask('bundle:view',
                                           {globIn: this.globs.get('in_view'),
                                            pipes: selectedPipes,
                                            outDir: this.paths.get('out_view')})
  }

  defineViewTask() {
    let subtasks = ['clean:view',
                    'bundle:view']
    
    subtasks = infectBrowserSyncTasks(this.configuration, subtasks)

    this.gulpWrapper.defineSerialTask('view', subtasks)
  }

  configure() {
    this.defineViewCleanTask()
    this.defineViewBundleTask()
    this.defineViewTask()
  }
}
