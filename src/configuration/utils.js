import GenericError from '../error/generic'
import UnknownTemplateEngineError from '../error/unknown-template-engine'
import UnknownCssPreprocessorError from '../error/unknown-css-preprocessor'

import {indexPageFilenames,
        templateEngines} from './constants'

export function fail(message) {
  throw new GenericError(message)
}

export function isUndefined(value) {
  return value === undefined
}

export const getIndexPageFilename = (function() {
  let filenames = {
    'pug': function () {
      return 'index.pug'
    },
    'plain': function () {
      return 'index.html'
    },
    'default': function (indexPageTemplateEngine) {
      throw new UnknownTemplateEngineError(indexPageTemplateEngine)
    }
  }

  return function(indexPageTemplateEngine) {
    let getter = (filenames[indexPageTemplateEngine] || filenames['default'])

    return getter(indexPageTemplateEngine)
  }
})()

export const getInViewGlobPart = (function() {
  let viewGlobs = {
    'pug': function (_) {
      return '*.pug'
    },
    'plain': function (_) {
      return '*.html'
    },
    'default': function (templateEngine) {
      throw new UnknownTemplateEngineError(templateEngine)
    }
  }

  return function(templateEngine) {
    let getter = (viewGlobs[templateEngine] || viewGlobs['default'])

    return getter(templateEngine)
  }
})()

export const getInStyleGlobPart = (function() {
  let styleGlobs = {
    'less': function (_) {
      return '*.less'
    },
    'plain': function (_) {
      return '*.css'
    },
    'default': function (cssPreprocessor) {
      throw new UnknownCssPreprocessorError(cssPreprocessor)
    }
  }

  return function (cssPreprocessor) {
    let getter = (styleGlobs[cssPreprocessor] || styleGlobs['default'])

    return getter(cssPreprocessor)
  }
})()
