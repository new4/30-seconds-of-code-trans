### curry

柯里化函数

使用递归

若传入了足够的参数 `args`，调用传入的函数 `fn`; 否则返回需要剩余参数的柯里化的函数

若想要柯里化一个可以传入茫茫多参数的函数（如，`Math.min()`），可以选择传入参数个数给 `arity`

`fn.length` 指函数参数个数

```js
const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
```

```js
curry(Math.pow)(2)(10); // 1024
curry(Math.min, 3)(10)(50)(2); // 2
```
