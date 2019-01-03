### compose

从右到左组合函数功能

使用 `Array.prototype.reduce()`

最后（右）的函数可以接受一或多个参数；剩下的函数则是一元的

```js
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
```

```js
const add5 = x => x + 5;
const multiply = (x, y) => x * y;
const multiplyAndAdd5 = compose(
  add5,
  multiply
);
multiplyAndAdd5(5, 2); // 15
```
