### isWritableStream

是否是可写流

```js
const isWritableStream = val =>
  val !== null &&
  typeof val === 'object' &&
  typeof val.pipe === 'function' &&
  typeof val._write === 'function' &&
  typeof val._writableState === 'object';
```

```js
const fs = require('fs');
isWritableStream(fs.createWriteStream('test.txt')); // true
```
