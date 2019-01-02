### average

Returns the average of two or more numbers.

返回多个数字的均值

使用 `Array.prototype.reduce()` 累加数组的值，再除以数组长度

累加的初始值给个 `0`

```js
const average = (...nums) => nums.reduce((acc, val) => acc + val, 0) / nums.length;
```

```js
average(...[1, 2, 3]); // 2
average(1, 2, 3); // 2
```
