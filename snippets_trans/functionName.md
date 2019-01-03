### functionName

打印出函数的名字

使用 `console.debug()` 和 `name` 属性

`console.debug` 是 `console.log` 的别名

```js
const functionName = fn => (console.debug(fn.name), fn);
```

```js
functionName(Math.max); // max (logged in debug channel of console)
```
