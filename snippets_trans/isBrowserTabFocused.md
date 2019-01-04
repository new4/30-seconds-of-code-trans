### isBrowserTabFocused

Returns `true` if the browser tab of the page is focused, `false` otherwise.

检查当前页面是否是聚焦的

使用 `Document.hidden` 属性, [Page Visibility API](https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API)

```js
const isBrowserTabFocused = () => !document.hidden;
```

```js
isBrowserTabFocused(); // true
```
