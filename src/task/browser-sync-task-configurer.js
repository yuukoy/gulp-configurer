import TaskConfigurer from './task-configurer'

import browserSync from 'browser-sync'

export default class BrowserSyncTaskConfigurer extends TaskConfigurer {
  constructor(configuration) {
    super(configuration)
    
    this.gulpWrapper = configuration.get('gulpWrapper')
    this.options = configuration.get('options')
    
    this.useBrowserSync = this.options.get('useBrowserSync')
  }

  createBrowserSyncReloadTask() {
    this.gulpWrapper.defineTask('browser-sync:reload', (callback) => {
      browserSync.reload();
      callback()
    })
  }

  configure() {
    this.createBrowserSyncReloadTask()
  }
  
}
