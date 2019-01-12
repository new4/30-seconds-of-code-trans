### readFileLines

返回文件内容按行划分的数组

使用 `readFileSync` 创建 `Buffer`

使用 `toString(encoding)` 将 `Buffer` 转成字串

```js
const fs = require('fs');
const readFileLines = filename =>
  fs
    .readFileSync(filename)
    .toString('UTF8')
    .split('\n');
```

```js
/*
contents of test.txt :
  line1
  line2
  line3
  ___________________________
*/
let arr = readFileLines('test.txt');
console.log(arr); // ['line1', 'line2', 'line3']
```
