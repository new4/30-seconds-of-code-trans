### drop

将数组移除左边 `n` 个元素并返回

```js
const drop = (arr, n = 1) => arr.slice(n);
```

```js
drop([1, 2, 3]); // [2,3]
drop([1, 2, 3], 2); // [3]
drop([1, 2, 3], 42); // []
```
