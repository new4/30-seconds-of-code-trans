### cloneRegExp

克隆一个正则表达式

使用 `new RegExp()`, `RegExp.source` 和 `RegExp.flags` 来克隆

```js
const cloneRegExp = regExp => new RegExp(regExp.source, regExp.flags);
```

```js
const regExp = /lorem ipsum/gi;
const regExp2 = cloneRegExp(regExp); // /lorem ipsum/gi
```
