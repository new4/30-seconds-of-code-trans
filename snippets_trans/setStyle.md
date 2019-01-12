### setStyle

设置 `CSS` 样式

```js
const setStyle = (el, ruleName, val) => (el.style[ruleName] = val);
```

```js
setStyle(document.querySelector('p'), 'font-size', '20px'); // The first <p> element on the page will have a font-size of 20px
```
