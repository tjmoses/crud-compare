const { compareObjectVals, compareArrayVals, isEqualObject, isEqualArray } = require('./dist/index.js');

const originalArrayOfObjects = [
  {'commonKey': 1, 'anotherkey': 'test'},
  {'commonKey': 2}
];
const newArrayOfObjects = [
  {'commonKey': 2, 'newkey': 'test'},
  {'commonKey': 7}
];

describe('CompareObjectVals tests', () => {
  test('basic compareObjectVals functionality', () => {
      const { createdVals, updatedVals, deletedVals } = compareObjectVals(
      [
        originalArrayOfObjects,
        newArrayOfObjects
      ]);
      expect(deletedVals).toStrictEqual([{'commonKey': 1, 'anotherkey': 'test'}]);
      expect(updatedVals).toStrictEqual([{'commonKey': 2, 'newkey': 'test'}]);
      expect(createdVals).toStrictEqual([{'commonKey': 7}]);
    });

  test('compareObjectVals functionality w/ nested objects', () => {
        const orgOb1 = [
          {'test': 11, 'key2': 22}, 
          {'test': 23, 1: [1,3]}, 
          {'test': [{'test33': 22}, {1: 22}]}
        ];
        const newOb1 = [
          {'test': 11, 'key2': 33}, 
          {'test': 22}, 
          {'test': 23, 1: [1,8,3]}];
        const { 
          createdVals, updatedVals, deletedVals
        } = compareObjectVals([orgOb1, newOb1]);
        expect(deletedVals).toStrictEqual([{'test': [{'test33': 22}, {1: 22}]}]);
        expect(updatedVals).toStrictEqual([{'test': 11, 'key2': 33}, {'test': 23, 1: [1,8,3]}]);
        expect(createdVals).toStrictEqual([{'test': 22}]);
    });

  test('compareObjectVals functionality w/ undefined value given', () => {
    const originalArrayOfObjects = [{ one: 1, two: 2 }, { test: undefined }];
    const newArrayOfObjects = [{ one: 1, two: null }, { one: 22, five: 5 }]
    const relatedObjectKey = 'one';
    const { createdVals, updatedVals, deletedVals } = compareObjectVals(
      [originalArrayOfObjects, newArrayOfObjects],
      relatedObjectKey // Not required, but suggested for speed.
    );
    expect(createdVals).toStrictEqual([{ one: 22, five: 5 }]);
    expect(updatedVals).toStrictEqual([{ one: 1, two: null }]);
    expect(deletedVals).toStrictEqual([{ test: undefined }]);
  });

  test('compareObjectVals functionality w/ only updated objects', () => {
        const orgOb1 = [
          {'test': 11, 'key2': 32}, 
          {'test': 23, 1: [1,3]}
        ];
        const newOb1 = [
          {'test': 11, 'key2': 22}, 
          {'test': 23, 1: [1,18,3]}
        ];
        const { 
          createdVals, updatedVals, deletedVals
        } = compareObjectVals([orgOb1, newOb1]);
        expect(deletedVals).toStrictEqual(null);
        expect(updatedVals).toStrictEqual([
            {'test': 11, 'key2': 22},
            {'test': 23, 1: [1,18,3]}]
          );
        expect(createdVals).toStrictEqual(null);
    });

  test('compareObjectVals functionality w/ nested objects given the key', () => {
        const orgOb1 = [
          {'test': 11, 'key2': 22}, 
          {'test': 23, 1: [1,3]}, 
          {'test': [{'test33': 22}, {1: 22}]}
        ];
        const newOb1 = [
          {'test': 11, 'key2': 33}, 
          {'test': 23, 1: [1,8,3]},
          {'test': 22}
        ]
        const { createdVals, updatedVals, deletedVals } = 
          compareObjectVals([orgOb1, newOb1], 'test');
        expect(deletedVals).toStrictEqual([{'test': [{'test33': 22}, {1: 22}]}]);
        expect(updatedVals).toStrictEqual([{'test': 11, 'key2': 33}, {'test': 23, 1: [1,8,3]}]);
        expect(createdVals).toStrictEqual([{'test': 22}]);
    });

  test('compareObjectVals functionality w/ nested objects given an incorrect key', () => {
        const key = Symbol('3434');
        const orgOb1 = [
          { [key]: 11, 'key2': 22}, 
          { [key]: 23, 1: [1,3]}, 
          { [key]: [{'test33': 22}, {1: 22}]}
        ];
        const newOb1 = [
          { [key]: 11, 'key2': 33}, 
          { [key]: 23, 1: [1,8,3]},
          { [key]: 22}
        ];
        const { createdVals, updatedVals, deletedVals } = 
          compareObjectVals([orgOb1, newOb1], [key, [33,3,3,3,33]]);
        expect(deletedVals).toStrictEqual([
          { [key]: 11, 'key2': 22}, 
          { [key]: 23, 1: [1,3]}, 
          { [key]: [{'test33': 22}, {1: 22}]}
        ]);
        expect(updatedVals).toStrictEqual(null);
        expect(createdVals).toStrictEqual([
          { [key]: 11, 'key2': 33}, 
          { [key]: 23, 1: [1,8,3]},
          { [key]: 22}
        ]);
    });

  test('compareObjectVals functionality w/ composite keys', () => {
      const symKey = Symbol('44');
      const orgOb1 = [
        {[symKey]: 11, 'key2': 22}, 
        {[symKey]: 55, 'key2': 90, 'anotherkey': 'keyval'},
        {[symKey]: 23, 'key2': 88, 1: [1,3]},
      ];
      const newOb1 = [
        {[symKey]: 11, 'key2': 22, 'key5': 'test'}, 
        {[symKey]: 22, 'key2': 'newkeyval'}, 
        {[symKey]: 23, 'key2': 88, 1: [1,8,3]}
      ];
      const { 
        createdVals, updatedVals, deletedVals
      } = compareObjectVals([orgOb1, newOb1], [symKey, 'key2']);
      expect(deletedVals).toStrictEqual([{[symKey]: 55, 'key2': 90, 'anotherkey': 'keyval'}]);
      expect(updatedVals).toStrictEqual([{[symKey]: 11, 'key2': 22, 'key5': 'test'}, {[symKey]: 23, 'key2': 88, 1: [1,8,3]}]);
      expect(createdVals).toStrictEqual([{[symKey]: 22, 'key2': 'newkeyval'}]);
    });

  test('empty original array of objects', () => {
      const { createdVals, updatedVals, deletedVals } = compareObjectVals([[], newArrayOfObjects], 'commonKey');
      expect(createdVals).toStrictEqual([{'commonKey': 2, 'newkey': 'test'},{'commonKey': 7}]);
      expect(updatedVals).toStrictEqual(null);
      expect(deletedVals).toStrictEqual(null);
    });

  test('Incorrect compare key type, non-array key.', () => {
      try {
        compareObjectVals([[], newArrayOfObjects], {'test': 1});
      } catch (e) {
        expect(e.message).toBe('The given compare key must be of type "string" or "symbol" if one is provided!')
      }
    });

  test('Incorrect compare key type, array key.', () => {
      try {
        compareObjectVals([[], newArrayOfObjects], [{'test': 1}]);
      } catch (e) {
        expect(e.message).toBe('The key values must be primatives!')
      }
    });
    
  test('No key w/ incorrect original object type.', () => {
      const orginalArrObjs = [{ 'one': 1 }, [2, 33]];
      const activeArrObjs = [{ 'one': 1 }, { 'two': 2 }, [2, 33]];
      try {
        compareObjectVals([orginalArrObjs, activeArrObjs]);
      } catch (e) {
        expect(e.message).toBe('Original item array must consist of only objects!');
      }
    });

  test('compareObjectVals input wrong length', () => {
    try {
      compareObjectVals([originalArrayOfObjects],'commonKey');
    } catch (e) {
      expect(e.message).toBe('Compare arguments are of the wrong length!');
    }
    });

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
        expect(e.message).toBe(`toCompareVals must be an array of the originalArray and stateUpdatedArray you want to compare!`);
      }
    });

  test('receive both as empty arrays', () => {
      const compareVals = compareObjectVals([[], []],'commonKey');
      expect(compareVals.createdVals).toBe(null);
      expect(compareVals.updatedVals).toBe(null);
      expect(compareVals.deletedVals).toBe(null);
    });
});

