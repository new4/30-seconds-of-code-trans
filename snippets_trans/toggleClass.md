### toggleClass

toggle 元素的 class

使用 [`element.classList.toggle()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList)

```js
const toggleClass = (el, className) => el.classList.toggle(className);
```

```js
toggleClass(document.querySelector('p.special'), 'special'); // The paragraph will not have the 'special' class anymore
```
