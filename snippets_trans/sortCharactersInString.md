### sortCharactersInString

排列字串中的字符

使用 `String.localeCompare()`

```js
const sortCharactersInString = str => [...str].sort((a, b) => a.localeCompare(b)).join('');
```

```js
sortCharactersInString('cabbage'); // 'aabbceg'
```
