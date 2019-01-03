### httpsRedirect

若当前页面是 `HTTP` 的，将其重定向到 `HTTPS`，同时保证点击返回按钮是不能回到 `HTTP` 的页面的

使用 `location.protocol` 获取当前正在使用的协议

使用 `location.replace()` 替换

```js
const httpsRedirect = () => {
  if (location.protocol !== 'https:') location.replace('https://' + location.href.split('//')[1]);
};
```

```js
httpsRedirect(); // If you are on http://mydomain.com, you are redirected to https://mydomain.com
```
