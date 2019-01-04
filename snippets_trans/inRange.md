### inRange

检查给定的数字是否落在指定区间内

```js
const inRange = (n, start, end = null) => {
  if (end && start > end) [end, start] = [start, end]; // 调整区间范围
  return end == null ? n >= 0 && n < start : n >= start && n < end; // 未指定 end，区间就是 [0, start]
};
```

```js
inRange(3, 2, 5); // true
inRange(3, 4); // true
inRange(2, 3, 5); // false
inRange(3, 2); // false
```
