### triggerEvent

在给定元素上触发特定事件，可以传递数据

使用 [`new CustomEvent()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent)

使用 [`el.dispatchEvent()`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/dispatchEvent)

```js
const triggerEvent = (el, eventType, detail) =>
  el.dispatchEvent(new CustomEvent(eventType, { detail }));
```

```js
triggerEvent(document.getElementById('myId'), 'click');
triggerEvent(document.getElementById('myId'), 'click', { username: 'bob' });
```
