### toDecimalMark

使用 `toLocaleString()` 转化浮点格式为 [Decimal mark](https://en.wikipedia.org/wiki/Decimal_mark) 形式. 

 ```js
const toDecimalMark = num => num.toLocaleString('en-US');
```

```js
toDecimalMark(12305030388.9087); // "12,305,030,388.909"
```
