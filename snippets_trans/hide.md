### hide

隐藏指定的所有元素

```js
const hide = (...el) => [...el].forEach(e => (e.style.display = 'none'));
```

```js
hide(document.querySelectorAll('img')); // Hides all <img> elements on the page
```
