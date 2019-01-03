### createElement

从一个字串创建一个元素对象（不将其插入文档中）

若给定的字串包含有多个元素，只返回第一个

使用 `document.createElement()` 创建一个新的元素

将它的 `innerHTML` 设置成提供的参数字符串

返回 `ParentNode.firstElementChild` 

```js
const createElement = str => {
  const el = document.createElement('div');
  el.innerHTML = str;
  return el.firstElementChild;
};
```

```js
const el = createElement(
  `<div class="container">
    <p>Hello!</p>
  </div>`
);
console.log(el.className); // 'container'
```
