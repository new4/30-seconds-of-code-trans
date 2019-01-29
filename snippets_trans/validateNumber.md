### validateNumber

有效的数字

使用 `!isNaN()` 和 `parseFloat()` 检测是否是数字
使用 `isFinite()` 检测是否是有限的
使用 `Number()` 检测强制转换

```js
const validateNumber = n => !isNaN(parseFloat(n)) && isFinite(n) && Number(n) == n;
```

```js
validateNumber('10'); // true
```
