### primes

根据埃拉托斯特尼筛法生成素数数组

```js
const primes = num => {
  let arr = Array.from({ length: num - 1 }).map((x, i) => i + 2), // 从 2 到当前 num 的数组
    sqroot = Math.floor(Math.sqrt(num)), // 遍历到 √num
    numsTillSqroot = Array.from({ length: sqroot - 1 }).map((x, i) => i + 2);
  numsTillSqroot.forEach(x => (arr = arr.filter(y => y % x !== 0 || y === x)));
  return arr;
};
```

```js
primes(10); // [2,3,5,7]
```
