### filterNonUnique

过滤掉数组中存在多个值的元素

比较 `arr.indexOf(i) === arr.lastIndexOf(i)` 来查看数组中是否有多个值 `i`

```js
const filterNonUnique = arr => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i));
```

```js
filterNonUnique([1, 2, 2, 3, 4, 4, 5]); // [1, 3, 5]
```
