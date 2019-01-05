### powerset

返回数组的幂集，即原集合中所有的子集（包括全集和空集）构成的集族

```js
const powerset = arr => arr.reduce((a, v) => a.concat(a.map(r => [v].concat(r))), [[]]);
```

```js
powerset([1, 2]); // [[], [1], [2], [2, 1]]
```
