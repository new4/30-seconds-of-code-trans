### isAnagram

检测一个字串是否是另一个的异位构成字串（大小写不敏感，忽略空格，标点和特殊字符）

```js
const isAnagram = (str1, str2) => {
  const normalize = str =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '') // 去掉非字母数字的字符
      .split('')
      .sort()
      .join('');
  return normalize(str1) === normalize(str2);
};
```

```js
isAnagram('iceman', 'cinema'); // true
```
