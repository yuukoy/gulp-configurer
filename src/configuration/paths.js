import path from 'path'

import PropertyHolder from './property-holder'

import {getIndexPageFilename} from './utils'

export default class Paths extends PropertyHolder {
  constructor(options) {
    super({})
    
    let pathSource = options.get('pathSource')
    let pathOut = options.get('pathOut')
    let indexPageTemplateEngine = options.get('indexPageTemplateEngine')
    let filenameIndexPage = getIndexPageFilename(indexPageTemplateEngine)
    let pathSignatures = [
      ['in_view', pathSource, 'view'],
      ['in_index', pathSource, filenameIndexPage],
      ['in_style', pathSource, 'style'],
      ['in_script', pathSource, 'script'],

      ['out_view', pathOut, 'view'],
      ['out_index', pathOut],
      ['out_style', pathOut, 'static', 'style'],
      ['out_script', pathOut, 'static', 'script']]
    
    pathSignatures.forEach(([propertyName, ...pathParts]) => {
      let fullPath = path.join.apply(null, pathParts)

      super._store(propertyName, fullPath)
    })
  }
}
