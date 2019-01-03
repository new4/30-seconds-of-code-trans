### findKey

返回第一个满足测试函数的值的键名，没有找到的话就返回 `undefined`

使用 `Object.keys(obj)` 和 `Array.prototype.find()` 

```js
const findKey = (obj, fn) => Object.keys(obj).find(key => fn(obj[key], key, obj));
```

```js
findKey(
  {
    barney: { age: 36, active: true },
    fred: { age: 40, active: false },
    pebbles: { age: 1, active: true }
  },
  o => o['active']
); // 'barney'
```
