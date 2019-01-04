### initializeNDArray

使用指定值初始化 n 维数组（列）

使用递归

使用 `Array.prototype.map()` 生成每一行，然后该行的每个元素又递归调用初始化函数

```js
const initializeNDArray = (val, ...args) =>
  args.length === 0
    ? val
    : Array.from({ length: args[0] }).map(() => initializeNDArray(val, ...args.slice(1)));
```

```js
initializeNDArray(1, 3); // [1,1,1]
initializeNDArray(5, 2, 2, 2); // [[[5,5],[5,5]],[[5,5],[5,5]]]
```
