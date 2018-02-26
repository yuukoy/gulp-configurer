import PropertyHolder from './property-holder'

import Options from './options'
import Paths from './paths'
import Globs from './globs'
import GulpWrapper from './gulp-wrapper'

export default class Configuraton extends PropertyHolder {
  constructor(userOptions) {
    super({})
    
    let options = new Options(userOptions)
    let gulp = options.get('gulp')

    let paths = new Paths(options)
    let globs = new Globs(options, paths)
    let gulpWrapper = new GulpWrapper(gulp)

    if (options.get('verbose')) {
      console.log(options)
      console.log(paths)
      console.log(globs)
      console.log(gulpWrapper)
    }

    super._store('options', options)
    super._store('paths', paths)
    super._store('globs', globs)
    super._store('gulpWrapper', gulpWrapper)
  }
}
