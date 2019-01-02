### attempt

使用给定的参数去**尝试**调用一个函数，返回执行结果或者捕获的错误对象。

内部使用一个 `try... catch` 块。

```js
const attempt = (fn, ...args) => {
  try {
    return fn(...args);
  } catch (e) {
    return e instanceof Error ? e : new Error(e);
  }
};
```

```js
var elements = attempt(function(selector) {
  return document.querySelectorAll(selector);
}, '>_>');
if (elements instanceof Error) elements = []; // elements = []
```
