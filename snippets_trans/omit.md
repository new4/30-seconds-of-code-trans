### omit

返回除指定属性之外的属性组成的对象

```js
const omit = (obj, arr) =>
  Object.keys(obj)
    .filter(k => !arr.includes(k)) // 过滤出不在 arr 中列出的属性
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {}); // 利用这些属性创建个新对象
```

```js
omit({ a: 1, b: '2', c: 3 }, ['b']); // { 'a': 1, 'c': 3 }
```
