### distance

返回两点之间的距离

使用 `Math.hypot()` (这个方法 IE 不兼容)

```js
const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);
```

```js
distance(1, 1, 2, 3); // 2.23606797749979
```
