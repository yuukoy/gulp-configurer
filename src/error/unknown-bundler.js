import errorTypes from './error-types'

export default class  {
  constructor(bundler) {
    this.type = errorTypes.unknownBundler,
    this.message = 'Unknown bundler: ' + bundler
  }
}
