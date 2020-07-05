# CRUD Compare

![npm](https://img.shields.io/npm/v/crud-compare)
![npm bundle size](https://img.shields.io/bundlephobia/min/crud-compare)
![Coverage](coverage/badge.svg)
![GitHub](https://img.shields.io/github/license/tjmoses/crud-compare)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

This is a very ✌ lightweight and ⚡️ fast library for comparing **objects** and **arrays** (mostly before save) to get the created, updated, and deleted values.

- Provides **Created**, **Updated**, and **Deleted** values (via separate arrays) from comparing two arrays of objects given a *related key*, using the ***compareObjectVals*** function.
  
- Provides **Created** and **Deleted** values between two arrays of primitives (strings, numbers, etc.) using the ***compareArrayVals*** function.

- Lastly, has a shallow (1 level deep) object comparing helper function for quick equivalence checks using the ***isEqualObject*** function.

## Install

```bash
npm install crud-compare
```

## Usage

```js
const compare = require("crud-compare");

const { createdVals, updatedVals, deletedVals } = compare.compareObjectVals(
  [
    originalArrayOfObjects,
    newArrayOfObjects
  ],
  relatedObjectKey
);

// perform crud operations...

const { createdVals, deletedVals } = compare.compareArrayVals(
  [
    originalArrayItem,
    updatedArrayItem
  ]
);
// perform further operations...

const areObjectsEquivalent = compare.isEqualObject(
  obj1,
  obj2
);

```

The length of a created, updated, or deleted value will be empty if they didn't exist. A shallow compare is performed on objects within the compareObjectVals function.

## Contribute

1. Fork it and create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am "Add some feature"`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request

## License

MIT