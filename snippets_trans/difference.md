### difference

返回数组 `a` 中有而 `b` 中没有的值

用 `b` 建立一个 `Set`，然后使用过滤函数 `Array.prototype.filter()` 过滤数组 `a`

```js
const difference = (a, b) => {
  const s = new Set(b);
  return a.filter(x => !s.has(x));
};
```

```js
difference([1, 2, 3], [1, 2, 4]); // [3]
```
