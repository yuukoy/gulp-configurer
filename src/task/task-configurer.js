export default class TaskConfigurer {
  constructor(configuration) {
    this.configuration = configuration
  }

  configure() {
    throw new Error('Not implemented method: \'configure\'')
  }
}
