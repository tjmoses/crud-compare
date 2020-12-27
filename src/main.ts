
import { isEqualObject } from './helpers';
import { handleCompareObjectInputValidation } from './validation';

/**
 * Compare two arrays of objects, to get the created, updated, and deleted values
 * @param {Array.<Object>} toCompareVals The first array item must be the original array of objects.
 * [originalArray, stateUpdatedArray]
 * @param {?string|Array.<string>} key The related key between the objects
 * @returns {{createdVals: ?Array.<Object>, updatedVals: ?Array.<Object>, deletedVals: ?Array.<Object>}} 
 * Three objects with the corresponding created, updated, and deleted values
 * respectively. Returns null for one of the corresponding values if it doesn't exist.
 */
function compareObjectVals (
  toCompareVals: [Object[], Object[]], key?: string|string[]) : 
  { createdVals: Object[]|null, updatedVals: Object[]|null, deletedVals: Object[]|null } {
  
  handleCompareObjectInputValidation(toCompareVals, key);

  var createdVals: any[] | null = [];
  var updatedVals: any[] | null = [];
  var deletedVals: any[] | null = [];
  var originalItem: Object[] = toCompareVals[0];
  var activeItem: Object[] = toCompareVals[1];
  var i: number = 0, j: number = 0;

  if (!originalItem.length) {
    return {
      createdVals: activeItem.length ? activeItem : null,
      updatedVals: null,
      deletedVals: null
    };
  }

  var originalSameKeyValue: Boolean = false, 
      activeSameKeyValue: Boolean[] = [];
  while (i < originalItem.length) {
    j = 0;
  
    while (j < activeItem.length) {
      var sameKeyVal: Boolean = false;
      if (!key) {
        if (
          typeof originalItem[i] == 'object' &&
          !Array.isArray(originalItem[i])
          ) {
          for (var prop in originalItem[i]) {
            if (activeItem[j].hasOwnProperty(prop)) {
              sameKeyVal = isEqualObject(originalItem[i][prop], activeItem[j][prop]);
              if (sameKeyVal) break;
            }
          }
        } else {
          throw new TypeError('Original item array must consist of only objects!');
        }
      }
      else if (Array.isArray(key)) {
        var z = 0, combinedKeyTruthyVal = true;
        while (z < key.length) {
          if (
            !originalItem[i].hasOwnProperty(key[z]) ||
            !activeItem[j].hasOwnProperty(key[z])) {
            combinedKeyTruthyVal = false;
          } else {
            combinedKeyTruthyVal = 
              isEqualObject(originalItem[i][key[z]], activeItem[j][key[z]]) && 
              combinedKeyTruthyVal;
          }
          z++;
        }
        sameKeyVal = combinedKeyTruthyVal;
      } 
      else {
        sameKeyVal = isEqualObject(originalItem[i][key], activeItem[j][key]);
      }

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

/**
 * Compare two arrays, to get the created & deleted values
 * @param {Array.<Array.<*>, Array.<*>>} toCompareVals The first array item must be the original array.
 * [originalArray, stateUpdatedArray]
 * @returns {{ createdVals: ?Array.<*>, deletedVals: ?Array.<*> }} 
 * Returns two arrays corresponding to the created and deleted values
 * respectively. Returns null for one of the corresponding values if it doesn't exist.
 */
function compareArrayVals (toCompareVals: [any[], any[]]) : { createdVals: any[] | null, deletedVals: any[] | null } {
  if (toCompareVals.length !== 2) {
    throw new Error('ToCompareVal arguments are of the wrong length!');
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

export { compareObjectVals, compareArrayVals };