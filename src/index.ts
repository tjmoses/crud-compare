/**
 * @module crud-compare
 */

/**
 * Check if two objects are equal
 * @param {Object} a
 * @param {Object} b
 */
function isEqualObject (a: Object, b: Object) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) return false;

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    
    if (bProps.indexOf(propName) == -1 || a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
}

/**
 * function to determine if two objects match
 */
type MatcherFunction = (o1: any, o2: any) => boolean;

/**
 * Compare two arrays of objects, to get the created, updated, and deleted values
 * @param {[Object[], Object[]]} toCompareVals The first array item must be the original array of objects.
 * [originalArray, stateUpdatedArray]
 * @param {String! | MatcherFunction} keyOrMatcher The related key between the objects, or a custom matcher function receiving two objects and returning true if they match
 * @returns returns three objects with the corresponding created, updated, and deleted values
 * respectively. Returns null for one of the corresponding values if it doesn't exist.
 */
function compareObjectVals (toCompareVals: [Object[], Object[]], keyOrMatcher: string | MatcherFunction ) : 
  { createdVals: Object[] | null, updatedVals: Object[] | null, deletedVals: Object[] | null } {
  
  handleInputValidation(toCompareVals, keyOrMatcher);

  var createdVals: any[] | null = [];
  var updatedVals: any[] | null = [];
  var deletedVals: any[] | null = [];
  var originalItems = toCompareVals[0];
  var activeItems = toCompareVals[1];

  if (!originalItems.length) {
    return {
      createdVals: activeItems.length ? activeItems : null,
      updatedVals: null,
      deletedVals: null
    };
  }

  const matcher: MatcherFunction = typeof keyOrMatcher === 'string'
    ? (o1, o2) => o1[keyOrMatcher] === o2[keyOrMatcher]
    : keyOrMatcher;
  
  for (var i = 0; i < originalItems.length; i++) {
    const outerObj = originalItems[i];
    for (var j = 0; j < activeItems.length; j++) {
      const innerObj = activeItems[j];

      if (i === originalItems.length - 1 && originalItems.every(o1 => !matcher(o1, innerObj))) {
        createdVals.push(innerObj);
      } else if (matcher(outerObj, innerObj) && !isEqualObject(outerObj, innerObj)) {
        updatedVals.push(innerObj);
      }
    }

    if(activeItems.every(o2 => !matcher(outerObj, o2))) {
      deletedVals.push(outerObj);
    }
  }

  return {
    createdVals: createdVals.length ? createdVals : null,
    updatedVals: updatedVals.length ? updatedVals : null,
    deletedVals: deletedVals.length ? deletedVals : null
  };
}

function handleInputValidation(toCompareVals, keyOrMatcher) {
  if (!Array.isArray(toCompareVals) || !(typeof keyOrMatcher === 'string' || typeof keyOrMatcher === 'function')) {
    throw new TypeError(`toCompareVals must be an array of the originalArray 
    and stateUpdatedArray you want to compare, and the keyOrMatcher must be of type string or function!`)
  }
  if (toCompareVals.length !== 2) {
    throw new Error('Arguments are of the wrong length!');
  }
  if (!Array.isArray(toCompareVals[0]) || !Array.isArray(toCompareVals[1])) {
    throw new TypeError(`The originalArray and stateUpdatedArray must both be arrays!`);
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

export { isEqualObject, compareArrayVals, compareObjectVals };
