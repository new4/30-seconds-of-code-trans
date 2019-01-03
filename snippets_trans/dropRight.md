### dropRight

将数组移除右边边 `n` 个元素并返回

```js
const dropRight = (arr, n = 1) => arr.slice(0, -n);
```

```js
dropRight([1, 2, 3]); // [1,2]
dropRight([1, 2, 3], 2); // [1]
dropRight([1, 2, 3], 42); // []
```
