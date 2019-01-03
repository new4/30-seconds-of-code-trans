### elementContains

若父元素包含子元素，返回 `true`；否则返回 `false`

使用 [`Node.contains()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/contains)

`node.contains(otherNode)` - 如果 `otherNode` 是 `node` 的后代节点或是 `node` **节点本身** 则返回 `true`, 否则返回 `false`

```js
const elementContains = (parent, child) => parent !== child && parent.contains(child);
```

```js
elementContains(document.querySelector('head'), document.querySelector('title')); // true
elementContains(document.querySelector('body'), document.querySelector('body')); // false
```
