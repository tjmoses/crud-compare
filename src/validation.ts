
/**
 * Runtime validation for the compareObjectVals function.
 */
function handleCompareObjectInputValidation(toCompareVals: [Object[], Object[]], key?: string|string[]|undefined) {
  if (!Array.isArray(toCompareVals)) {
    throw new TypeError(`toCompareVals must be an array of the originalArray and stateUpdatedArray you want to compare!`)
  }
  if ((typeof key !== 'string' && typeof key !== 'symbol') && typeof key !== 'undefined' && !Array.isArray(key)) {
    throw new TypeError(`The given compare key must be of type "string" or "symbol" if one is provided!`);
  }
  if (Array.isArray(key) && typeof key[0] == 'object') {
    throw new TypeError('The key values must be primatives!');
  }
  if (toCompareVals.length !== 2) {
    throw new Error('Compare arguments are of the wrong length!');
  }
  if (!Array.isArray(toCompareVals[0]) || !Array.isArray(toCompareVals[1])) {
    throw new TypeError(`The originalArray and stateUpdatedArray must both be arrays!`);
  }
  var firstElementExists = toCompareVals[0] && toCompareVals[0][0];
  var secondElementExits = toCompareVals[1] && toCompareVals[1][0];
  var firstElementIsNotArrayOfObjects =
    (
      firstElementExists && toCompareVals[0][0] !== Object(toCompareVals[0][0]) || 
      firstElementExists && Array.isArray(toCompareVals[0][0])
    )
  var secondElementIsNotArrayOfObjects =
    (
      secondElementExits && toCompareVals[1][0] !== Object(toCompareVals[1][0]) || 
      secondElementExits && Array.isArray(toCompareVals[1][0])
    )
  if (firstElementIsNotArrayOfObjects) {
    throw new TypeError('The provided originalArray, is not an array of objects!');
  }
  if (secondElementIsNotArrayOfObjects) {
    throw new TypeError('The provided stateUpdatedArray, is not an array of objects!');
  }
}

export { handleCompareObjectInputValidation };