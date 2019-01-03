### gcd

计算几个数的最大公约数（可以传入数字和数组）

内部的 `_gcd` 函数用于迭代

```js
const gcd = (...arr) => {
  // y=0 就返回 x; 否则返回 x/y 的余数
  const _gcd = (x, y) => (!y ? x : gcd(y, x % y));
  return [...arr].reduce((a, b) => _gcd(a, b));
};
```

```js
gcd(8, 36); // 4
gcd(...[12, 8, 32]); // 4
```
