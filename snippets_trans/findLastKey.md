### findLastKey

返回使得函数返回真值的最后一个元素的键

```js
const findLastKey = (obj, fn) =>
  Object.keys(obj)
    .reverse()
    .find(key => fn(obj[key], key, obj));
```

```js
findLastKey(
  {
    barney: { age: 36, active: true },
    fred: { age: 40, active: false },
    pebbles: { age: 1, active: true }
  },
  o => o['active']
); // 'pebbles'
```
