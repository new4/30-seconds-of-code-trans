### isArrayLike

检测是否是类数组对象（如，iterable 可迭代对象）

非 `null` 且它的 `Symbol.iterator` 属性是一个函数

```js
const isArrayLike = obj => obj != null && typeof obj[Symbol.iterator] === 'function';
```

```js
isArrayLike(document.querySelectorAll('.className')); // true
isArrayLike('abc'); // true
isArrayLike(null); // false
```
