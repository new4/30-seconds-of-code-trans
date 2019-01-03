### differenceWith

过滤出数组中对于比较函数不返回 `true` 的值

使用 `Array.prototype.filter()` 和 `Array.prototype.findIndex()`

```js
const differenceWith = (arr, val, comp) => arr.filter(a => val.findIndex(b => comp(a, b)) === -1);
```

```js
differenceWith([1, 1.2, 1.5, 3, 0], [1.9, 3, 0], (a, b) => Math.round(a) === Math.round(b)); // [1, 1.2]
```
