### dropWhile

从左边开始移除数组元素直到改元素使得函数 `func` 返回 `true`

```js
const dropWhile = (arr, func) => {
  while (arr.length > 0 && !func(arr[0])) arr = arr.slice(1);
  return arr;
};
```

```js
dropWhile([1, 2, 3, 4], n => n >= 3); // [3,4]
```
