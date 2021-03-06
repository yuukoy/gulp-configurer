import pug from 'gulp-pug'
import markdown from 'gulp-markdown'

import TaskConfigurer from './task-configurer'

import {infectBrowserSyncTasks} from './utils'

export default class IndexTaskConfigurer extends TaskConfigurer {
  constructor(configuration) {
    super(configuration)

    this.gulpWrapper = configuration.get('gulpWrapper')
    this.options = configuration.get('options')
    this.globs = configuration.get('globs')
    this.paths = configuration.get('paths')
    this.indexPageTemplateEngine = this.options.get('indexPageTemplateEngine')
  }

  defineIndexCleanTask() {
    this.gulpWrapper.defineCleanTask('clean:index', this.globs.get('out_index'))
  }

  defineIndexBundleTask() {
    let paths = this.paths

    let pipes = {
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
        // throw new UnknownTemplateEngineError(indexPageTemplateEngine)
        throw new Error('')
      }
    }

    let selectedPipes = (pipes[this.indexPageTemplateEngine] || pipes['default'])()

    this.gulpWrapper.defineDestinationTask('bundle:index',
                                           {globIn: paths.get('in_index'),
                                            pipes: selectedPipes,
                                            outDir: paths.get('out_index')})
  }

  defineIndexTask() {
    let subtasks = ['clean:index',
                    'bundle:index']

    subtasks = infectBrowserSyncTasks(this.configuration, subtasks)

    this.gulpWrapper.defineSerialTask('index', subtasks)
  }

  configure() {
    this.defineIndexCleanTask()
    this.defineIndexBundleTask()
    this.defineIndexTask()
  }
}

