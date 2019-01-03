### hasFlags

检查当前进程参数是否包含指定的标志

使用 `Array.prototype.every()` 和 `Array.prototype.includes()` 检查 `process.argv` 

```js
const hasFlags = (...flags) =>
  flags.every(flag => process.argv.includes(/^-{1,2}/.test(flag) ? flag : '--' + flag));
```

```js
// node myScript.js -s --test --cool=true
hasFlags('-s'); // true
hasFlags('--test', 'cool=true', '-s'); // true
hasFlags('special'); // false
```
