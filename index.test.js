const { compareObjectVals, compareArrayVals, isEqualObject } = require('./index.js');

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
    expect(updatedVals).toStrictEqual([]);
    expect(deletedVals).toStrictEqual([]);
  })

  test('compareObjectVals input wrong length', () => {
    try {
      compareObjectVals([originalArrayOfObjects],'commonKey');
    } catch (e) {
      expect(e.message).toBe('Arguments are of the wrong length!')
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