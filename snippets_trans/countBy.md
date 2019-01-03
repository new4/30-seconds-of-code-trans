### countBy

使用指定的函数对数组元素进行分组，返回每组数据的数目

使用 `Array.prototype.map()` 将数组的元素映射为函数参数或者应用元素属性

使用 `Array.prototype.reduce()` 创建一个对象，它的键值由映射结果创建

```js
const countBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
```

```js
countBy([6.1, 4.2, 6.3], Math.floor); // {4: 1, 6: 2}
countBy(['one', 'two', 'three'], 'length'); // {3: 2, 5: 1}
```
