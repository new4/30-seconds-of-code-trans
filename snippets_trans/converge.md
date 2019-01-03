### converge

接受一个聚合函数和一个分支函数列表，并返回一个传入参数给每个分支函数的函数，该函数将分支函数的运行结果作为参数传递给聚合函数。

使用 `Array.prototype.map()` 和 `Function.prototype.apply()` 给每个分支函数传入参数

使用扩展运算符 (`...`) 来传入分支函数的执行结果给 `coverger`

```js
const converge = (converger, fns) => (...args) => converger(...fns.map(fn => fn.apply(null, args)));
```

```js
const average = converge((a, b) => a / b, [
  arr => arr.reduce((a, v) => a + v, 0),
  arr => arr.length
]);
average([1, 2, 3, 4, 5, 6, 7]); // 4
```
