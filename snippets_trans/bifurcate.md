### bifurcate

将数据分成两组。若一个元素在 `filter` 中对应真值，那该元素位于第一组，否则位于第二组。

使用 `Array.prototype.reduce()` 和 `Array.prototype.push()` 来处理

```js
const bifurcate = (arr, filter) =>
  arr.reduce((acc, val, i) => (acc[filter[i] ? 0 : 1].push(val), acc), [[], []]);
```

```js
bifurcate(['beep', 'boop', 'foo', 'bar'], [true, true, false, true]); // [ ['beep', 'boop', 'bar'], ['foo'] ]
```
