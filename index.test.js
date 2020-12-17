const { compareObjectVals, compareArrayVals, isEqualObject } = require('./dist/index.js');

const originalArrayOfObjects = [
  {'commonKey': 1, 'anotherkey': 'test'},
  {'commonKey': 2}
];
const newArrayOfObjects = [
  {'commonKey': 2, 'newkey': 'test'},
  {'commonKey': 7}
];

const originalArrayOfComplexObjects = [
  {'key1': 1, 'key2': '1', 'otherProperty': 'stuff 1'},
  {'key1': 2, 'key2': '2', 'otherProperty': 'stuff 2'}
];

const newArrayOfComplexObjects = [
  {'key1': 2, 'key2': '2', 'otherProperty': 'new stuff'},
  {'key1': 7, 'key2': '7'}
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

  test('compareObjectVals with complex key', () => {
    const { createdVals, updatedVals, deletedVals } = compareObjectVals(
    [
      originalArrayOfComplexObjects,
      newArrayOfComplexObjects
    ],
    (obj1, obj2) => obj1.key1 === obj2.key1 && obj1.key2 === obj2.key2
    );

    expect(createdVals).toStrictEqual([{'key1': 7, 'key2': '7'}]);
    expect(updatedVals).toStrictEqual([{'key1': 2, 'key2': '2', 'otherProperty': 'new stuff'}]);
    expect(deletedVals).toStrictEqual([{'key1': 1, 'key2': '1', 'otherProperty': 'stuff 1'}]);
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
    and stateUpdatedArray you want to compare, and the keyOrMatcher must be of type string or function!`);
    }
  })

  test('receive both as empty arrays', () => {
    const compareVals = compareObjectVals([[], []],'commonKey');
    expect(compareVals.createdVals).toBe(null);
    expect(compareVals.updatedVals).toBe(null);
    expect(compareVals.deletedVals).toBe(null);
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
    expect(createdVals).toStrictEqual([1, 'seven', true, 33]);
    expect(deletedVals).toStrictEqual(null);
  });

  test('Received two empty array items', () => {
    const { createdVals, deletedVals } = compareArrayVals([[], []]);
    expect(createdVals).toStrictEqual(null);
    expect(deletedVals).toStrictEqual(null);
  })
});

const ob1 = { 'test': 1, 'test2': 2 };
const ob2 = { 'test': 1, 'test2': 2 };
const ob3 = { 'a': undefined };
const ob4 = { 'b': 'something' };

describe('helper isEqualObject comparer tests', () => {

test('isEqualObject truthy tests', () => {
  expect(isEqualObject(ob1, ob2)).toBe(true);
  expect(isEqualObject(ob3, ob3)).toBe(true);
});

test('isEqualObject falsy tests', () => {
  expect(isEqualObject(originalArrayOfObjects[0], newArrayOfObjects[0])).toBe(false);
  expect(isEqualObject(ob3, ob4)).toBe(false);
  expect(isEqualObject(ob4, ob3)).toBe(false);
});

});