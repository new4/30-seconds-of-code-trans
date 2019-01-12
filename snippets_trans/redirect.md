### redirect

重定向到指定的 `URL`

第二个参数模仿点击(`true`)或者是一个 `HTTP`重定向(`false`).

```js
const redirect = (url, asLink = true) =>
  asLink ? (window.location.href = url) : window.location.replace(url);
```

```js
redirect('https://google.com');
```
