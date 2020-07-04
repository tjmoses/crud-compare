# CRUD Compare

![npm](https://img.shields.io/npm/v/crud-compare)
![npm bundle size](https://img.shields.io/bundlephobia/min/crud-compare)
![GitHub](https://img.shields.io/github/license/tjmoses/crud-compare)

This is a very ✌ lightweight and ⚡️ fast library for comparing **objects** and **arrays** (mostly before save) to get the created, updated, and deleted values.

- Provides **Created**, **Updated**, and **Deleted** values (via separate arrays) from comparing an array of objects given a *related key*.
  
- Has a compare array function for easily obtaining the created and deleted values between two arrays.

- Lastly, has a shallow (1 level deep) object comparing helper function for quick equivalence checks.

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
