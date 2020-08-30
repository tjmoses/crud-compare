/**
 * @module crud-compare
 */

/**
 * Check if two objects are equal
 * @param {Object} a
 * @param {Object} b
 */
function isEqualObject (a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) return false;

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
}

/**
 * Compare two arrays of objects, to get the created, updated, and deleted values
 * @param {Object[]} toCompareVals The first array item must be the original array of objects.
 * [originalArray, stateUpdatedArray]
 * @param {String!} key The related key between the objects
 */
function compareObjectVals (toCompareVals: [Object[], Object[]], key: string) : 
  { createdVals: Object[] | null, updatedVals: Object[] | null, deletedVals: Object[] | null } {
  
  handleInputValidation(toCompareVals, key);

  var createdVals: any[] | null = [];
  var updatedVals: any[] | null = [];
  var deletedVals: any[] | null = [];
  var originalItemKeys: any[] = [];
  var activeItemKeys: any[] = [];
  var originalItem = toCompareVals[0];
  var activeItem = toCompareVals[1];

  if (!originalItem.length) {
    return {
      createdVals: activeItem,
      updatedVals: null,
      deletedVals: null
    };
  }

  for (var i = 0; i < originalItem.length; i++) {
    var outerKeyVal = originalItem[i][key];
    originalItemKeys.push(outerKeyVal);

    for (var j = 0; j < activeItem.length; j++) {
      if (i === 0) {
        activeItemKeys.push(activeItem[j][key]);
      }

      if (i === originalItem.length - 1 && originalItemKeys.indexOf(activeItem[j][key]) === -1) {
        createdVals.push(activeItem[j]);
      } else if (originalItem[i][key] === activeItem[j][key] && !isEqualObject(originalItem[i], activeItem[j])) {
        updatedVals.push(activeItem[j]);
      }
    }

    if (activeItemKeys.indexOf(outerKeyVal) === -1) {
      deletedVals.push(originalItem[i]);
    }
  }

  return {
    createdVals: createdVals.length ? createdVals : null,
    updatedVals: updatedVals.length ? updatedVals : null,
    deletedVals: deletedVals.length ? deletedVals : null
  };
}

function handleInputValidation(toCompareVals, key) {
  if (!Array.isArray(toCompareVals) || typeof key !== 'string') {
    throw new Error(`toCompareVals must be an array of the originalArray 
    and stateUpdatedArray you want to compare, and the key must be of type string!`)
  }
  if (toCompareVals.length !== 2) {
    throw new Error('Arguments are of the wrong length!');
  }
  if (!Array.isArray(toCompareVals[0]) || !Array.isArray(toCompareVals[1])) {
    throw new Error(`The originalArray and stateUpdatedArray must both be arrays!`);
  }
  const firstElementExists = toCompareVals[0] && toCompareVals[0][0];
  const secondElementExits = toCompareVals[1] && toCompareVals[1][0];
  const firstElementIsNotArrayOfObjects =
    (
      firstElementExists && toCompareVals[0][0] !== Object(toCompareVals[0][0]) || 
      firstElementExists && Array.isArray(toCompareVals[0][0])
    )
  const secondElementIsNotArrayOfObjects =
    (
      secondElementExits && toCompareVals[1][0] !== Object(toCompareVals[1][0]) || 
      secondElementExits && Array.isArray(toCompareVals[1][0])
    )
  if (firstElementIsNotArrayOfObjects) {
    throw new Error('The provided originalArray, is not an array of objects!');
  }
  if (secondElementIsNotArrayOfObjects) {
    throw new Error('The provided stateUpdatedArray, is not an array of objects!');
  }
}

/**
 * Compare two arrays, to get the created & deleted values
 * @param {Object[]} toCompareVals The first array item must be the original array.
 * [originalArray, stateUpdatedArray]
 */
function compareArrayVals (toCompareVals: [any[], any[]]) : { createdVals: any[], deletedVals: any[] } {
  if (toCompareVals.length !== 2) {
    throw new Error('Arguments are of the wrong length!');
  }
  var originalItem = toCompareVals[0];
  var activeItem = toCompareVals[1];

  if (!originalItem.length) {
    return {
      createdVals: activeItem,
      deletedVals: []
    };
  }
  var deletedVals = originalItem.filter(function (v) {
    return activeItem.indexOf(v) === -1;
  });
  var createdVals = activeItem.filter(function (v) {
    return originalItem.indexOf(v) === -1;
  });
  return {
    createdVals: createdVals,
    deletedVals: deletedVals
  };
}

exports.isEqualObject = isEqualObject;
exports.compareArrayVals = compareArrayVals;
exports.compareObjectVals = compareObjectVals;
