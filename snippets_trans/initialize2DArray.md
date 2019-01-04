### initialize2DArray

用指定的 `width`, `height` 和 `val` 初始化一个二维数组

`IE` 不支持 `Array.prototype.fill`，此处有个 [polyfill](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)

```js
const initialize2DArray = (w, h, val = null) =>
  Array.from({ length: h }).map(() => Array.from({ length: w }).fill(val)); // IE 不支持 Array.prototype.fill
```

```js
initialize2DArray(2, 2, 0); // [[0,0], [0,0]]
```
