### isPlainObject

是否是 `plain object`

```js
const isPlainObject = val => !!val && typeof val === 'object' && val.constructor === Object;
```

```js
isPlainObject({ a: 1 }); // true
isPlainObject(new Map()); // false
```
