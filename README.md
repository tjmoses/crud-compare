# CRUD Compare - JS State Comparison Helper

![npm](https://img.shields.io/npm/v/crud-compare)
![npm bundle size](https://img.shields.io/bundlephobia/min/crud-compare)
![Coverage](coverage/badge.svg)
![GitHub](https://img.shields.io/github/license/tjmoses/crud-compare)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![CircleCI](https://circleci.com/gh/tjmoses/crud-compare/tree/master.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)

This is a very ✌ lightweight and ⚡️ fast library for comparing **objects** and **arrays** (mostly before save) to get the created, updated, and deleted values for state comparisons.

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

// comparing array of objects - using a single property as key.
const { createdVals, updatedVals, deletedVals } = compare.compareObjectVals(
  [
    originalArrayOfObjects,
    newArrayOfObjects
  ],
  relatedObjectKey  // string - the name of the property to be used as key
);

// comparing array of objects - using custom matcher logic.
matcher = (o1, o2) => o1.fName === o2.fName && o1.lName === o2.lName; // (o1: any, o2: any) => boolean
const { createdVals, updatedVals, deletedVals } = compare.compareObjectVals(
  [
    originalArrayOfObjects,
    newArrayOfObjects
  ],
  matcher
);

// comparing array of primitives values (based on strict equality)
const { createdVals, deletedVals } = compare.compareArrayVals(
  [
    originalArrayItem,
    updatedArrayItem
  ]
);

// helper function for comparing 2 objects - 1 level deep strict equality
const areObjectsEquivalent = compare.isEqualObject(
  obj1,
  obj2
);

```

The values of the returned created, updated, or deleted values for compareObjectVals / compareArrayVals will be null if they do not exist. A shallow compare is performed on objects within the compareObjectVals function.

## Contribute

1. Fork it and create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am "Add some feature"`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request

## License

MIT
