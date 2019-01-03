### escapeRegExp

将一个字符串转换成可以用在正则表达式中的样式

使用 `String.prototype.replace()`

```js
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
```

```js
escapeRegExp('(test)'); // \\(test\\)
```
