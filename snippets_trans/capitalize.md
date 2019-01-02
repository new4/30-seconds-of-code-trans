### capitalize

将一个字符串的首字母转换成大写形式

使用解构方式分出字符串的首字母和剩余字母

```js
const capitalize = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''));
```

```js
capitalize('fooBar'); // 'FooBar'
capitalize('fooBar', true); // 'Foobar'
```
