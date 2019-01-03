### dayOfYear

获取某一个 `Date` 对象是该年的第几天

使用 `new Date()` 和 `Date.prototype.getFullYear()` 获取 `Date` 对象对应年份的第一天，然后提取对应天数的秒数，再使用 `Math.floor()` 来算出天数

```js
const dayOfYear = date =>
  Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
```

```js
dayOfYear(new Date()); // 272
```
