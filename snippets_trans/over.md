### over

根据一些函数创建一个新的函数，依次给原来的函数传入参数并返回结果数组

```js
const over = (...fns) => (...args) => fns.map(fn => fn.apply(null, args));
```

```js
const minMax = over(Math.min, Math.max);
minMax(1, 2, 3, 4, 5); // [1,5]
```
