### castArray

若给定值不是一个数组，则将其转化成一个数组

```js
const castArray = val => (Array.isArray(val) ? val : [val]);
```

```js
castArray('foo'); // ['foo']
castArray([1]); // [1]
```
