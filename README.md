# CRUD Object Diff - JS State Comparison Helper

![npm](https://img.shields.io/npm/v/crud-object-diff)
![npm bundle size](https://img.shields.io/bundlephobia/min/crud-object-diff)
![Coverage](coverage/badge.svg)
![GitHub](https://img.shields.io/github/license/tjmoses/crud-object-diff)
![Dependencies](https://status.david-dm.org/gh/tjmoses/crud-object-diff.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![CircleCI](https://circleci.com/gh/tjmoses/crud-object-diff/tree/master.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)

> This is a very ✌ lightweight and ⚡️ fast library for comparing **objects**, **arrays**, and **arrays of objects** to get the *Created, Updated, & Deleted* values (helpful for state comparisons).

- [CRUD Object Diff - JS State Comparison Helper](#crud-object-diff---js-state-comparison-helper)
  - [Install](#install)
  - [Usage](#usage)
    - [Comparing Arrays of Objects](#comparing-arrays-of-objects)
    - [Comparing Arrays](#comparing-arrays)
    - [Comparing Two Arrays or Two Objects via helper functions](#comparing-two-arrays-or-two-objects-via-helper-functions)
  - [Todo](#todo)
  - [Contributing](#contributing)
  - [License](#license)

## Install

```bash
npm install crud-object-diff
```

## Usage

### Comparing Arrays of Objects

- Method: `compareObjectVals`

- Parameters: `toCompareVals: [Object[], Object[]], key?: string|string[]`

- Returns: `{ createdVals: Object[]|null, updatedVals: Object[]|null, deletedVals: Object[]|null }`

- Provides: **Created**, **Updated**, and **Deleted** values (via separate arrays) from comparing two arrays of objects.
  - It is **recommended** to provide a *related unique key* (i.e. primary key on data) between the objects to be compared using the ***compareObjectVals*** function. A single or composite (several keys) key can be provided in an array for relatedObjectKey.
  - Without giving a related key, the algorithm traverses every single key in each provided object looking for when a single object key is matched along with a value with equivalence between the matching found key.
  - The values of the returned created, updated, or deleted arrays from compareObjectVals / compareArrayVals functions will be null if they do not exist.

```js
const originalArrayOfObjects = [{ one: 1, two: 2 }, { test: undefined }];
const newArrayOfObjects = [{ one: 1, two: null }, { one: 22, five: 5 }]
const relatedObjectKey = 'one';

const { createdVals, updatedVals, deletedVals } = compareObjectVals(
  [originalArrayOfObjects, newArrayOfObjects],
  relatedObjectKey // Not required, but suggested for speed.
);

console.log(createdVals); // [{ one: 22, five: 5 }]
console.log(updatedVals); // [{ one: 1, two: null }]
console.log(deletedVals); // [{ test: undefined }]
```

See further examples [here](https://github.com/tjmoses/crud-object-diff/blob/master/index.test.js#L12).

### Comparing Arrays

- Method: `compareArrayVals`

- Parameters: `toCompareVals: [any[], any[]]`

- Returns: `{ createdVals: any[] | null, deletedVals: any[] | null }`

- Provides: **Created** and **Deleted** values between two arrays of primitives (strings, numbers, etc.) using the ***compareArrayVals*** function.

```js
const originalArrayItem = [1, 2, 'five', true, 33];
const updatedArrayItem = [1, 'seven', true, 33];

const { createdVals, deletedVals } = compareArrayVals(
  [ originalArrayItem, updatedArrayItem ]
);
console.log(createdVals); // ['seven']
console.log(deletedVals); // [2, 'five']
```

See further examples [here](https://github.com/tjmoses/crud-object-diff/blob/master/index.test.js#L285).

### Comparing Two Arrays or Two Objects via helper functions

`isEqualObject(a: Object, b: Object): Boolean`

`isEqualArray(a: any[], b: any[]): Boolean`

- Deep Object and Array comparing helper functions are provided for quick equivalence checks using the ***isEqualObject*** or ***isEqualArray*** functions. *Note: [Object.is()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) is used for primative data type comparison checks.

```js
const obj1 = {a: 1, b: 2, c: {'one': 1, 'two': [{ 2: 1, 44:3 }]}};
const obj2 = {a: 1, b: 2, c: {'one': 1, 'two': [{ 2: 1, 44:3 }]}};
const areObjectsEquivalent = isEqualObject(obj1, obj2); // true
```

```js
const array1 = [Symbol('33')];
const array2 = ['one', 'two'];
const areArraysEquivalent = isEqualArray(array1, array2); // false
```

See further examples [here](https://github.com/tjmoses/crud-object-diff/blob/master/index.test.js#L272)

To support, Please &#127775; if you used / like this library!

## Todo

- [ ] Add more tests for edge cases.
- [ ] Update prettier and fix the linter.
- [ ] Get the Google Closure Compiler working w/ the advanced compile setting, and fix types in the code to reach ~99%.

## Contributing

Please see the contributing guidelines [here](contributing.md) for further information. All contributions are appreciated, even if they are just comments from issues.

## License

MIT
