import TaskConfigurer from './task-configurer'

import BrowserSyncTaskConfigurer from './browser-sync-task-configurer'

import IndexTaskConfigurer from './index-task-configurer'
import ViewTaskConfigurer from './view-task-configurer'
import StyleTaskConfigurer from './style-task-configurer'
import ScriptTaskConfigurer from './script-task-configurer'

import GeneralTaskConfigurer from './general-task-configurer'

export default class GulpTaskConfigurer extends TaskConfigurer {
  constructor(configuration) {
    super(configuration)
    
    this.configurers = [
      new BrowserSyncTaskConfigurer(configuration),

      new ViewTaskConfigurer(configuration),
      new IndexTaskConfigurer(configuration),
      new StyleTaskConfigurer(configuration),
      new ScriptTaskConfigurer(configuration),

      new GeneralTaskConfigurer(configuration)
    ]
  }

  configure() {
    this.configurers.forEach((configurer) => {
      configurer.configure()
    })
  }
}
