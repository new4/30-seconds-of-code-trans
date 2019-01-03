### counter

创建一个在 `selector` 对应元素内部进行计数的计数器。计数范围为 `[start, end]`, 步距为 `step`, 计数时间 `duration`。

支持反向计数（累减）

使用 `setInterval()`, `Math.abs()` 和 `Math.floor()` 计算更新间隔

使用 `document.querySelector().innerHTML` 更新元素内部数值

步距 `step` 默认为 `1`.

计数时间 `duration` 默认为 `2000ms`

```js
const counter = (selector, start, end, step = 1, duration = 2000) => {
  let current = start,
    _step = (end - start) * step < 0 ? -step : step,
    timer = setInterval(() => {
      current += _step;
      document.querySelector(selector).innerHTML = current;
      if (current >= end) document.querySelector(selector).innerHTML = end;
      if (current >= end) clearInterval(timer);
    }, Math.abs(Math.floor(duration / (end - start))));
  return timer;
};
```

```js
counter('#my-id', 1, 1000, 5, 2000); // Creates a 2-second timer for the element with id="my-id"
```
