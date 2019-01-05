### nest

给定一个扁平的对象数组，里面的所有的对象都是有从属关系的，找出这种关系并构建嵌套对象

使用迭代

从根开始，一层层过滤下去

```js
const nest = (items, id = null, link = 'parent_id') =>
  items
    .filter(item => item[link] === id) // 找到根
    .map(item => ({ ...item, children: nest(items, item.id) }));
```

```js
// One top level comment
const comments = [
  { id: 1, parent_id: null },
  { id: 2, parent_id: 1 },
  { id: 3, parent_id: 1 },
  { id: 4, parent_id: 2 },
  { id: 5, parent_id: 4 }
];
const nestedComments = nest(comments); // [{ id: 1, parent_id: null, children: [...] }]
```
