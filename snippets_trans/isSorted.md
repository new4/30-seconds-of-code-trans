### isSorted

升序返回 `1`, 降序返回 `-1`, 无序返回 `0`

```js
const isSorted = arr => {
  let direction = -(arr[0] - arr[1]); // 先计算首两位的方向
  for (let [i, val] of arr.entries()) {
    direction = !direction ? -(arr[i - 1] - arr[i]) : direction;
    if (i === arr.length - 1) return !direction ? 0 : direction;
    else if ((val - arr[i + 1]) * direction > 0) return 0;
  }
};
```

```js
isSorted([0, 1, 2, 2]); // 1
isSorted([4, 3, 2]); // -1
isSorted([4, 3, 5]); // 0
```
