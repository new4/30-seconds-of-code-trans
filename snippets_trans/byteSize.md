### byteSize

返回字符串的字节长度

将给定的字符串转换成 [`Blob` 对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 并返回它的 `size` 属性

```js
const byteSize = str => new Blob([str]).size;
```

```js
byteSize('😀'); // 4
byteSize('Hello World'); // 11
```
