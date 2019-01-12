### smoothScroll

将元素平滑地滚动到可视区域

使用 `.scrollIntoView` 方法

传入 `{ behavior: 'smooth' }`

```js
const smoothScroll = element =>
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  });
```

```js
smoothScroll('#fooBar'); // scrolls smoothly to the element with the id fooBar
smoothScroll('.fooBar'); // scrolls smoothly to the first element with a class of fooBar
```
