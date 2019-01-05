### offset

移动数组首部指定偏移量 `offset` 内的元素到尾部（`offset` 可以设置为负值，将尾部元素移动到数组首部）

```js
const offset = (arr, offset) => [...arr.slice(offset), ...arr.slice(0, offset)];
```

```js
offset([1, 2, 3, 4, 5], 2); // [3, 4, 5, 1, 2]
offset([1, 2, 3, 4, 5], -2); // [4, 5, 1, 2, 3]
```
