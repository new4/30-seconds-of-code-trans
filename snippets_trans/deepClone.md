### deepClone

深度克隆一个对象

使用迭代

使用 `Object.assign()` 和一个空对象(`{}`) 创建一个浅复制

使用 `Object.keys()` 和 `Array.prototype.forEach()` 检查哪些键值对需要进行深度克隆

```js
const deepClone = obj => {
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  return Array.isArray(obj) ? (clone.length = obj.length) && Array.from(clone) : clone;
};
```

```js
const a = { foo: 'bar', obj: { a: 1, b: 2 } };
const b = deepClone(a); // a !== b, a.obj !== b.obj
```
