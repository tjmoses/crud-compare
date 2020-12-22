/**
 * @module crud-compare
 */

/**
 * Check if two objects are equal w/ deep comparison
 * @param {Object} a
 * @param {Object} b
 */
function isEqualObject (a: Object, b: Object): Boolean {
  if (Array.isArray(a) && Array.isArray(b)) return isEqualArray(a, b);
  if (typeof a !== 'object' && typeof b !== 'object') return Object.is(a, b);
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) return false;
  var i = 0;
  while (i < aProps.length) {
    var propName = aProps[i];
    if (typeof a[propName] == 'object' && typeof b[propName] == 'object') {
      if (
        Array.isArray(a[propName]) && 
        Array.isArray(b[propName])) {
        if (!isEqualArray(a[propName], b[propName])) return false;
      }
      else if (!isEqualObject(a[propName], b[propName])) return false;
    }
    else if (
      bProps.indexOf(propName) == -1 || 
      !Object.is(a[propName], b[propName])) {
      return false;
    }
    i++;
  }
  return true;
}

/**
 * Check if two arrays are equal w/ deep comparison
 * @param {Object} a
 * @param {Object} b
 */
function isEqualArray (a: any[], b: any[]): Boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i++) {
    if (
      typeof a[i] !== 'object' && 
      b.indexOf(a[i]) === -1) return false;
    else if (
      typeof a[i] === 'object' && 
      !Array.isArray(a[i]) &&
      !isEqualObject(a[i], b[i])
    ) return false;
    else if (
      Array.isArray(a[i]) &&
      Array.isArray(b[i]) &&
      !isEqualArray(a[i], b[i])
    ) return false;
  }
  return true;
}

/**
 * Compare two arrays of objects, to get the created, updated, and deleted values
 * @param {Object[]} toCompareVals The first array item must be the original array of objects.
 * [originalArray, stateUpdatedArray]
 * @param {String!} key The related key between the objects
 * @returns returns three objects with the corresponding created, updated, and deleted values
 * respectively. Returns null for one of the corresponding values if it doesn't exist.
 */
function compareObjectVals (toCompareVals: [Object[], Object[]], key: string) : 
  { createdVals: Object[] | null, updatedVals: Object[] | null, deletedVals: Object[] | null } {
  
  handleInputValidation(toCompareVals, key);

  var createdVals: any[] | null = [];
  var updatedVals: any[] | null = [];
  var deletedVals: any[] | null = [];
  var originalItem: Object[] = toCompareVals[0];
  var activeItem: Object[] = toCompareVals[1];
  var i: number = 0, j: number = 0, 
      originalSameKeyValue: Boolean = false, activeSameKeyValue: Boolean[] = [];

  if (!originalItem.length) {
    return {
      createdVals: activeItem.length ? activeItem : null,
      updatedVals: null,
      deletedVals: null
    };
  }

  while (i < originalItem.length) {
    j = 0;
  
    while (j < activeItem.length) {
      var sameKeyVal = isEqualObject(originalItem[i][key], activeItem[j][key]);
      originalSameKeyValue = sameKeyVal || originalSameKeyValue;
      activeSameKeyValue[j] = sameKeyVal || activeSameKeyValue[j] || false;
      var isLastOriginalItemRun = i === originalItem.length - 1;

      if (isLastOriginalItemRun && !activeSameKeyValue[j]) {
         createdVals.push(activeItem[j]);
      }
      else if (
        isLastOriginalItemRun &&
        activeSameKeyValue[j] &&
        !isEqualObject(originalItem[i], activeItem[j])) {
        updatedVals.push(activeItem[j]);
      }
      j++;
    }

    if (!originalSameKeyValue) {
      deletedVals.push(originalItem[i]);
    }
    originalSameKeyValue = false;
    i++;
  }

  return {
    createdVals: createdVals.length ? createdVals : null,
    updatedVals: updatedVals.length ? updatedVals : null,
    deletedVals: deletedVals.length ? deletedVals : null
  };
}

function handleInputValidation(toCompareVals: [Object[], Object[]], key: string) {
  if (!Array.isArray(toCompareVals) || typeof key !== 'string') {
    throw new TypeError(`toCompareVals must be an array of the originalArray 
    and stateUpdatedArray you want to compare, and the key must be of type string!`)
  }
  if (toCompareVals.length !== 2) {
    throw new Error('Arguments are of the wrong length!');
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

/**
 * Compare two arrays, to get the created & deleted values
 * @param {Object[]} toCompareVals The first array item must be the original array.
 * [originalArray, stateUpdatedArray]
 * @returns Returns two arrays corresponding to the created, and deleted values
 * respectively. Returns null for one of the corresponding values if it doesn't exist.
 */
function compareArrayVals (toCompareVals: [any[], any[]]) : { createdVals: any[] | null, deletedVals: any[] | null } {
  if (toCompareVals.length !== 2) {
    throw new Error('Arguments are of the wrong length!');
  }
  var originalItem = toCompareVals[0];
  var activeItem = toCompareVals[1];

  if (!originalItem.length) {
    return {
      createdVals: activeItem.length ? activeItem : null,
      deletedVals: null
    };
  }
  var deletedVals = originalItem.filter(function (v) {
    return activeItem.indexOf(v) === -1;
  });
  var createdVals = activeItem.filter(function (v) {
    return originalItem.indexOf(v) === -1;
  });
  return {
    createdVals: createdVals.length ? createdVals : null,
    deletedVals: deletedVals.length ? deletedVals : null
  };
}

export { isEqualObject, isEqualArray, compareArrayVals, compareObjectVals };
