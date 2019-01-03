### dig

返回给定键在嵌套 `JSON` 对象中对应的值

使用 `in` 查看 `obj` 中是否存在 `target`

找到了就直接返回 `obj[target]`

否则 `Object.values(obj)` 和 `Array.prototype.reduce()` 来递归地调用 `dig` 方法直到第一对符合要求的键值对被发现

```js
const dig = (obj, target) =>
  target in obj
    ? obj[target]
    : Object.values(obj).reduce((acc, val) => {
      if (acc !== undefined) return acc;
      if (typeof val === 'object') return dig(val, target);
    }, undefined);
```

```js
const data = {
  level1: {
    level2: {
      level3: 'some data'
    }
  }
};
dig(data, 'level3'); // 'some data'
dig(data, 'level4'); // undefined
```
