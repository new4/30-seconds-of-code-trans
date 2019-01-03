### hasClass

指定元素是否含有类 `className`

使用 `element.classList.contains()` （IE9不支持）

```js
const hasClass = (el, className) => el.classList.contains(className);
```

```js
hasClass(document.querySelector('p.special'), 'special'); // true
```
