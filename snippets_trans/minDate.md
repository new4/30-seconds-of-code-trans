### minDate

返回给定日期值中的最小值

```js
const minDate = (...dates) => new Date(Math.min.apply(null, ...dates));
```

```js
const array = [
  new Date(2017, 4, 13),
  new Date(2018, 2, 12),
  new Date(2016, 0, 10),
  new Date(2016, 0, 9)
];
minDate(array); // 2016-01-08T22:00:00.000Z
```
