### btoa

从一个字符串（其每个字符都被视作一字节二进制数据处理）创建一个 `Base64` 编码的 `ASCII` 字串，

用给定的字串创建一个 `Buffer`，指定编码为 `binary`，随后使用 `Buffer.toString('base64')` 解码。

```js
const btoa = str => Buffer.from(str, 'binary').toString('base64');
```

```js
btoa('foobar'); // 'Zm9vYmFy'
```
