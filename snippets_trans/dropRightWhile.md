### dropRightWhile

从右边开始移除数组元素直到改元素使得函数 `func` 返回 `true`

```js
const dropRightWhile = (arr, func) => {
  while (arr.length > 0 && !func(arr[arr.length - 1])) arr = arr.slice(0, -1);
  return arr;
};
```

```js
dropRightWhile([1, 2, 3, 4], n => n < 3); // [1, 2]
```
