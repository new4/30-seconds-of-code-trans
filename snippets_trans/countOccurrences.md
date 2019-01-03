### countOccurrences

统计一个值在数组中出现的次数

使用 `Array.prototype.reduce()` 来递增计数次数

```js
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
```

```js
countOccurrences([1, 1, 2, 1, 2, 3], 1); // 3
```
