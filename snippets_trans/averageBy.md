### averageBy

将数组每个对象以 `fn` 为规则的映射值做平均，`fn` 可以是处理函数，也可以是属性名

使用 `Array.prototype.map()` 来获取经 `fn` 处理后的映射值，再使用 `Array.prototype.reduce()` 累加，随后除以数组长度获得均值

```js
const averageBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => acc + val, 0) /
  arr.length;
```

```js
averageBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], o => o.n); // 5
averageBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 5
```
