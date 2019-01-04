### JSONToFile

将 `JSON` 对象写入文件

使用 `fs.writeFile()` 和 `JSON.stringify()`

```js
const fs = require('fs');
const JSONToFile = (obj, filename) =>
  fs.writeFile(`${filename}.json`, JSON.stringify(obj, null, 2));
```

```js
JSONToFile({ test: 'is passed' }, 'testJsonFile'); // writes the object to 'testJsonFile.json'
```
