### everyNth

返回步距 `nth` 的采样数据

使用 `Array.prototype.filter()` 检测 `index`

```js
const everyNth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
```

```js
everyNth([1, 2, 3, 4, 5, 6], 2); // [ 2, 4, 6 ]
```
