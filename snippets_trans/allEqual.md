### allEqual

检查数组中的元素是否全部相等

内部使用 `Array.prototype.every()` 来检查所有的元素是否和数组的第一个元素 `arr[0]` 相等即可

```js
const allEqual = arr => arr.every(val => val === arr[0]);
```

```js
allEqual([1, 2, 3, 4, 5, 6]); // false
allEqual([1, 1, 1, 1]); // true
```
