const errorTypes = {
  unknownTemplateEngine: Symbol('Unknown template engine'),
  unknownCssPreprocessor: Symbol('Unknown css preprocessor'),
  unknownBundler: Symbol('Unknown bundler'),
  generalError: Symbol('General error')
}

export function GenericError(message) {
  console.log(message)
  this.type = errorTypes.generalError
  this.message = message
}

export function UnknownCssPreprocessorError(cssPreprocessor) {
  this.type = errorTypes.unknownCssPreprocessor,
  this.message = 'Unknown css preprocessor: ' + cssPreprocessor
}

export function UnknownBundlerError(bundler) {
  this.type = errorTypes.unknownBundler,
  this.message = 'Unknown bundler: ' + bundler
}

export function UnknownTemplateEngineError(templateEngine) {
  this.type = errorTypes.unknownTemplateEngine,
  this.message = 'Unknown template engine: ' + templateEngine
}

export {errorTypes}
