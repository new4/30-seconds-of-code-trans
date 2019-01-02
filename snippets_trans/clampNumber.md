### clampNumber

若 `num` 在区间 `a` 和 `b` 内，返回 `num`; 否则返回较近的区间边界值

```js
const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
```

```js
clampNumber(2, 3, 5); // 3
clampNumber(1, -1, -5); // -1
```
