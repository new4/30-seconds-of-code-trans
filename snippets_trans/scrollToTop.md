### scrollToTop

平稳地滚动到页面的顶部

使用 `document.documentElement.scrollTop` 或 `document.body.scrollTop` 获取到页面顶部的距离

使用 `window.requestAnimationFrame()` 执行滚动动画

```js
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};
```

```js
scrollToTop();
```
