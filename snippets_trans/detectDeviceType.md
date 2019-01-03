### detectDeviceType

检测网站是在移动设备/桌面设备上打开的

使用正则检测 `navigator.userAgent` 属性

```js
const detectDeviceType = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop';
```

```js
detectDeviceType(); // "Mobile" or "Desktop"
```
