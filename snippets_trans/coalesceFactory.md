### coalesceFactory

返回一个自定义函数，该函数返回第一个使得验证函数返回真值的参数

使用 `Array.prototype.find()` 

```js
const coalesceFactory = valid => (...args) => args.find(valid);
```

```js
const customCoalesce = coalesceFactory(_ => ![null, undefined, '', NaN].includes(_));
customCoalesce(undefined, null, NaN, '', 'Waldo'); // "Waldo"
```
