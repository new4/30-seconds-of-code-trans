### randomIntegerInRange

生成 `[min, max]` 区间内的随机**整数**

```js
const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
```

```js
randomIntegerInRange(0, 5); // 2
```
