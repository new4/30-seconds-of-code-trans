### equals

深度比较

```js
const equals = (a, b) => {
  // 对于基本类型，直接使用全等符号 `===`
  if (a === b) return true;
  // 对于 `Date` 对象，使用 `Date.getTime()` 获得的值进行比较
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  // typeof null === 'object'
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
  if (a === null || a === undefined || b === null || b === undefined) return false;
  // 检查 prototype 属性是否相同
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  // 先看属性数目
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k])); // 进行迭代
};
```

```js
equals({ a: [2, { e: 3 }], b: [4], c: 'foo' }, { a: [2, { e: 3 }], b: [4], c: 'foo' }); // true
```
