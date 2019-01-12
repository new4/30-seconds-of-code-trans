### show

显示所有指定的元素

```js
const show = (...el) => [...el].forEach(e => (e.style.display = ''));
```

```js
show(...document.querySelectorAll('img')); // Shows all <img> elements on the page
```
