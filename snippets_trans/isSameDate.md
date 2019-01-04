### isSameDate

两个日期是否相等

使用 `Date.prototype.toISOString()`

```js
const isSameDate = (dateA, dateB) => dateA.toISOString() === dateB.toISOString();
```

```js
isSameDate(new Date(2010, 10, 20), new Date(2010, 10, 20)); // true
```
