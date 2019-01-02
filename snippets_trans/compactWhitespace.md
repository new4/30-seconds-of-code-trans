### compactWhitespace

返回一个去除了多余空白字符的字符串

使用 `String.prototype.replace()` 和一个正则表达式替换出现 2 次及以上空白字符为 1 个空白字符

```js
const compactWhitespace = str => str.replace(/\s{2,}/g, ' ');
```

```js
compactWhitespace('Lorem    Ipsum'); // 'Lorem Ipsum'
compactWhitespace('Lorem \n Ipsum'); // 'Lorem Ipsum'
```
