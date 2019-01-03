### digitize

将一个数转化成单个数字组成的数组

先转成字符串再用扩展字符串分成数组，随后将每一个字符转成数字

```js
const digitize = n => [...`${n}`].map(i => parseInt(i));
```

```js
digitize(123); // [1, 2, 3]
```
