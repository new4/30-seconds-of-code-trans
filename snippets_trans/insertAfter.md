### insertAfter

在指定元素后面插入一个 HTML 字串

使用 `el.insertAdjacentHTML()`

```js
const insertAfter = (el, htmlString) => el.insertAdjacentHTML('afterend', htmlString);
```

```js
insertAfter(document.getElementById('myId'), '<p>after</p>'); // <div id="myId">...</div> <p>after</p>
```
