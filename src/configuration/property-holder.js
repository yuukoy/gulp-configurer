import {fail,
        isUndefined} from './utils'

export default class PropertyHolder {
  constructor(properties) {
    if (isUndefined(properties)) {
      this._properties = {}
    } else {
      this._properties = Object.create(properties)
    }
  }

  _store(propertyName, value) {
    this._properties[propertyName] = value
  }

  _storeOptional(propertyName, defaultValue) {
    let value = this.get(propertyName)

    if (isUndefined(value)) {
          this._store(propertyName, defaultValue)
        }
  }

  _storeRequired(propertyName) {
    let value = this.get(propertyName)

    if (isUndefined(value)) {
      fail('Property \'' + propertyName + '\' doesn\'t have an associated value')
    }
  }

  _storeGuarded(propertyName, guard) {
    if (guard()) {
      this._storeRequired(propertyName)
    }
  }

  get(propertyName) {
    return this._properties[propertyName]
  }
}
