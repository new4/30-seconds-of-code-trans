### isBrowser

检测当前运行环境是否是浏览器，可以保证 `Node` 环境代码不会跑出错误

检查全局的 `window` 和 `document`

使用 `typeof` 避免抛出 `ReferenceError`.

```js
const isBrowser = () => ![typeof window, typeof document].includes('undefined');
```

```js
isBrowser(); // true (browser)
isBrowser(); // false (Node)
```