const originalArrayItem = [1, 2, 'five', true, 33];
const updatedArrayItem = [1, 'seven', true, 33];

describe('CompareArrayVals tests', () => {

test('compareArrayVals functionality', () => {
    const { createdVals, deletedVals } = compareArrayVals(
      [originalArrayItem, updatedArrayItem]);

    expect(createdVals).toStrictEqual(['seven']);
    expect(deletedVals).toStrictEqual([2, 'five']);
  });

test('CompareObjectVals input wrong length', () => {
    try {
      compareArrayVals([originalArrayItem]);
    } catch (e) {
      expect(e.message).toBe('ToCompareVal arguments are of the wrong length!')
    }
  });

test('Empty original item', () => {
    const { createdVals, deletedVals } = compareArrayVals([[], updatedArrayItem]);
    expect(createdVals).toStrictEqual([1, 'seven', true, 33]);
    expect(deletedVals).toStrictEqual(null);
  });

test('Received two empty array items', () => {
    const { createdVals, deletedVals } = compareArrayVals([[], []]);
    expect(createdVals).toStrictEqual(null);
    expect(deletedVals).toStrictEqual(null);
  });

test('Created Values only.', () => {
    const uniqueSymbol = Symbol('3');
    const { createdVals, deletedVals } = compareArrayVals([['1'], ['1', 2, uniqueSymbol]]);
    expect(createdVals).toStrictEqual([2, uniqueSymbol]);
    expect(deletedVals).toBe(null);
  });

test('Deleted Values only.', () => {
    const uniqueSymbol = Symbol('3');
    const { createdVals, deletedVals } = compareArrayVals([['1', 2, uniqueSymbol], [2, uniqueSymbol]]);
    expect(createdVals).toBe(null);
    expect(deletedVals).toStrictEqual(['1']);
  });
});

