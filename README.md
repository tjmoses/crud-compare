# CRUD Object Diff - JS State Comparison Helper

![npm](https://img.shields.io/npm/v/crud-compare)
![npm bundle size](https://img.shields.io/bundlephobia/min/crud-compare)
![Coverage](coverage/badge.svg)
![GitHub](https://img.shields.io/github/license/tjmoses/crud-compare)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![CircleCI](https://circleci.com/gh/tjmoses/crud-compare/tree/master.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)

This is a very ✌ lightweight and ⚡️ fast library for comparing **objects** and **arrays** (mostly before save) to get the created, updated, and deleted values for state comparisons.

- [CRUD Object Diff - JS State Comparison Helper](#crud-object-diff---js-state-comparison-helper)
  - [Install](#install)
  - [Usage](#usage)
    - [Comparing Arrays of Objects](#comparing-arrays-of-objects)
    - [Comparing Arrays](#comparing-arrays)
    - [Comparing Two Arrays or Two Objects via helper functions](#comparing-two-arrays-or-two-objects-via-helper-functions)
  - [Todo](#todo)
  - [Contribute](#contribute)
  - [License](#license)

## Install

```bash
npm install crud-object-diff
```

## Usage

### Comparing Arrays of Objects

- Provides **Created**, **Updated**, and **Deleted** values (via separate arrays) from comparing two arrays of objects.
- It is **recommended** to provide a *related unique key* (i.e. primary key on data) between the objects to be compared using the ***compareObjectVals*** function. A single or composite (several keys) key can be provided in an array for relatedObjectKey.
- Without giving a related key, the algorithm traverses every single key in each provided object looking for when a single object key is matched along with a value with equivalence between the matching found key.
- The values of the returned created, updated, or deleted arrays from compareObjectVals / compareArrayVals functions will be null if they do not exist.

```js
const { createdVals, updatedVals, deletedVals } = compareObjectVals(
  [
    originalArrayOfObjects,
    newArrayOfObjects
  ],
  relatedObjectKey // Not required, but suggested for speed.
);
```

### Comparing Arrays

- Provides **Created** and **Deleted** values between two arrays of primitives (strings, numbers, etc.) using the ***compareArrayVals*** function.

```js
const { createdVals, deletedVals } = compareArrayVals(
  [
    originalArrayItem,
    updatedArrayItem
  ]
);
```

### Comparing Two Arrays or Two Objects via helper functions

- Deep Object and Array comparing helper functions are provided for quick equivalence checks using the ***isEqualObject*** or ***isEqualArray*** functions. *Note: [Object.is()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) is used for primative data type comparison checks.

```js
const areObjectsEquivalent = isEqualObject(
  obj1,
  obj2
);
const areArraysEquivalent = isEqualArray(
  array1,
  array2
);
```

To support, Please &#127775; if you used / like this library!

## Todo

- [ ] Add more tests for edge cases.
- [ ] Update prettier and fix the linter.
- [ ] Get the Google Closure Compiler working w/ the advanced compile setting, and fix types in the code to reach ~99%.

## Contribute

1. Fork it and create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am "Add some feature"`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request

## License

MIT
