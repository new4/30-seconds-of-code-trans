### arrayToHtmlList

将给定的数组元素转换成 `<li>` 标签元素，并将结果加到指定了 `id` 的元素内部去

使用 `Array.prototype.map()`, `document.querySelector()`, 和一个匿名闭包函数实现

```js
const arrayToHtmlList = (arr, listID) =>
  (el => (
    (el = document.querySelector('#' + listID)),
    (el.innerHTML += arr.map(item => `<li>${item}</li>`).join(''))
  ))();
```

```js
arrayToHtmlList(['item 1', 'item 2'], 'myListID');
```
