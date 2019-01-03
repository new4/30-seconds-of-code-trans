### defaults

给对象中所有的 `undefined` 属性赋默认值

使用 `Object.assign()` 依据原来的 `obj`(保证键的顺序)创建一个新对象

使用 `Array.prototype.reverse()` 和扩展运算符 `...` 进行组合，左边优先所以 `reverse` 到最后

最后再用 `obj` 中的默认值进行覆盖

```js
const defaults = (obj, ...defs) => Object.assign({}, obj, ...defs.reverse(), obj);
```

```js
defaults({ a: 1 }, { b: 2 }, { b: 6 }, { a: 3 }); // { a: 1, b: 2 }
```
