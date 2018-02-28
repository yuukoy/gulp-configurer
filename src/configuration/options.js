import {templateEngines,
        cssPreprocessors,
        bundlers} from './constants'

import PropertyHolder from './property-holder'

export default class Options extends PropertyHolder {
  constructor(options) {
    super(options)

    super._storeOptional('pathSource', 'src')
    super._storeOptional('pathOut', 'dist')
    super._storeOptional('templateEngine', templateEngines.plain)
    super._storeOptional('indexPageTemplateEngine', super.get('templateEngine'))
    super._storeOptional('cssPreprocessor', cssPreprocessors.plain)
    super._storeOptional('bundler', bundlers.plain)
    super._storeOptional('verbose', false)
    super._storeOptional('useBrowserSync', false)

    super._storeRequired('gulp')

    super._storeGuarded('webpackConfig',
                        () => super.get('bundler') === bundlers.webpack)
  }
}
