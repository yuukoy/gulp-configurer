import path from 'path'

import PropertyHolder from './property-holder'

import {getIndexPageFilename} from './utils'

export default class Paths extends PropertyHolder {
  constructor(options) {
    super({})
    
    let pathSource = options.get('pathSource')
    let pathOut = options.get('pathOut')
    let indexPageTemplateEngine = options.get('indexPageTemplateEngine')
    let useStyle = options.get('useStyle')
    let useScript = options.get('useScript')

    let filenameIndexPage = getIndexPageFilename(indexPageTemplateEngine)
    let pathSignatures = [
      ['in_view', pathSource, 'view'],
      ['in_index', pathSource, filenameIndexPage],

      ['out_view', pathOut, 'view'],
      ['out_index', pathOut],
    ]

    if (useStyle) {
      pathSignatures = pathSignatures.concat([
        ['in_style', pathSource, 'style'],
        ['out_style', pathOut, 'static', 'style']])
    }

    if (useScript) {
      pathSignatures = pathSignatures.concat([
        ['in_script', pathSource, 'script'],
        ['out_script', pathOut, 'static', 'script']])
    }
    
    pathSignatures.forEach(([propertyName, ...pathParts]) => {
      let fullPath = path.join.apply(null, pathParts)

      super._store(propertyName, fullPath)
    })
  }
}
