import errorTypes from './error-types'

export default class GenericError {
  constructor(message) {
    this.type = errorTypes.generalError
    this.message = message
  }
}
