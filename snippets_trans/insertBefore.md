### insertBefore

在指定元素尾前面插入一个 HTML 字串

使用 `el.insertAdjacentHTML()`

```js
const insertBefore = (el, htmlString) => el.insertAdjacentHTML('beforebegin', htmlString);
```

```js
insertBefore(document.getElementById('myId'), '<p>before</p>'); // <p>before</p> <div id="myId">...</div>
```
