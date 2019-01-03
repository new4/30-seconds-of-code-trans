### findLastIndex

返回使得函数返回真值的最后一个元素的下标

```js
const findLastIndex = (arr, fn) =>
  arr
    .map((val, i) => [i, val]) // 重新组织一下参数传进去
    .filter(([i, val]) => fn(val, i, arr))
    .pop()[0];
```

```js
findLastIndex([1, 2, 3, 4], n => n % 2 === 1); // 2 (index of the value 3)
```
