### fibonacci

生成斐波那契数组

使用 `Array.from()` 和 `Array.prototype.reduce()`

使用数组下标初始化最开始的两个值 `0` 和 `1`

```js
const fibonacci = n =>
  Array.from({ length: n }).reduce(
    (acc, val, i) => acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i),
    []
  );
```

```js
fibonacci(6); // [0, 1, 1, 2, 3, 5]
```
