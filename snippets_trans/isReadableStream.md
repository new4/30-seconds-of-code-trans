### isReadableStream

是否是可读流

```js
const isReadableStream = val =>
  val !== null &&
  typeof val === 'object' &&
  typeof val.pipe === 'function' &&
  typeof val._read === 'function' &&
  typeof val._readableState === 'object';
```

```js
const fs = require('fs');
isReadableStream(fs.createReadStream('test.txt')); // true
```
