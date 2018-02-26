import TaskConfigurer from './task-configurer'

export default class GeneralTaskConfigurer extends TaskConfigurer {
  constructor(configuration) {
    super(configuration)
    
    this.gulpWrapper = configuration.get('gulpWrapper')
  }

  configure() {
    let tasks = ['view', 'index', 'style', 'script']

    this.gulpWrapper.defineParallelTask('default', tasks)
  }
}
