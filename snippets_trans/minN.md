### minN

给定数组的最小的 `n` 个值

```js
const minN = (arr, n = 1) => [...arr].sort((a, b) => a - b).slice(0, n);
```
```js
minN([1, 2, 3]); // [1]
minN([1, 2, 3], 2); // [1,2]
```
