import TaskConfigurer from './task-configurer'

export default class GeneralTaskConfigurer extends TaskConfigurer {
  constructor(configuration) {
    super(configuration)
    
    this.gulpWrapper = configuration.get('gulpWrapper')

    let options = configuration.get('options')
    this.useStyle = options.get('useStyle')
    this.useScript = options.get('useScript')
  }

  configure() {
    let tasks = ['view', 'index']

    if (this.useStyle) {
      tasks = tasks.concat('style')
    }

    if (this.useScript) {
      tasks = tasks.concat('script')
    }

    this.gulpWrapper.defineParallelTask('default', tasks)
  }
}
