### tomorrow

返回明天的日期字串

```js
const tomorrow = (long = false) => {
  let t = new Date();
  t.setDate(t.getDate() + 1);
  const ret = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(
    t.getDate()
  ).padStart(2, '0')}`;
  return !long ? ret : `${ret}T00:00:00`;
};
```

```js
tomorrow(); // 2017-12-27 (if current date is 2017-12-26)
tomorrow(true); // 2017-12-27T00:00:00 (if current date is 2017-12-26)
```
