### sampleSize

数组采样，采样数目 `n`

先用 [Fisher-Yates algorithm](https://github.com/30-seconds/30-seconds-of-code#shuffle) 算法洗牌，随后返回前 `n` 个值

```js
const sampleSize = ([...arr], n = 1) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr.slice(0, n);
};
```

```js
sampleSize([1, 2, 3], 2); // [3,1]
sampleSize([1, 2, 3], 4); // [2,3,1]
```