const ob1 = { 'test': 1, 'test2': 2 };
const ob2 = { 'test': 1, 'test2': 2 };
const ob3 = { 'a': undefined };
const ob4 = { 'b': 'something' };
const ob5 = { 'a': Number.NaN };
const ob6 = { 'a': NaN };
const ob7 = { 'a': 'test', b: 5, c: 22, d: undefined };
const ob8 = { 'a': 'test', b: 55, c: 22, d: undefined };

describe('isEqualObject helper tests', () => {
  test('isEqualObject basic truthy tests', () => {
      expect(isEqualObject(ob1, ob2)).toBe(true);
      expect(isEqualObject(ob3, ob3)).toBe(true);
      expect(isEqualObject(ob5, ob6)).toBe(true);
  });
  test('isEqualObject basic falsy tests', () => {
      expect(isEqualObject(originalArrayOfObjects[0], newArrayOfObjects[0])).toBe(false);
      expect(isEqualObject(ob3, ob4)).toBe(false);
      expect(isEqualObject(ob4, ob3)).toBe(false);
      expect(isEqualObject(ob7, ob8)).toBe(false);
  });
  test('isEqualObject with nested objects containing array of objects', () => {
        const oba1 = {a: 1, b: 2, c: {'one': 1, 'two': [{ 2: 1, 44:1 }]}};
        const oba2 = {a: 1, b: 2, c: {'one': 1, 'two': [{ 2: 1, 44:1 }]}};
        const oba3 = {a: 1, b: 2, c: {'one': 1, 'two': [{ 2: 1, 44:3 }]}};
        const oba4 = {a: 1, b: 2, c: {'one': 1, 'two': [{ 44:1 }]}};
        const oba5 = {a: 1, b: 2, c: {'one': 1, 'two': [22]}};
        const oba6 = {a: 1, b: 2, c: {'one': 1, 'two': [22]}};
        expect(isEqualObject(oba1, oba2)).toBe(true);
        expect(isEqualObject(oba2, oba3)).toBe(false);
        expect(isEqualObject(oba3, oba4)).toBe(false);
        expect(isEqualObject(oba4, oba5)).toBe(false);
        expect(isEqualObject(oba5, oba6)).toBe(true);
  });
  test('isEqualObject with nested basic identical array', () => {
      const obb1 = {a: 1, b: [2]};
      const obb2 = {a: 1, b: [2]};
      const obb3 = {a: 1, b: [2, 33]};
      const obb4 = {a: 1, b: [2, 33]};
      const obb5 = {a: 1, b: {1: 33}};
      const obb6 = {a: 1, b: {1: 33, 5: 11}};
      const obb7 = {a: 1, b: {1: 33, 5: undefined}};
      const obb8 = {a: 1, b: {1: 33, null: 3}};
      const obb9 = {a: 1, b: {1: 33, null: 3}};
      expect(isEqualObject(obb1, obb2)).toBe(true);
      expect(isEqualObject(obb2, obb3)).toBe(false);
      expect(isEqualObject(obb3, obb4)).toBe(true);
      expect(isEqualObject(obb4, obb5)).toBe(false);
      expect(isEqualObject(obb5, obb6)).toBe(false);
      expect(isEqualObject(obb6, obb7)).toBe(false);
      expect(isEqualObject(obb7, obb8)).toBe(false);
      expect(isEqualObject(obb8, obb9)).toBe(true);
  });
});

describe ('isEqualArray helper tests', () => {
  test('Edge case array compare helper tests.', () => {
    expect(isEqualArray([1], [2])).toBe(false);
    expect(isEqualArray(['one','two'], [Symbol('33')])).toBe(false);
    expect(isEqualArray([[Symbol('33')]], [['one', 'two']])).toBe(false);
  });
});