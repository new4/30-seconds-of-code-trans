### delay

在等待了 `wait` 毫秒之后调用函数

`setTimeout()` 第三个参数传入供 `fn` 调用的函数

```js
const delay = (fn, wait, ...args) => setTimeout(fn, wait, ...args);
```

```js
delay(
  function(text) {
    console.log(text);
  },
  1000,
  'later'
); // Logs 'later' after one second.
```
