import errorTypes from './error-types'

export default class UnknownTemplateEngineError {
  constructor(templateEngine) {
    this.type = errorTypes.unknownTemplateEngine,
    this.message = 'Unknown template engine: ' + templateEngine
  }
}
