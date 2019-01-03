### deepFlatten

深度展平一个数组

使用迭代

使用扩展操作符(`...`) 来展平一个数组

```js
const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));
```

```js
deepFlatten([1, [2], [[3], 4], 5]); // [1,2,3,4,5]
```
