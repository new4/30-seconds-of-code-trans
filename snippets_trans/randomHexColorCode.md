### randomHexColorCode

随机生成一个十六进制表示的颜色字串

```js
const randomHexColorCode = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};
```

```js
randomHexColorCode(); // "#e34155"
```
