const { compareObjectVals, compareArrayVals, isEqualObject } = require('./dist/index.js');

const originalArrayOfObjects = [
  {'commonKey': 1, 'anotherkey': 'test'},
  {'commonKey': 2}
];
const newArrayOfObjects = [
  {'commonKey': 2, 'newkey': 'test'},
  {'commonKey': 7}
];

describe('compareObjectVals Tests', () => {
  test('compareObjectVals functionality', () => {
    const { createdVals, updatedVals, deletedVals } = compareObjectVals(
    [
      originalArrayOfObjects,
      newArrayOfObjects
    ],
    'commonKey'
    );

    expect(createdVals).toStrictEqual([{'commonKey': 7}]);
    expect(updatedVals).toStrictEqual([{'commonKey': 2, 'newkey': 'test'}]);
    expect(deletedVals).toStrictEqual([{'commonKey': 1, 'anotherkey': 'test'}]);
  });

  test('empty original array of objects', () => {
    const { createdVals, updatedVals, deletedVals } = compareObjectVals([[], newArrayOfObjects], 'commonKey');
    expect(createdVals).toStrictEqual([{'commonKey': 2, 'newkey': 'test'},{'commonKey': 7}]);
    expect(updatedVals).toStrictEqual(null);
    expect(deletedVals).toStrictEqual(null);
  })

  test('compareObjectVals input wrong length', () => {
    try {
      compareObjectVals([originalArrayOfObjects],'commonKey');
    } catch (e) {
      expect(e.message).toBe('Arguments are of the wrong length!')
    }
  })

  test('compareObjectVals input validation', () => {
    const origArray = [
      [{'commonKey': 1, 'anotherkey': 'test'}],
      [{'commonKey': 2}]
    ]
    const newArray = [
      [{'commonKey': 2, 'anotherkey': 'test'}],
      [{'commonKey': 5}]
    ]
    const newFakeArray2 = {
      'commonKey': 2, 'anotherkey': 'test'
    }

    try {
      const compareVals = compareObjectVals([origArray, newArray],'commonKey');
      const { createdVals, updatedVals, deletedVals } = compareVals;
    } catch (e) {
      expect(e.message).toBe('The provided originalArray, is not an array of objects!')
    }
    try {
      const compareVals = compareObjectVals([originalArrayOfObjects, newArray],'commonKey');
      const { createdVals, updatedVals, deletedVals } = compareVals;
    } catch (e) {
      expect(e.message).toBe('The provided stateUpdatedArray, is not an array of objects!')
    }
    try {
      const compareVals = compareObjectVals([originalArrayOfObjects, newFakeArray2],'commonKey');
      const { createdVals, updatedVals, deletedVals } = compareVals;
    } catch (e) {
      expect(e.message).toBe('The originalArray and stateUpdatedArray must both be arrays!')
    }
    try {
      const compareVals = compareObjectVals({originalArrayOfObjects, newFakeArray2},'commonKey');
      const { createdVals, updatedVals, deletedVals } = compareVals;
    } catch (e) {
      expect(e.message).toBe(`toCompareVals must be an array of the originalArray 
    and stateUpdatedArray you want to compare, and the key must be of type string!`);
    }
  })
});

const originalArrayItem = [1, 2, 'five', true, 33];
const updatedArrayItem = [1, 'seven', true, 33];

describe('compareArrayVals Tests', () => {

  test('compareArrayVals functionality', () => {
    const { createdVals, deletedVals } = compareArrayVals(
    [
      originalArrayItem,
      updatedArrayItem
    ]
  );

    expect(createdVals).toStrictEqual(['seven']);
    expect(deletedVals).toStrictEqual([2, 'five']);
  });

  test('compareObjectVals input wrong length', () => {
    try {
      compareArrayVals([originalArrayItem]);
    } catch (e) {
      expect(e.message).toBe('Arguments are of the wrong length!')
    }
  })

  test('Empty original item', () => {
    const { createdVals, deletedVals } = compareArrayVals([[], updatedArrayItem]);
    expect
    expect(createdVals).toStrictEqual([1, 'seven', true, 33]);
    expect(deletedVals).toStrictEqual([]);
  });
});

const ob1 = { 'test': 1, 'test2': 2 };
const ob2 = { 'test': 1, 'test2': 2 };

test('isEqualObject truth tests', () => {
  expect(isEqualObject(ob1, ob2)).toBe(true);
  expect(isEqualObject(originalArrayOfObjects[0], newArrayOfObjects[0])).toBe(false);
})