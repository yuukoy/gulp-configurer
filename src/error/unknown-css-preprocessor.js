import errorTypes from './error-types'

export default class UnknownCssPreprocessorError {
  constructor(cssPreprocessor) {
    this.type = errorTypes.unknownCssPreprocessor,
    this.message = 'Unknown css preprocessor: ' + cssPreprocessor
  }
}
