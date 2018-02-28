import path from 'path'

import PropertyHolder from './property-holder'

import {getInViewGlobPart,
        getInStyleGlobPart} from './utils'

export default class Globs extends PropertyHolder {
  constructor(options, paths) {
    super({})

    let templateEngine = options.get('templateEngine')
    let cssPreprocessor = options.get('cssPreprocessor')
    
    let inViewGlobPart = getInViewGlobPart(templateEngine)
    let inStyleGlobPart = getInStyleGlobPart(cssPreprocessor)

    let pathSignatures = 
        [['in_index',  paths.get('in_index')],
         ['in_view',    paths.get('in_view'),    '**', inViewGlobPart],
         ['in_style',   paths.get('in_style'),   '**', inStyleGlobPart],
         ['in_script',  paths.get('in_script'),  '**', '*.js'],

         ['out_index',  paths.get('out_index'),  'index.html'],
         ['out_view',   paths.get('out_view'),   '**', '*.html'],
         ['out_style',  paths.get('out_style'),  '**', '*.css'],
         ['out_script', paths.get('out_script'), '**', '*.js']]

    pathSignatures.forEach(([propertyName, ...globParts]) => {
      let glob = path.join.apply(null, globParts)

      super._store(propertyName, glob)
    })
  }
}
