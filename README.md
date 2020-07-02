# CRUD Compare

Provides create, delete, and update values from comparing an array of objects given a related key. Also, has a compare array function for easily obtaining the created and deleted values between two arrays (not objects).

## Install

```
$ npm install crud-compare
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
```

The length of a created, updated, or deleted value will be empty if they didn't exist. A shallow compare is performed on objects within the compareObjectVals function.
