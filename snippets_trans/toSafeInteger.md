### toSafeInteger

将数字转化成安全的整数

`Number.MAX_SAFE_INTEGER`

`Number.MIN_SAFE_INTEGER`

```js
const toSafeInteger = num =>
  Math.round(Math.max(Math.min(num, Number.MAX_SAFE_INTEGER), Number.MIN_SAFE_INTEGER));
```

```js
toSafeInteger('3.2'); // 3
toSafeInteger(Infinity); // 9007199254740991
```
