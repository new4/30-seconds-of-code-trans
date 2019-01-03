### composeRight

从左到右组合函数功能

使用 `Array.prototype.reduce()`

最先（左）的函数可以接受一或多个参数；剩下的函数则是一元的

```js
const composeRight = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));
```

```js
const add = (x, y) => x + y;
const square = x => x * x;
const addAndSquare = composeRight(add, square);
addAndSquare(1, 2); // 9
```
