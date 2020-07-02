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
 * @returns {{ createdVals: Object[], updatedVals: Object[], deletedVals: Object[] }}
 */
function compareObjectVals (toCompareVals, key) {
  if (toCompareVals.length > 2) {
    throw new Error('Arguments are of the wrong length!');
  }
  var createdVals = [];
  var updatedVals = [];
  var deletedVals = [];
  var originalItemKeys = [];
  var activeItemKeys = [];
  var originalItem = toCompareVals[0];
  var activeItem = toCompareVals[1];

  if (!originalItem.length) {
    return {
      createdVals: activeItem,
      updatedVals: [],
      deletedVals: []
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
    createdVals: createdVals,
    updatedVals: updatedVals,
    deletedVals: deletedVals
  };
}

/**
 * Compare two arrays, to get the created & deleted values
 * @param {Object[]} toCompareVals The first array item must be the original array.
 * [originalArray, stateUpdatedArray]
 * @returns {{ createdVals[], deletedVals[] }}
 */
function compareArrayVals (toCompareVals) {
  if (toCompareVals.length > 2 || toCompareVals.length === 0) {
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
