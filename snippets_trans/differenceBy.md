### differenceBy

返回数组 `a` 中元素的 `fn` 函数调用结果和 `b` 中元素的 `fn` 函数调用结果不一致的元素

`Set` 使用 `fn` 运行结果进行初始化

```js
const differenceBy = (a, b, fn) => {
  const s = new Set(b.map(fn));
  return a.filter(x => !s.has(fn(x)));
};
```

```js
differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [1.2]
differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], v => v.x); // [ { x: 2 } ]
```
