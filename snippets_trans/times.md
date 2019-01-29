### times

迭代调用函数 `n` 次，`n` 次后或者函数返回 `false` 的话就停止调用

```js
const times = (n, fn, context = undefined) => {
  let i = 0;
  while (fn.call(context, i) !== false && ++i < n) {}
};
```

```js
var output = '';
times(5, i => (output += i));
console.log(output); // 01234
```
