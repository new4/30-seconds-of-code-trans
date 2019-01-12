### spreadOver

采用可变参数函数并返回一个闭包，该闭包接受一个参数数组以映射到函数的输入

```js
const spreadOver = fn => argsArr => fn(...argsArr);
```

```js
const arrayMax = spreadOver(Math.max);
arrayMax([1, 2, 3]); // 3
```
