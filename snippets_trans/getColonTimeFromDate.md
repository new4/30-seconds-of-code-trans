### getColonTimeFromDate

返回 `HH:MM:SS` 格式表示的 `Date` 对象

```js
const getColonTimeFromDate = date => date.toTimeString().slice(0, 8);
```

```js
getColonTimeFromDate(new Date()); // "08:38:00"
```
