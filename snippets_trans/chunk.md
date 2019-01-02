### chunk

将数组分割成指定大小的多个小数组

使用 `Array.from()` 创建一个符合最终大小的数组，使用 `Array.prototype.slice()` 获取 `size` 大小的组

```js
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
```

```js
chunk([1, 2, 3, 4, 5], 2); // [[1,2],[3,4],[5]]
```
