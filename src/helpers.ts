
/**
 * Check if two objects are equal w/ deep comparison
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
function isEqualObject (a: Object, b: Object): Boolean {
  if (Array.isArray(a) && Array.isArray(b)) return isEqualArray(a, b)
  if (typeof a !== 'object' && typeof b !== 'object') return Object.is(a, b)
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) return false
  var i = 0
  while (i < aProps.length) {
    var propName = aProps[i]
    if (typeof a[propName] == 'object' && typeof b[propName] == 'object') {
      if (Array.isArray(a[propName]) && Array.isArray(b[propName])) {
        if (!isEqualArray(a[propName], b[propName])) return false
      } else if (!isEqualObject(a[propName], b[propName])) return false
    } else if (
      bProps.indexOf(propName) == -1 ||
      !Object.is(a[propName], b[propName])
    ) {
      return false
    }
    i++
  }
  return true
}

/**
 * Check if two arrays are equal w/ deep comparison
 * @param {Array.<*>} a
 * @param {Array.<*>} b
 * @returns {boolean}
 */
function isEqualArray (a: any[], b: any[]): Boolean {
  if (a.length !== b.length) {
    return false
  }
  var i = 0
  while (i < a.length) {
    if (typeof a[i] !== 'object' && b.indexOf(a[i]) === -1) return false
    else if (
      typeof a[i] === 'object' &&
      !Array.isArray(a[i]) &&
      !isEqualObject(a[i], b[i])
    )
      return false
    else if (
      Array.isArray(a[i]) &&
      Array.isArray(b[i]) &&
      !isEqualArray(a[i], b[i])
    )
      return false
    i++
  }
  return true
}

export { isEqualObject, isEqualArray }
