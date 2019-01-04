### isValidJSON

检查传入的字串是否是 `JSON` 格式的字串

使用 `JSON.parse()` 和一个 `try... catch` 块

```js
const isValidJSON = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
```

```js
isValidJSON('{"name":"Adam","age":20}'); // true
isValidJSON('{"name":"Adam",age:"20"}'); // false
isValidJSON(null); // true
```
