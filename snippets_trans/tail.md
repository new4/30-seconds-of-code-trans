### tail

返回数组中除第一个元素以外的元素，如果只有一个元素则返回原数组

```js
const tail = arr => (arr.length > 1 ? arr.slice(1) : arr);
```

```js
tail([1, 2, 3]); // [2,3]
tail([1]); // [1]
```
