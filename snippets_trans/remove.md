### remove

根据函数移除掉数组中对应的元素

```js
const remove = (arr, func) =>
  Array.isArray(arr)
    ? arr.filter(func).reduce((acc, val) => {
      arr.splice(arr.indexOf(val), 1);
      return acc.concat(val);
    }, [])
    : [];
```

```js
remove([1, 2, 3, 4], n => n % 2 === 0); // [2, 4]
```
