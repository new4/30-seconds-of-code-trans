# 30-seconds-of-code-trans

闲暇阅读 [30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code) 里的代码。

## 🔌 adapter

<details>

<summary>展开</summary>

### ary

创建一个至多只接受 `n` 个参数的函数，它会弃掉多余的参数

使用 `Array.prototype.slice(0,n)` 和扩展运算符 `...` 来保证只接受至多 `n` 的参数

```js
const ary = (fn, n) => (...args) => fn(...args.slice(0, n));
```

```js
const firstTwoMax = ary(Math.max, 2);
[[2, 6, 'a'], [8, 4, 6], [10]].map(x => firstTwoMax(...x)); // [6, 8, 10]
```

### call

给定一个键名（在上下文中可以通过它找到一个方法）和一系列参数，在给定一个上下文时调用它们。组合模式中比较有用。

使用闭包

```js
const call = (key, ...args) => context => context[key](...args);
```

```js
Promise.resolve([1, 2, 3])
  .then(call('map', x => 2 * x))
  .then(console.log); // [ 2, 4, 6 ]
const map = call.bind(null, 'map');
Promise.resolve([1, 2, 3])
  .then(map(x => 2 * x))
  .then(console.log); // [ 2, 4, 6 ]
```

### collectInto

将接受数组参数的函数更改为接受变量的函数

```js
const collectInto = fn => (...args) => fn(args);
```

```js
const Pall = collectInto(Promise.all.bind(Promise));
let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
let p3 = new Promise(resolve => setTimeout(resolve, 2000, 3));
Pall(p1, p2, p3).then(console.log); // [1, 2, 3] (after about 2 seconds)
```

### flip

返回一个函数，该函数将第一个参数当做最后一个参数调用 `fn`

```js
const flip = fn => (first, ...rest) => fn(...rest, first);
```

```js
let a = { name: 'John Smith' };
let b = {};
const mergeFrom = flip(Object.assign);
let mergePerson = mergeFrom.bind(null, a);
mergePerson(b); // == b
b = {};
Object.assign(b, a); // == b
```

### over

根据一些函数创建一个新的函数，依次给原来的函数传入参数并返回结果数组

```js
const over = (...fns) => (...args) => fns.map(fn => fn.apply(null, args));
```

```js
const minMax = over(Math.min, Math.max);
minMax(1, 2, 3, 4, 5); // [1,5]
```

### overArgs

创建一个新的函数，各个参数有各自的执行函数来生成新的参数供 `fn` 调用

```js
const overArgs = (fn, transforms) => (...args) => fn(...args.map((val, i) => transforms[i](val)));
```

```js
const square = n => n * n;
const double = n => n * 2;
const fn = overArgs((x, y) => [x, y], [square, double]);
fn(9, 3); // [81, 6]
```

### pipeAsyncFunctions

为异步函数执行从左到右的函数组合

函数组合里的函数需要是一元的

```js
const pipeAsyncFunctions = (...fns) => arg => fns.reduce((p, f) => p.then(f), Promise.resolve(arg));
```

```js
const sum = pipeAsyncFunctions(
  x => x + 1,
  x => new Promise(resolve => setTimeout(() => resolve(x + 2), 1000)),
  x => x + 3,
  async x => (await x) + 4
);
(async() => {
  console.log(await sum(5)); // 15 (after one second)
})();
```

### pipeFunctions

执行从左到右的函数组合

第一个函数可以接收多个参数，剩余的须是一元的

```js
const pipeFunctions = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));
```

```js
const add5 = x => x + 5;
const multiply = (x, y) => x * y;
const multiplyAndAdd5 = pipeFunctions(multiply, add5);
multiplyAndAdd5(5, 2); // 15
```

### promisify

将异步函数转换成返回 `Promise` 的函数

*在 Node 8+, 可以使用 [`util.promisify`](https://nodejs.org/api/util.html#util_util_promisify_original)*

```js
const promisify = func => (...args) =>
  new Promise((resolve, reject) =>
    func(...args, (err, result) => (err ? reject(err) : resolve(result)))
  );
```

```js
const delay = promisify((d, cb) => setTimeout(cb, d));
delay(2000).then(() => console.log('Hi!')); // // Promise resolves after 2s
```

### rearg

重排调用参数

```js
const rearg = (fn, indexes) => (...args) => fn(...indexes.map(i => args[i]));
```

```js
var rearged = rearg(
  function(a, b, c) {
    return [a, b, c];
  },
  [2, 0, 1]
);
rearged('b', 'c', 'a'); // ['a', 'b', 'c']
```

### spreadOver

采用可变参数函数并返回一个闭包，该闭包接受一个参数数组以映射到函数的输入

```js
const spreadOver = fn => argsArr => fn(...argsArr);
```

```js
const arrayMax = spreadOver(Math.max);
arrayMax([1, 2, 3]); // 3
```

### unary

只允许传入一个参数

```js
const unary = fn => val => fn(val);
```

```js
['6', '8', '10'].map(unary(parseInt)); // [6, 8, 10]
```

</details>

## 📚 array

<details>

<summary>展开</summary>

### all

数组中的每个值都能让 `fn` 函数返回 `true` 的时候，`all` 返回 `true`，否则返回 `false`。

内部使用 `Array.prototype.every()` 来进行检查，`fn` 默认是 `Bollean` 方法。

```js
const all = (arr, fn = Boolean) => arr.every(fn);
```

```js
all([4, 2, 3], x => x > 1); // true
all([1, 2, 3]); // true
```

### allEqual

检查数组中的元素是否全部相等

内部使用 `Array.prototype.every()` 来检查所有的元素是否和数组的第一个元素 `arr[0]` 相等即可

```js
const allEqual = arr => arr.every(val => val === arr[0]);
```

```js
allEqual([1, 2, 3, 4, 5, 6]); // false
allEqual([1, 1, 1, 1]); // true
```

### any

数组中至少有一个值能让 `fn` 函数返回 `true` 的时候，`any` 返回 `true`，否则返回 `false`。

内部使用 `Array.prototype.some()` 来进行检查，`fn` 默认是 `Bollean` 方法。

```js
const any = (arr, fn = Boolean) => arr.some(fn);
```

```js
any([0, 1, 2, 0], x => x >= 2); // true
any([0, 0, 1, 0]); // true
```

### arrayToCSV

将一个二维数组转换成用逗号分隔的字符串。

使用 `Array.prototype.map()` 和 `Array.prototype.join(delimiter)` 来转换一维数组（行）

使用 `Array.prototype.join('\n')` 来将行合并成一个换行的字符串

分隔符参数 `delimiter` 默认为 `,`

```js
const arrayToCSV = (arr, delimiter = ',') =>
  arr.map(v => v.map(x => `"${x}"`).join(delimiter)).join('\n');
```

```js
arrayToCSV([['a', 'b'], ['c', 'd']]); // '"a","b"\n"c","d"'
arrayToCSV([['a', 'b'], ['c', 'd']], ';'); // '"a";"b"\n"c";"d"'
```

### bifurcate

将数据分成两组。若一个元素在 `filter` 中对应真值，那该元素位于第一组，否则位于第二组。

使用 `Array.prototype.reduce()` 和 `Array.prototype.push()` 来处理

```js
const bifurcate = (arr, filter) =>
  arr.reduce((acc, val, i) => (acc[filter[i] ? 0 : 1].push(val), acc), [[], []]);
```

```js
bifurcate(['beep', 'boop', 'foo', 'bar'], [true, true, false, true]); // [ ['beep', 'boop', 'bar'], ['foo'] ]
```

### bifurcateBy

将数据分成两组。若一个元素执行 `fn` 规则后返回真值，那该元素位于第一组，否则位于第二组。

使用 `Array.prototype.reduce()` 和 `Array.prototype.push()` 来处理

```js
const bifurcateBy = (arr, fn) =>
  arr.reduce((acc, val, i) => (acc[fn(val, i) ? 0 : 1].push(val), acc), [[], []]);
```

```js
bifurcateBy(['beep', 'boop', 'foo', 'bar'], x => x[0] === 'b'); // [ ['beep', 'boop', 'bar'], ['foo'] ]
```

### chunk

将数组分割成指定大小的多个小数组

使用 `Array.from()` 创建一个符合最终大小的数组，使用 `Array.prototype.slice()` 获取 `size` 大小的组

```js
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
```

```js
chunk([1, 2, 3, 4, 5], 2); // [[1,2],[3,4],[5]]
```

### compact

移除数组中的假值

使用 `Array.prototype.filter()` 过滤掉数组中的假值 (`false`, `null`, `0`, `""`, `undefined`, and `NaN`).

```js
const compact = arr => arr.filter(Boolean);
```

```js
compact([0, 1, false, 2, '', 3, 'a', 'e' * 23, NaN, 's', 34]); // [ 1, 2, 3, 'a', 's', 34 ]
```

### countBy

使用指定的函数对数组元素进行分组，返回每组数据的数目

使用 `Array.prototype.map()` 将数组的元素映射为函数参数或者应用元素属性

使用 `Array.prototype.reduce()` 创建一个对象，它的键值由映射结果创建

```js
const countBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
```

```js
countBy([6.1, 4.2, 6.3], Math.floor); // {4: 1, 6: 2}
countBy(['one', 'two', 'three'], 'length'); // {3: 2, 5: 1}
```

### countOccurrences

统计一个值在数组中出现的次数

使用 `Array.prototype.reduce()` 来递增计数次数

```js
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
```

```js
countOccurrences([1, 1, 2, 1, 2, 3], 1); // 3
```

### deepFlatten

深度展平一个数组

使用迭代

使用扩展操作符(`...`) 来展平一个数组

```js
const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)));
```

```js
deepFlatten([1, [2], [[3], 4], 5]); // [1,2,3,4,5]
```

### difference

返回数组 `a` 中有而 `b` 中没有的值

用 `b` 建立一个 `Set`，然后使用过滤函数 `Array.prototype.filter()` 过滤数组 `a`

```js
const difference = (a, b) => {
  const s = new Set(b);
  return a.filter(x => !s.has(x));
};
```

```js
difference([1, 2, 3], [1, 2, 4]); // [3]
```

### differenceBy

返回数组 `a` 中元素的 `fn` 函数调用结果和 `b` 中元素的 `fn` 函数调用结果不一致的元素

`Set` 使用 `fn` 运行结果进行初始化

```js
const differenceBy = (a, b, fn) => {
  const s = new Set(b.map(fn));
  return a.filter(x => !s.has(fn(x)));
};
```

```js
differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [1.2]
differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], v => v.x); // [ { x: 2 } ]
```

### differenceWith

过滤出数组中对于比较函数不返回 `true` 的值

使用 `Array.prototype.filter()` 和 `Array.prototype.findIndex()`

```js
const differenceWith = (arr, val, comp) => arr.filter(a => val.findIndex(b => comp(a, b)) === -1);
```

```js
differenceWith([1, 1.2, 1.5, 3, 0], [1.9, 3, 0], (a, b) => Math.round(a) === Math.round(b)); // [1, 1.2]
```

### drop

将数组移除左边 `n` 个元素并返回

```js
const drop = (arr, n = 1) => arr.slice(n);
```

```js
drop([1, 2, 3]); // [2,3]
drop([1, 2, 3], 2); // [3]
drop([1, 2, 3], 42); // []
```

### dropRight

将数组移除右边边 `n` 个元素并返回

```js
const dropRight = (arr, n = 1) => arr.slice(0, -n);
```

```js
dropRight([1, 2, 3]); // [1,2]
dropRight([1, 2, 3], 2); // [1]
dropRight([1, 2, 3], 42); // []
```

### dropRightWhile

从右边开始移除数组元素直到改元素使得函数 `func` 返回 `true`

```js
const dropRightWhile = (arr, func) => {
  while (arr.length > 0 && !func(arr[arr.length - 1])) arr = arr.slice(0, -1);
  return arr;
};
```

```js
dropRightWhile([1, 2, 3, 4], n => n < 3); // [1, 2]
```

### dropWhile

从左边开始移除数组元素直到改元素使得函数 `func` 返回 `true`

```js
const dropWhile = (arr, func) => {
  while (arr.length > 0 && !func(arr[0])) arr = arr.slice(1);
  return arr;
};
```

```js
dropWhile([1, 2, 3, 4], n => n >= 3); // [3,4]
```

### everyNth

返回步距 `nth` 的采样数据

使用 `Array.prototype.filter()` 检测 `index`

```js
const everyNth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
```

```js
everyNth([1, 2, 3, 4, 5, 6], 2); // [ 2, 4, 6 ]
```

### filterFalsy

过滤掉数组中的非真值

```js
const filterFalsy = arr => arr.filter(Boolean);
```

```js
filterFalsy(['', true, {}, false, 'sample', 1, 0]); // [true, {}, 'sample', 1]
```

### filterNonUnique

过滤掉数组中存在多个值的元素

比较 `arr.indexOf(i) === arr.lastIndexOf(i)` 来查看数组中是否有多个值 `i`

```js
const filterNonUnique = arr => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i));
```

```js
filterNonUnique([1, 2, 2, 3, 4, 4, 5]); // [1, 3, 5]
```

### filterNonUniqueBy

过滤掉基于某个比较函数的返回值是否重复的数组元素

```js
const filterNonUniqueBy = (arr, fn) =>
  arr.filter((v, i) => arr.every((x, j) => (i === j) === fn(v, x, i, j)));
```

```js
filterNonUniqueBy(
  [
    { id: 0, value: 'a' },
    { id: 1, value: 'b' },
    { id: 2, value: 'c' },
    { id: 1, value: 'd' },
    { id: 0, value: 'e' }
  ],
  (a, b) => a.id == b.id
); // [ { id: 2, value: 'c' } ]
```

### findLast

返回使得函数返回真值的最后一个元素

```js
const findLast = (arr, fn) => arr.filter(fn).pop();
```

```js
findLast([1, 2, 3, 4], n => n % 2 === 1); // 3
```

### findLastIndex

返回使得函数返回真值的最后一个元素的下标

```js
const findLastIndex = (arr, fn) =>
  arr
    .map((val, i) => [i, val]) // 重新组织一下参数传进去
    .filter(([i, val]) => fn(val, i, arr))
    .pop()[0];
```

```js
findLastIndex([1, 2, 3, 4], n => n % 2 === 1); // 2 (index of the value 3)
```

### flatten

展平数组至指定深度

迭代

```js
const flatten = (arr, depth = 1) =>
  arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v), []);
```

```js
flatten([1, [2], 3, 4]); // [1, 2, 3, 4]
flatten([1, [2, [3, [4, 5], 6], 7], 8], 2); // [1, 2, 3, [4, 5], 6, 7, 8]
```

### forEachRight

从后向前依次传入数组元素作为函数参数

```js
const forEachRight = (arr, callback) =>
  arr
    .slice(0)
    .reverse()
    .forEach(callback);
```

```js
forEachRight([1, 2, 3, 4], val => console.log(val)); // '4', '3', '2', '1'
```

### groupBy

按照一定规则对数组元素分组，键值是指定函数执行的结果

```js
const groupBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i]);
    return acc;
  }, {});
```

```js
groupBy([6.1, 4.2, 6.3], Math.floor); // {4: [4.2], 6: [6.1, 6.3]}
groupBy(['one', 'two', 'three'], 'length'); // {3: ['one', 'two'], 5: ['three']}
```

### head

返回数组的第一个元素

```js
const head = arr => arr[0];
```

```js
head([1, 2, 3]); // 1
```

### indexOfAll

返回数组中所有 `val` 的下标

使用 `Array.prototype.reduce()`

```js
const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), []);
```

```js
indexOfAll([1, 2, 3, 1, 2, 3], 1); // [0,3]
indexOfAll([1, 2, 3], 4); // []
```

### initial

返回数组中除最后一个值的其它值

```js
const initial = arr => arr.slice(0, -1);
```

```js
initial([1, 2, 3]); // [1,2]
```

### initialize2DArray

用指定的 `width`, `height` 和 `val` 初始化一个二维数组

`IE` 不支持 `Array.prototype.fill`，此处有个 [polyfill](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)

```js
const initialize2DArray = (w, h, val = null) =>
  Array.from({ length: h }).map(() => Array.from({ length: w }).fill(val)); // IE 不支持 Array.prototype.fill
```

```js
initialize2DArray(2, 2, 0); // [[0,0], [0,0]]
```

### initializeArrayWithRange

使用指定范围 `start` 和 `end` 来初始化一个数组，还可以指定步距 `step`

```js
const initializeArrayWithRange = (end, start = 0, step = 1) =>
  Array.from({ length: Math.ceil((end - start + 1) / step) }, (v, i) => i * step + start);
```

```js
initializeArrayWithRange(5); // [0,1,2,3,4,5]
initializeArrayWithRange(7, 3); // [3,4,5,6,7]
initializeArrayWithRange(9, 0, 2); // [0,2,4,6,8]
```

### initializeArrayWithRangeRight

使用指定范围 `start` 和 `end` 来初始化（从右向左）一个数组，还可以指定步距 `step`

```js
const initializeArrayWithRangeRight = (end, start = 0, step = 1) =>
  Array.from({ length: Math.ceil((end + 1 - start) / step) }).map(
    (v, i, arr) => (arr.length - i - 1) * step + start
  );
```

```js
initializeArrayWithRangeRight(5); // [5,4,3,2,1,0]
initializeArrayWithRangeRight(7, 3); // [7,6,5,4,3]
initializeArrayWithRangeRight(9, 0, 2); // [8,6,4,2,0]
```

### initializeArrayWithValues

使用特定的值来初始化数组

```js
const initializeArrayWithValues = (n, val = 0) => Array(n).fill(val);
```

```js
initializeArrayWithValues(5, 2); // [2, 2, 2, 2, 2]
```

### initializeNDArray

使用指定值初始化 n 维数组（列）

使用递归

使用 `Array.prototype.map()` 生成每一行，然后该行的每个元素又递归调用初始化函数

```js
const initializeNDArray = (val, ...args) =>
  args.length === 0
    ? val
    : Array.from({ length: args[0] }).map(() => initializeNDArray(val, ...args.slice(1)));
```

```js
initializeNDArray(1, 3); // [1,1,1]
initializeNDArray(5, 2, 2, 2); // [[[5,5],[5,5]],[[5,5],[5,5]]]
```

### intersection

返回两个数组的交集

```js
const intersection = (a, b) => {
  const s = new Set(b);
  return a.filter(x => s.has(x));
};
```

```js
intersection([1, 2, 3], [4, 3, 2]); // [2, 3]
```

### intersectionBy

返回两个数组元素运行结果的交集

```js
const intersectionBy = (a, b, fn) => {
  const s = new Set(b.map(fn));
  return a.filter(x => s.has(fn(x)));
};
```

```js
intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [2.1]
```

### intersectionWith

按照一定规则的比较函数结果取交集，其实也算是过滤

```js
const intersectionWith = (a, b, comp) => a.filter(x => b.findIndex(y => comp(x, y)) !== -1);
```

```js
intersectionWith([1, 1.2, 1.5, 3, 0], [1.9, 3, 0, 3.9], (a, b) => Math.round(a) === Math.round(b)); // [1.5, 3, 0]
```

### isSorted

升序返回 `1`, 降序返回 `-1`, 无序返回 `0`

```js
const isSorted = arr => {
  let direction = -(arr[0] - arr[1]); // 先计算首两位的方向
  for (let [i, val] of arr.entries()) {
    direction = !direction ? -(arr[i - 1] - arr[i]) : direction;
    if (i === arr.length - 1) return !direction ? 0 : direction;
    else if ((val - arr[i + 1]) * direction > 0) return 0;
  }
};
```

```js
isSorted([0, 1, 2, 2]); // 1
isSorted([4, 3, 2]); // -1
isSorted([4, 3, 5]); // 0
```

### join

组合数组元素为分隔符拼接的字串

```js
const join = (arr, separator = ',', end = separator) =>
  arr.reduce(
    (acc, val, i) =>
      i === arr.length - 2
        ? acc + val + end
        : i === arr.length - 1
          ? acc + val
          : acc + val + separator,
    ''
  );
```

```js
join(['pen', 'pineapple', 'apple', 'pen'], ',', '&'); // "pen,pineapple,apple&pen"
join(['pen', 'pineapple', 'apple', 'pen'], ','); // "pen,pineapple,apple,pen"
join(['pen', 'pineapple', 'apple', 'pen']); // "pen,pineapple,apple,pen"
```

### JSONtoCSV

将对象数组转换成 CSV 字串，可以指定分隔符

```js
const JSONtoCSV = (arr, columns, delimiter = ',') =>
  [
    columns.join(delimiter),
    ...arr.map(obj =>
      columns.reduce(
        (acc, key) => `${acc}${!acc.length ? '' : delimiter}"${!obj[key] ? '' : obj[key]}"`,
        ''
      )
    )
  ].join('\n');
```

```js
JSONtoCSV([{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }], ['a', 'b']); // 'a,b\n"1","2"\n"3","4"\n"6",""\n"","7"'
JSONtoCSV([{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }], ['a', 'b'], ';'); // 'a;b\n"1";"2"\n"3";"4"\n"6";""\n"";"7"'
```

### last

返回数组的最后一个元素

```js
const last = arr => arr[arr.length - 1];
```

```js
last([1, 2, 3]); // 3
```

### longestItem

返回数组元素（须含有 `length` 属性）长度最长的那一个，如果有两个一样长的，返回第一个

```js
const longestItem = (...vals) => vals.reduce((a, x) => (x.length > a.length ? x : a));
```

```js
longestItem('this', 'is', 'a', 'testcase'); // 'testcase'
longestItem(...['a', 'ab', 'abc']); // 'abc'
longestItem(...['a', 'ab', 'abc'], 'abcd'); // 'abcd'
longestItem([1, 2, 3], [1, 2], [1, 2, 3, 4, 5]); // [1, 2, 3, 4, 5]
longestItem([1, 2, 3], 'foobar'); // 'foobar'
```

### mapObject

依据数组重新构造一个对象，新对象的键名为数组元素的值，键值为 `fn` 执行之后的返回值

```js
const mapObject = (arr, fn) =>
  (a => (
    (a = [arr, arr.map(fn)]), a[0].reduce((acc, val, ind) => ((acc[val] = a[1][ind]), acc), {})
  ))();
```

```js
const squareIt = arr => mapObject(arr, a => a * a);
squareIt([1, 2, 3]); // { 1: 1, 2: 4, 3: 9 }
```

### maxN

返回数组中最大的 `n` 个数

```js
const maxN = (arr, n = 1) => [...arr].sort((a, b) => b - a).slice(0, n);
```

```js
maxN([1, 2, 3]); // [3]
maxN([1, 2, 3], 2); // [3,2]
```

### minN

给定数组的最小的 `n` 个值

```js
const minN = (arr, n = 1) => [...arr].sort((a, b) => a - b).slice(0, n);
```
```js
minN([1, 2, 3]); // [1]
minN([1, 2, 3], 2); // [1,2]
```

### none

若预测函数返回 `false`, 则返回 `true`

```js
const none = (arr, fn = Boolean) => !arr.some(fn);
```

```js
none([0, 1, 3, 0], x => x == 2); // true
none([0, 0, 0]); // true
```

### nthElement

获取数组的第 `n` 处的元素

```js
const nthElement = (arr, n = 0) => (n === -1 ? arr.slice(n) : arr.slice(n, n + 1))[0];
```

```js
nthElement(['a', 'b', 'c'], 1); // 'b'
nthElement(['a', 'b', 'b'], -3); // 'a'
```

### offset

移动数组首部指定偏移量 `offset` 内的元素到尾部（`offset` 可以设置为负值，将尾部元素移动到数组首部）

```js
const offset = (arr, offset) => [...arr.slice(offset), ...arr.slice(0, offset)];
```

```js
offset([1, 2, 3, 4, 5], 2); // [3, 4, 5, 1, 2]
offset([1, 2, 3, 4, 5], -2); // [4, 5, 1, 2, 3]
```

### partition

根据分类函数来对数组元素分割成两部分

```js
const partition = (arr, fn) =>
  arr.reduce(
    (acc, val, i, arr) => {
      acc[fn(val, i, arr) ? 0 : 1].push(val);
      return acc;
    },
    [[], []]
  );
```

```js
const users = [{ user: 'barney', age: 36, active: false }, { user: 'fred', age: 40, active: true }];
partition(users, o => o.active); // [[{ 'user': 'fred',    'age': 40, 'active': true }],[{ 'user': 'barney',  'age': 36, 'active': false }]]
```

### permutations

⚠️ **WARNING**: 这个函数的复杂度是指数级增长的，太多数据（8~10）可能导致你的浏览器卡住

生成排列组合（有重复）

使用迭代

```js
const permutations = arr => {
  if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr;
  return arr.reduce(
    (acc, item, i) =>
      acc.concat(
        permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val])
      ),
    []
  );
};
```

```js
permutations([1, 33, 5]); // [ [ 1, 33, 5 ], [ 1, 5, 33 ], [ 33, 1, 5 ], [ 33, 5, 1 ], [ 5, 1, 33 ], [ 5, 33, 1 ] ]
```

### pull

将过滤掉数组中指定的项之后剩下的元素返回

_(不改变原数组的话可以看 [`without`](#without))_

```js
const pull = (arr, ...args) => {
  let argState = Array.isArray(args[0]) ? args[0] : args;
  let pulled = arr.filter((v, i) => !argState.includes(v));
  arr.length = 0;
  pulled.forEach(v => arr.push(v));
};
```

```js
let myArray = ['a', 'b', 'c', 'a', 'b', 'c'];
pull(myArray, 'a', 'c'); // myArray = [ 'b', 'b' ]
```

### pullAtIndex

将过滤掉数组中指定下标的项

```js
const pullAtIndex = (arr, pullArr) => {
  let removed = [];
  let pulled = arr
    .map((v, i) => (pullArr.includes(i) ? removed.push(v) : v))
    .filter((v, i) => !pullArr.includes(i));
  arr.length = 0;
  pulled.forEach(v => arr.push(v));
  return removed;
};
```

```js
let myArray = ['a', 'b', 'c', 'd'];
let pulled = pullAtIndex(myArray, [1, 3]); // myArray = [ 'a', 'c' ] , pulled = [ 'b', 'd' ]
```

### pullAtValue

将过滤掉数组中指定值的项

```js
const pullAtValue = (arr, pullArr) => {
  let removed = [],
    pushToRemove = arr.forEach((v, i) => (pullArr.includes(v) ? removed.push(v) : v)),
    mutateTo = arr.filter((v, i) => !pullArr.includes(v));
  arr.length = 0;
  mutateTo.forEach(v => arr.push(v));
  return removed;
};
```

```js
let myArray = ['a', 'b', 'c', 'd'];
let pulled = pullAtValue(myArray, ['b', 'd']); // myArray = [ 'a', 'c' ] , pulled = [ 'b', 'd' ]
```

### pullBy

根据迭代函数来进行 `pull` 操作

```js
const pullBy = (arr, ...args) => {
  const length = args.length;
  let fn = length > 1 ? args[length - 1] : undefined;
  fn = typeof fn == 'function' ? (args.pop(), fn) : undefined;
  let argState = (Array.isArray(args[0]) ? args[0] : args).map(val => fn(val));
  let pulled = arr.filter((v, i) => !argState.includes(fn(v)));
  arr.length = 0;
  pulled.forEach(v => arr.push(v));
};
```

```js
var myArray = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }];
pullBy(myArray, [{ x: 1 }, { x: 3 }], o => o.x); // myArray = [{ x: 2 }]
```

### reducedFilter

过滤满足函数 `fn` 的条目，只返回指定的键值 `keys`

```js
const reducedFilter = (data, keys, fn) =>
  data.filter(fn).map(el =>
    keys.reduce((acc, key) => {
      acc[key] = el[key];
      return acc;
    }, {})
  );
```

```js
const data = [
  {
    id: 1,
    name: 'john',
    age: 24
  },
  {
    id: 2,
    name: 'mike',
    age: 50
  }
];

reducedFilter(data, ['id', 'name'], item => item.age > 24); // [{ id: 2, name: 'mike'}]
```

### reduceSuccessive

对累加器和数组中的每个元素（从左到右）应用函数，返回累加值组成的数组

```js
const reduceSuccessive = (arr, fn, acc) =>
  arr.reduce((res, val, i, arr) => (res.push(fn(res.slice(-1)[0], val, i, arr)), res), [acc]);
```

```js
reduceSuccessive([1, 2, 3, 4, 5, 6], (acc, val) => acc + val, 0); // [0, 1, 3, 6, 10, 15, 21]
```

### reduceWhich

根据设置的比较函数返回数组中的最大/最小值

```js
const reduceWhich = (arr, comparator = (a, b) => a - b) =>
  arr.reduce((a, b) => (comparator(a, b) >= 0 ? b : a));
```

```js
reduceWhich([1, 3, 2]); // 1
reduceWhich([1, 3, 2], (a, b) => b - a); // 3
reduceWhich(
  [{ name: 'Tom', age: 12 }, { name: 'Jack', age: 18 }, { name: 'Lucy', age: 9 }],
  (a, b) => a.age - b.age
); // {name: "Lucy", age: 9}
```

### reject

其实就是按照规则过滤数组

```js
const reject = (pred, array) => array.filter((...args) => !pred(...args));
```

```js
reject(x => x % 2 === 0, [1, 2, 3, 4, 5]); // [1, 3, 5]
reject(word => word.length > 4, ['Apple', 'Pear', 'Kiwi', 'Banana']); // ['Pear', 'Kiwi']
```

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

### sample

数组采样

```js
const sample = arr => arr[Math.floor(Math.random() * arr.length)];
```

```js
sample([3, 7, 9, 11]); // 9
```

### sampleSize

数组采样，采样数目 `n`

先用 [Fisher-Yates algorithm](https://github.com/30-seconds/30-seconds-of-code#shuffle) 算法洗牌，随后返回前 `n` 个值

```js
const sampleSize = ([...arr], n = 1) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr.slice(0, n);
};
```

```js
sampleSize([1, 2, 3], 2); // [3,1]
sampleSize([1, 2, 3], 4); // [2,3,1]
```

### shank

功能类似 [`Array.prototype.splice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice), 但是不改变原来的数组而是返回一个新的数组

```js
const shank = (arr, index = 0, delCount = 0, ...elements) =>
  arr
    .slice(0, index)
    .concat(elements)
    .concat(arr.slice(index + delCount));
```

```js
const names = ['alpha', 'bravo', 'charlie'];
const namesAndDelta = shank(names, 1, 0, 'delta'); // [ 'alpha', 'delta', 'bravo', 'charlie' ]
const namesNoBravo = shank(names, 1, 1); // [ 'alpha', 'charlie' ]
console.log(names); // ['alpha', 'bravo', 'charlie']
```

### shuffle

洗牌算法 [Fisher-Yates algorithm](https://github.com/30-seconds/30-seconds-of-code#shuffle)

```js
const shuffle = ([...arr]) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};
```

```js
const foo = [1, 2, 3];
shuffle(foo); // [2, 3, 1], foo = [1, 2, 3]
```

### similarity

交集

```js
const similarity = (arr, values) => arr.filter(v => values.includes(v));
```

```js
similarity([1, 2, 3], [1, 2, 4]); // [1, 2]
```

### sortedIndex

为了确保数组排序，返回新值应该插入的下标

使用 `Array.prototype.findIndex()`

```js
const sortedIndex = (arr, n) => {
  const isDescending = arr[0] > arr[arr.length - 1];
  const index = arr.findIndex(el => (isDescending ? n >= el : n <= el));
  return index === -1 ? arr.length : index;
};
```

```js
sortedIndex([5, 3, 2, 1], 4); // 1
sortedIndex([30, 50], 40); // 1
```

### sortedIndexBy

为了确保数组排序（按照 `fn` 的规则），返回新值应该插入的下标

```js
const sortedIndexBy = (arr, n, fn) => {
  const isDescending = fn(arr[0]) > fn(arr[arr.length - 1]);
  const val = fn(n);
  const index = arr.findIndex(el => (isDescending ? val >= fn(el) : val <= fn(el)));
  return index === -1 ? arr.length : index;
};
```

```js
sortedIndexBy([{ x: 4 }, { x: 5 }], { x: 4 }, o => o.x); // 0
```

### sortedLastIndex

为了确保数组排序，返回新值应该插入的下标（靠后的）

```js
const sortedLastIndex = (arr, n) => {
  const isDescending = arr[0] > arr[arr.length - 1];
  const index = arr.reverse().findIndex(el => (isDescending ? n <= el : n >= el));
  return index === -1 ? 0 : arr.length - index;
};
```

```js
sortedLastIndex([10, 20, 30, 30, 40], 30); // 4
```

### sortedLastIndexBy

为了确保数组排序（按照 `fn` 的规则），返回新值应该插入的下标（靠后的）

```js
const sortedLastIndexBy = (arr, n, fn) => {
  const isDescending = fn(arr[0]) > fn(arr[arr.length - 1]);
  const val = fn(n);
  const index = arr
    .map(fn)
    .reverse()
    .findIndex(el => (isDescending ? val <= el : val >= el));
  return index === -1 ? 0 : arr.length - index;
};
```

```js
sortedLastIndexBy([{ x: 4 }, { x: 5 }], { x: 4 }, o => o.x); // 1
```

### stableSort

执行数组的稳定排序，在值相同时保留项的初始索引

不改变原始数组，而是返回一个新数组

```js
const stableSort = (arr, compare) =>
  arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => compare(a.item, b.item) || a.index - b.index)
    .map(({ item }) => item);
```

```js
const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const stable = stableSort(arr, () => 0); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

### symmetricDifference

返回两个数组之间的差异，不过滤掉重复的值

```js
const symmetricDifference = (a, b) => {
  const sA = new Set(a),
    sB = new Set(b);
  return [...a.filter(x => !sB.has(x)), ...b.filter(x => !sA.has(x))];
};
```

```js
symmetricDifference([1, 2, 3], [1, 2, 4]); // [3, 4]
symmetricDifference([1, 2, 2], [1, 3, 1]); // [2, 2, 3]
```

### symmetricDifferenceBy

将提供的函数应用于两个数组的每个数组元素后，返回两个数组之间的对称差异

```js
const symmetricDifferenceBy = (a, b, fn) => {
  const sA = new Set(a.map(v => fn(v))),
    sB = new Set(b.map(v => fn(v)));
  return [...a.filter(x => !sB.has(fn(x))), ...b.filter(x => !sA.has(fn(x)))];
};
```

```js
symmetricDifferenceBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [ 1.2, 3.4 ]
```

### symmetricDifferenceWith

将提供的函数应用于两个数组的每个数组元素后，返回两个数组之间的对称差异

```js
const symmetricDifferenceWith = (arr, val, comp) => [
  ...arr.filter(a => val.findIndex(b => comp(a, b)) === -1),
  ...val.filter(a => arr.findIndex(b => comp(a, b)) === -1)
];
```

```js
symmetricDifferenceWith(
  [1, 1.2, 1.5, 3, 0],
  [1.9, 3, 0, 3.9],
  (a, b) => Math.round(a) === Math.round(b)
); // [1, 1.2, 3.9]
```

### tail

返回数组中除第一个元素以外的元素，如果只有一个元素则返回原数组

```js
const tail = arr => (arr.length > 1 ? arr.slice(1) : arr);
```

```js
tail([1, 2, 3]); // [2,3]
tail([1]); // [1]
```

### take

取数组的前 `n` 个元素返回

```js
const take = (arr, n = 1) => arr.slice(0, n);
```

```js
take([1, 2, 3], 5); // [1, 2, 3]
take([1, 2, 3], 0); // []
```

### takeRight

取数组的后 `n` 个元素返回

```js
const takeRight = (arr, n = 1) => arr.slice(arr.length - n, arr.length);
```

```js
takeRight([1, 2, 3], 2); // [ 2, 3 ]
takeRight([1, 2, 3]); // [3]
```

### takeRightWhile

取不满足某一要求的数组的后 `n` 个元素返回

```js
const takeRightWhile = (arr, func) =>
  arr.reduceRight((acc, el) => (func(el) ? acc : [el, ...acc]), []);
```

```js
takeRightWhile([1, 2, 3, 4], n => n < 3); // [3, 4]
```

### takeWhile

取不满足某一要求的数组的前 `n` 个元素返回

```js
const takeWhile = (arr, func) => {
  for (const [i, val] of arr.entries()) if (func(val)) return arr.slice(0, i);
  return arr;
};
```

```js
takeWhile([1, 2, 3, 4], n => n >= 3); // [1, 2]
```

### toHash

将类数组对象改成键值对哈希格式

```js
const toHash = (object, key) =>
  Array.prototype.reduce.call(
    object,
    (acc, data, index) => ((acc[!key ? index : data[key]] = data), acc),
    {}
  );
```

```js
toHash([4, 3, 2, 1]); // { 0: 4, 1: 3, 2: 2, 3: 1 }
toHash([{ a: 'label' }], 'a'); // { label: { a: 'label' } }
// A more in depth example:
let users = [{ id: 1, first: 'Jon' }, { id: 2, first: 'Joe' }, { id: 3, first: 'Moe' }];
let managers = [{ manager: 1, employees: [2, 3] }];
// We use function here because we want a bindable reference, but a closure referencing the hash would work, too.
managers.forEach(
  manager =>
    (manager.employees = manager.employees.map(function(id) {
      return this[id];
    }, toHash(users, 'id')))
);
managers; // [ { manager:1, employees: [ { id: 2, first: "Joe" }, { id: 3, first: "Moe" } ] } ]
```

### union

并集

```js
const union = (a, b) => Array.from(new Set([...a, ...b]));
```

```js
union([1, 2, 3], [4, 3, 2]); // [1,2,3,4]
```

### unionBy

并集

```js
const unionBy = (a, b, fn) => {
  const s = new Set(a.map(fn));
  return Array.from(new Set([...a, ...b.filter(x => !s.has(fn(x)))]));
};
```

```js
unionBy([2.1], [1.2, 2.3], Math.floor); // [2.1, 1.2]
```

### unionWith

按照一定规则求并集

```js
const unionWith = (a, b, comp) =>
  Array.from(new Set([...a, ...b.filter(x => a.findIndex(y => comp(x, y)) === -1)]));
```

```js
unionWith([1, 1.2, 1.5, 3, 0], [1.9, 3, 0, 3.9], (a, b) => Math.round(a) === Math.round(b)); // [1, 1.2, 1.5, 3, 0, 3.9]
```

### uniqueElements

去重

```js
const uniqueElements = arr => [...new Set(arr)];
```

```js
uniqueElements([1, 2, 2, 3, 4, 4, 5]); // [1, 2, 3, 4, 5]
```

### uniqueElementsBy

按照一定规则去重

```js
const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v);
    return acc;
  }, []);
```

```js
uniqueElementsBy(
  [
    { id: 0, value: 'a' },
    { id: 1, value: 'b' },
    { id: 2, value: 'c' },
    { id: 1, value: 'd' },
    { id: 0, value: 'e' }
  ],
  (a, b) => a.id == b.id
); // [ { id: 0, value: 'a' }, { id: 1, value: 'b' }, { id: 2, value: 'c' } ]
```

### uniqueElementsByRight

去重（从右向左）

```js
const uniqueElementsByRight = (arr, fn) =>
  arr.reduceRight((acc, v) => {
    if (!acc.some(x => fn(v, x))) acc.push(v);
    return acc;
  }, []);
```

```js
uniqueElementsByRight(
  [
    { id: 0, value: 'a' },
    { id: 1, value: 'b' },
    { id: 2, value: 'c' },
    { id: 1, value: 'd' },
    { id: 0, value: 'e' }
  ],
  (a, b) => a.id == b.id
); // [ { id: 0, value: 'e' }, { id: 1, value: 'd' }, { id: 2, value: 'c' } ]
```

### uniqueSymmetricDifference

返回去重了的差集

```js
const uniqueSymmetricDifference = (a, b) => [
  ...new Set([...a.filter(v => !b.includes(v)), ...b.filter(v => !a.includes(v))])
];
```

```js
uniqueSymmetricDifference([1, 2, 3], [1, 2, 4]); // [3, 4]
uniqueSymmetricDifference([1, 2, 2], [1, 3, 1]); // [2, 3]
```

### unzip

```js
const unzip = arr =>
  arr.reduce(
    (acc, val) => (val.forEach((v, i) => acc[i].push(v)), acc),
    Array.from({
      length: Math.max(...arr.map(x => x.length))
    }).map(x => [])
  );
```

```js
unzip([['a', 1, true], ['b', 2, false]]); // [['a', 'b'], [1, 2], [true, false]]
unzip([['a', 1, true], ['b', 2]]); // [['a', 'b'], [1, 2], [true]]
```

### unzipWith

```js
const unzipWith = (arr, fn) =>
  arr
    .reduce(
      (acc, val) => (val.forEach((v, i) => acc[i].push(v)), acc),
      Array.from({
        length: Math.max(...arr.map(x => x.length))
      }).map(x => [])
    )
    .map(val => fn(...val));
```

```js
unzipWith([[1, 10, 100], [2, 20, 200]], (...args) => args.reduce((acc, v) => acc + v, 0)); // [3, 30, 300]
```

### without

返回数组中除指定元素之外的元素

```js
const without = (arr, ...args) => arr.filter(v => !args.includes(v));
```

```js
without([2, 1, 2, 3], 1, 2); // [3]
```

### xProd

两两配对组合生成一个新的数组

```js
const xProd = (a, b) => a.reduce((acc, x) => acc.concat(b.map(y => [x, y])), []);
```

```js
xProd([1, 2], ['a', 'b']); // [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
```

### zip

根据数组上相同位置的元素构造新的数组

```js
const zip = (...arrays) => {
  const maxLength = Math.max(...arrays.map(x => x.length));
  return Array.from({ length: maxLength }).map((_, i) => {
    return Array.from({ length: arrays.length }, (_, k) => arrays[k][i]);
  });
};
```

```js
zip(['a', 'b'], [1, 2], [true, false]); // [['a', 1, true], ['b', 2, false]]
zip(['a'], [1, 2], [true, false]); // [['a', 1, true], [undefined, 2, false]]
```

### zipObject

根据数组上的对应位置的值构造对象

```js
const zipObject = (props, values) =>
  props.reduce((obj, prop, index) => ((obj[prop] = values[index]), obj), {});
```

```js
zipObject(['a', 'b', 'c'], [1, 2]); // {a: 1, b: 2, c: undefined}
zipObject(['a', 'b'], [1, 2, 3]); // {a: 1, b: 2}
```

### zipWith

以特定规则构造数组

```js
const zipWith = (...array) => {
  const fn = typeof array[array.length - 1] === 'function' ? array.pop() : undefined;
  return Array.from(
    { length: Math.max(...array.map(a => a.length)) },
    (_, i) => (fn ? fn(...array.map(a => a[i])) : array.map(a => a[i]))
  );
};
```

```js
zipWith([1, 2], [10, 20], [100, 200], (a, b, c) => a + b + c); // [111,222]
zipWith(
  [1, 2, 3],
  [10, 20],
  [100, 200],
  (a, b, c) => (a != null ? a : 'a') + (b != null ? b : 'b') + (c != null ? c : 'c')
); // [111, 222, '3bc']
```

</details>

## 🌐 browser

<details>

<summary>展开</summary>

### arrayToHtmlList

将给定的数组元素转换成 `<li>` 标签元素，并将结果加到指定了 `id` 的元素内部去

使用 `Array.prototype.map()`, `document.querySelector()`, 和一个匿名闭包函数实现

```js
const arrayToHtmlList = (arr, listID) =>
  (el => (
    (el = document.querySelector('#' + listID)),
    (el.innerHTML += arr.map(item => `<li>${item}</li>`).join(''))
  ))();
```

```js
arrayToHtmlList(['item 1', 'item 2'], 'myListID');
```

### bottomVisible

页面底部可见时返回 `true`, 否则返回 `false`

使用 `scrollY`, `scrollHeight` 和 `clientHeight` 来进行检测

```js
const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight || document.documentElement.clientHeight);
```

```js
bottomVisible(); // true
```

### copyToClipboard

⚠️ **注意:** 相同功能可以通过使用新的异步 [Clipboard API](https://github.com/w3c/clipboard-apis/blob/master/explainer.adoc#writing-to-the-clipboard) 使用，虽然它目前还处于实验阶段。

复制一个字符串到剪切板

只在用户操作下会生效（如，`click` 事件处理）

新建一个 `<textarea>` 元素, 用提供的数据填充它并将其加到 HTML 文档中

使用 `Selection.getRangeAt()` 储存选中区域（如果有的话）

Use `document.execCommand('copy')` to copy to the clipboard.

使用 `document.execCommand('copy')` 复制到剪切板去

从 HTML 文档中移除 `<textarea>` 元素

最后使用 `Selection().addRange()` 重新覆盖选中区域（如果有的话）

```js
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};
```

```js
copyToClipboard('Lorem ipsum'); // 'Lorem ipsum' copied to clipboard.
```

### counter

创建一个在 `selector` 对应元素内部进行计数的计数器。计数范围为 `[start, end]`, 步距为 `step`, 计数时间 `duration`。

支持反向计数（累减）

使用 `setInterval()`, `Math.abs()` 和 `Math.floor()` 计算更新间隔

使用 `document.querySelector().innerHTML` 更新元素内部数值

步距 `step` 默认为 `1`.

计数时间 `duration` 默认为 `2000ms`

```js
const counter = (selector, start, end, step = 1, duration = 2000) => {
  let current = start,
    _step = (end - start) * step < 0 ? -step : step,
    timer = setInterval(() => {
      current += _step;
      document.querySelector(selector).innerHTML = current;
      if (current >= end) document.querySelector(selector).innerHTML = end;
      if (current >= end) clearInterval(timer);
    }, Math.abs(Math.floor(duration / (end - start))));
  return timer;
};
```

```js
counter('#my-id', 1, 1000, 5, 2000); // Creates a 2-second timer for the element with id="my-id"
```

### createElement

从一个字串创建一个元素对象（不将其插入文档中）

若给定的字串包含有多个元素，只返回第一个

使用 `document.createElement()` 创建一个新的元素

将它的 `innerHTML` 设置成提供的参数字符串

返回 `ParentNode.firstElementChild` 

```js
const createElement = str => {
  const el = document.createElement('div');
  el.innerHTML = str;
  return el.firstElementChild;
};
```

```js
const el = createElement(
  `<div class="container">
    <p>Hello!</p>
  </div>`
);
console.log(el.className); // 'container'
```

### createEventHub

创建一个包含有 `emit`, `on`, `off` 方法的事件发布/订阅 ([发布–订阅](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)) 对象。

使用 `Object.create(null)` 创建一个不从 `Object.prototype` 继承属性和方法的空对象 `hub`

```js
const createEventHub = () => ({
  hub: Object.create(null),
  emit(event, data) {
    (this.hub[event] || []).forEach(handler => handler(data));
  },
  on(event, handler) {
    if (!this.hub[event]) this.hub[event] = [];
    this.hub[event].push(handler);
  },
  off(event, handler) {
    const i = (this.hub[event] || []).findIndex(h => h === handler);
    if (i > -1) this.hub[event].splice(i, 1);
  }
});
```

```js
const handler = data => console.log(data);
const hub = createEventHub();
let increment = 0;

// Subscribe: listen for different types of events
hub.on('message', handler);
hub.on('message', () => console.log('Message event fired'));
hub.on('increment', () => increment++);

// Publish: emit events to invoke all handlers subscribed to them, passing the data to them as an argument
hub.emit('message', 'hello world'); // logs 'hello world' and 'Message event fired'
hub.emit('message', { hello: 'world' }); // logs the object and 'Message event fired'
hub.emit('increment'); // `increment` variable is now 1

// Unsubscribe: stop a specific handler from listening to the 'message' event
hub.off('message', handler);
```

### currentURL

返回当前的 URL

使用 `window.location.href`

```js
const currentURL = () => window.location.href;
```

```js
currentURL(); // 'https://google.com'
```

### detectDeviceType

检测网站是在移动设备/桌面设备上打开的

使用正则检测 `navigator.userAgent` 属性

```js
const detectDeviceType = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop';
```

```js
detectDeviceType(); // "Mobile" or "Desktop"
```

### elementContains

若父元素包含子元素，返回 `true`；否则返回 `false`

使用 [`Node.contains()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/contains)

`node.contains(otherNode)` - 如果 `otherNode` 是 `node` 的后代节点或是 `node` **节点本身** 则返回 `true`, 否则返回 `false`

```js
const elementContains = (parent, child) => parent !== child && parent.contains(child);
```

```js
elementContains(document.querySelector('head'), document.querySelector('title')); // true
elementContains(document.querySelector('body'), document.querySelector('body')); // false
```

### elementIsVisibleInViewport

检测元素在视口中是否是可见的

使用 [`Element.getBoundingClientRect()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect) 和 `window.innerWidth|window.innerHeight)` 的值来检测

`partiallyVisible` 指定是否部分可见

```js
const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};
```

```js
// e.g. 100x100 viewport and a 10x10px element at position {top: -1, left: 0, bottom: 9, right: 10}
elementIsVisibleInViewport(el); // false - (not fully visible)
elementIsVisibleInViewport(el, true); // true - (partially visible)
```

### getImages

获取某一元素下的所有 `<img>` 图片

`includeDuplicates` 用于去重，使用 `Set` 去重

```js
const getImages = (el, includeDuplicates = false) => {
  const images = [...el.getElementsByTagName('img')].map(img => img.getAttribute('src'));
  return includeDuplicates ? images : [...new Set(images)];
};
```

```js
getImages(document, true); // ['image1.jpg', 'image2.png', 'image1.png', '...']
getImages(document, false); // ['image1.jpg', 'image2.png', '...']
```

### getScrollPosition

获取当前页面的滚动位置

```js
const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
});
```

```js
getScrollPosition(); // {x: 0, y: 200}
```

### getStyle

获取元素的 `CSS` 样式值

使用 `Window.getComputedStyle()`

```js
const getStyle = (el, ruleName) => getComputedStyle(el)[ruleName];
```

```js
getStyle(document.querySelector('p'), 'font-size'); // '16px'
```

### hasClass

指定元素是否含有类 `className`

使用 `element.classList.contains()` （IE9不支持）

```js
const hasClass = (el, className) => el.classList.contains(className);
```

```js
hasClass(document.querySelector('p.special'), 'special'); // true
```

### hashBrowser

用 [SHA-256](https://en.wikipedia.org/wiki/SHA-2) 算法创建某个值的哈希值，返回一个 `Promise`

使用 [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) API（兼容性不佳）来创建

```js
const hashBrowser = val =>
  crypto.subtle.digest('SHA-256', new TextEncoder('utf-8').encode(val)).then(h => {
    let hexes = [],
      view = new DataView(h);
    for (let i = 0; i < view.byteLength; i += 4)
      hexes.push(('00000000' + view.getUint32(i).toString(16)).slice(-8));
    return hexes.join('');
  });
```

```js
hashBrowser(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } })).then(console.log); // '04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393'
```

### hide

隐藏指定的所有元素

```js
const hide = (...el) => [...el].forEach(e => (e.style.display = 'none'));
```

```js
hide(document.querySelectorAll('img')); // Hides all <img> elements on the page
```

### httpsRedirect

若当前页面是 `HTTP` 的，将其重定向到 `HTTPS`，同时保证点击返回按钮是不能回到 `HTTP` 的页面的

使用 `location.protocol` 获取当前正在使用的协议

使用 `location.replace()` 替换

```js
const httpsRedirect = () => {
  if (location.protocol !== 'https:') location.replace('https://' + location.href.split('//')[1]);
};
```

```js
httpsRedirect(); // If you are on http://mydomain.com, you are redirected to https://mydomain.com
```

### insertAfter

在指定元素后面插入一个 HTML 字串

使用 `el.insertAdjacentHTML()`

```js
const insertAfter = (el, htmlString) => el.insertAdjacentHTML('afterend', htmlString);
```

```js
insertAfter(document.getElementById('myId'), '<p>after</p>'); // <div id="myId">...</div> <p>after</p>
```

### insertBefore

在指定元素尾前面插入一个 HTML 字串

使用 `el.insertAdjacentHTML()`

```js
const insertBefore = (el, htmlString) => el.insertAdjacentHTML('beforebegin', htmlString);
```

```js
insertBefore(document.getElementById('myId'), '<p>before</p>'); // <p>before</p> <div id="myId">...</div>
```

### isBrowserTabFocused

Returns `true` if the browser tab of the page is focused, `false` otherwise.

检查当前页面是否是聚焦的

使用 `Document.hidden` 属性, [Page Visibility API](https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API)

```js
const isBrowserTabFocused = () => !document.hidden;
```

```js
isBrowserTabFocused(); // true
```

### nodeListToArray

将 `NodeList` 转化为数组

```js
const nodeListToArray = nodeList => [...nodeList];
```

```js
nodeListToArray(document.childNodes); // [ <!DOCTYPE html>, html ]
```

### observeMutations

返回一个新的 [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

```js
const observeMutations = (element, callback, options) => {
  const observer = new MutationObserver(mutations => mutations.forEach(m => callback(m)));
  observer.observe(
    element,
    Object.assign(
      {
        childList: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
        subtree: true
      },
      options
    )
  );
  return observer;
};
```

```js
const obs = observeMutations(document, console.log); // Logs all mutations that happen on the page
obs.disconnect(); // Disconnects the observer and stops logging mutations on the page
```

### off

移除某个对象上的所有事件

```js
const off = (el, evt, fn, opts = false) => el.removeEventListener(evt, fn, opts);
```

```js
const fn = () => console.log('!');
document.body.addEventListener('click', fn);
off(document.body, 'click', fn); // no longer logs '!' upon clicking on the page
```

### on

给某个元素提供事件委托功能的能力

```js
const on = (el, evt, fn, opts = {}) => {
  const delegatorFn = e => e.target.matches(opts.target) && fn.call(e.target, e);
  el.addEventListener(evt, opts.target ? delegatorFn : fn, opts.options || false);
  if (opts.target) return delegatorFn;
};
```

```js
const fn = () => console.log('!');
on(document.body, 'click', fn); // logs '!' upon clicking the body
on(document.body, 'click', fn, { target: 'p' }); // logs '!' upon clicking a `p` element child of the body
on(document.body, 'click', fn, { options: true }); // use capturing instead of bubbling
```

### onUserInputChange

```js
const onUserInputChange = callback => {
  let type = 'mouse',
    lastTime = 0;
  const mousemoveHandler = () => {
    const now = performance.now();
    if (now - lastTime < 20)
      (type = 'mouse'), callback(type), document.removeEventListener('mousemove', mousemoveHandler);
    lastTime = now;
  };
  document.addEventListener('touchstart', () => {
    if (type === 'touch') return;
    (type = 'touch'), callback(type), document.addEventListener('mousemove', mousemoveHandler);
  });
};
```

```js
onUserInputChange(type => {
  console.log('The user is now using', type, 'as an input method.');
});
```

### prefix

返回浏览器支持的 CSS 前缀

```js
const prefix = prop => {
  const capitalizedProp = prop.charAt(0).toUpperCase() + prop.slice(1); // 驼峰
  const prefixes = ['', 'webkit', 'moz', 'ms', 'o'];
  const i = prefixes.findIndex(
    prefix => typeof document.body.style[prefix ? prefix + capitalizedProp : prop] !== 'undefined'
  );
  return i !== -1 ? (i === 0 ? prop : prefixes[i] + capitalizedProp) : null;
};
```

```js
prefix('appearance'); // 'appearance' on a supported browser, otherwise 'webkitAppearance', 'mozAppearance', 'msAppearance' or 'oAppearance'
```

### recordAnimationFrames

在每帧动画调用指定回调函数

使用迭代

```js
const recordAnimationFrames = (callback, autoStart = true) => {
  let running = true,
    raf;
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  const start = () => {
    running = true;
    run();
  };
  const run = () => {
    raf = requestAnimationFrame(() => {
      callback();
      if (running) run();
    });
  };
  if (autoStart) start();
  return { start, stop };
};
```

```js
const cb = () => console.log('Animation frame fired');
const recorder = recordAnimationFrames(cb); // logs 'Animation frame fired' on each animation frame
recorder.stop(); // stops logging
recorder.start(); // starts again
const recorder2 = recordAnimationFrames(cb, false); // `start` needs to be explicitly called to begin recording frames
```

### redirect

重定向到指定的 `URL`

第二个参数模仿点击(`true`)或者是一个 `HTTP`重定向(`false`).

```js
const redirect = (url, asLink = true) =>
  asLink ? (window.location.href = url) : window.location.replace(url);
```

```js
redirect('https://google.com');
```

### runAsync

在 [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) 中执行函数

```js
const runAsync = fn => {
  const worker = new Worker(
    URL.createObjectURL(new Blob([`postMessage((${fn})());`]), {
      type: 'application/javascript; charset=utf-8'
    })
  );
  return new Promise((res, rej) => {
    worker.onmessage = ({ data }) => {
      res(data), worker.terminate();
    };
    worker.onerror = err => {
      rej(err), worker.terminate();
    };
  });
};
```

```js
const longRunningFunction = () => {
  let result = 0;
  for (let i = 0; i < 1000; i++)
    for (let j = 0; j < 700; j++) for (let k = 0; k < 300; k++) result = result + i + j + k;

  return result;
};
/*
  NOTE: Since the function is running in a different context, closures are not supported.
  The function supplied to `runAsync` gets stringified, so everything becomes literal.
  All variables and functions must be defined inside.
*/
runAsync(longRunningFunction).then(console.log); // 209685000000
runAsync(() => 10 ** 3).then(console.log); // 1000
let outsideVariable = 50;
runAsync(() => typeof outsideVariable).then(console.log); // 'undefined'
```

### scrollToTop

平稳地滚动到页面的顶部

使用 `document.documentElement.scrollTop` 或 `document.body.scrollTop` 获取到页面顶部的距离

使用 `window.requestAnimationFrame()` 执行滚动动画

```js
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};
```

```js
scrollToTop();
```

### setStyle

设置 `CSS` 样式

```js
const setStyle = (el, ruleName, val) => (el.style[ruleName] = val);
```

```js
setStyle(document.querySelector('p'), 'font-size', '20px'); // The first <p> element on the page will have a font-size of 20px
```

### show

显示所有指定的元素

```js
const show = (...el) => [...el].forEach(e => (e.style.display = ''));
```

```js
show(...document.querySelectorAll('img')); // Shows all <img> elements on the page
```

### smoothScroll

将元素平滑地滚动到可视区域

使用 `.scrollIntoView` 方法

传入 `{ behavior: 'smooth' }`

```js
const smoothScroll = element =>
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  });
```

```js
smoothScroll('#fooBar'); // scrolls smoothly to the element with the id fooBar
smoothScroll('.fooBar'); // scrolls smoothly to the first element with a class of fooBar
```

### toggleClass

toggle 元素的 class

使用 [`element.classList.toggle()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList)

```js
const toggleClass = (el, className) => el.classList.toggle(className);
```

```js
toggleClass(document.querySelector('p.special'), 'special'); // The paragraph will not have the 'special' class anymore
```

### triggerEvent

在给定元素上触发特定事件，可以传递数据

使用 [`new CustomEvent()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent)

使用 [`el.dispatchEvent()`](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/dispatchEvent)

```js
const triggerEvent = (el, eventType, detail) =>
  el.dispatchEvent(new CustomEvent(eventType, { detail }));
```

```js
triggerEvent(document.getElementById('myId'), 'click');
triggerEvent(document.getElementById('myId'), 'click', { username: 'bob' });
```

### UUIDGeneratorBrowser

生成浏览器环境下的 `UUID`

使用 `crypto` API, 遵从 [RFC4122](https://www.ietf.org/rfc/rfc4122.txt) version 4.

```js
const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
```

```js
UUIDGeneratorBrowser(); // '7982fcfe-5721-4632-bede-6000885be57d'
```

</details>

## ⏱️ date

<details>

<summary>展开</summary>

### dayOfYear

获取某一个 `Date` 对象是该年的第几天

使用 `new Date()` 和 `Date.prototype.getFullYear()` 获取 `Date` 对象对应年份的第一天，然后提取对应天数的秒数，再使用 `Math.floor()` 来算出天数

```js
const dayOfYear = date =>
  Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
```

```js
dayOfYear(new Date()); // 272
```

### formatDuration

返回易读的时间

将 `ms` 数转成使用 `day`, `hour`, `minute`, `second` 和 `millisecond` 单位表示的值

```js
const formatDuration = ms => {
  if (ms < 0) ms = -ms;
  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    minute: Math.floor(ms / 60000) % 60,
    second: Math.floor(ms / 1000) % 60,
    millisecond: Math.floor(ms) % 1000
  };
  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
};
```

```js
formatDuration(1001); // '1 second, 1 millisecond'
formatDuration(34325055574); // '397 days, 6 hours, 44 minutes, 15 seconds, 574 milliseconds'
```

### getColonTimeFromDate

返回 `HH:MM:SS` 格式表示的 `Date` 对象

```js
const getColonTimeFromDate = date => date.toTimeString().slice(0, 8);
```

```js
getColonTimeFromDate(new Date()); // "08:38:00"
```

### getDaysDiffBetweenDates

返回两个 `Date` 对象相差的天数

```js
const getDaysDiffBetweenDates = (dateInitial, dateFinal) =>
  (dateFinal - dateInitial) / (1000 * 3600 * 24);
```

```js
getDaysDiffBetweenDates(new Date('2017-12-13'), new Date('2017-12-22')); // 9
```

### getMeridiemSuffixOfInteger

根据数字计算 `am` 或 `pm` 表示的时间

```js
const getMeridiemSuffixOfInteger = num =>
  num === 0 || num === 24
    ? 12 + 'am'
    : num === 12
      ? 12 + 'pm'
      : num < 12
        ? (num % 12) + 'am'
        : (num % 12) + 'pm';
```

```js
getMeridiemSuffixOfInteger(0); // "12am"
getMeridiemSuffixOfInteger(11); // "11am"
getMeridiemSuffixOfInteger(13); // "1pm"
getMeridiemSuffixOfInteger(25); // "1pm"
```

### isAfterDate

检测一个日期对象是否是另一个后面的日期

```js
const isAfterDate = (dateA, dateB) => dateA > dateB;
```

```js
isAfterDate(new Date(2010, 10, 21), new Date(2010, 10, 20)); // true
```

### isBeforeDate

检测一个日期对象是否是另一个前面的日期

```js
const isBeforeDate = (dateA, dateB) => dateA < dateB;
```

```js
isBeforeDate(new Date(2010, 10, 20), new Date(2010, 10, 21)); // true
```

### isSameDate

两个日期是否相等

使用 `Date.prototype.toISOString()`

```js
const isSameDate = (dateA, dateB) => dateA.toISOString() === dateB.toISOString();
```

```js
isSameDate(new Date(2010, 10, 20), new Date(2010, 10, 20)); // true
```

### maxDate

返回一组日期对象中的最大值

```js
const maxDate = (...dates) => new Date(Math.max.apply(null, ...dates));
```

```js
const array = [
  new Date(2017, 4, 13),
  new Date(2018, 2, 12),
  new Date(2016, 0, 10),
  new Date(2016, 0, 9)
];
maxDate(array); // 2018-03-11T22:00:00.000Z
```

### minDate

返回给定日期值中的最小值

```js
const minDate = (...dates) => new Date(Math.min.apply(null, ...dates));
```

```js
const array = [
  new Date(2017, 4, 13),
  new Date(2018, 2, 12),
  new Date(2016, 0, 10),
  new Date(2016, 0, 9)
];
minDate(array); // 2016-01-08T22:00:00.000Z
```

### tomorrow

返回明天的日期字串

```js
const tomorrow = (long = false) => {
  let t = new Date();
  t.setDate(t.getDate() + 1);
  const ret = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(
    t.getDate()
  ).padStart(2, '0')}`;
  return !long ? ret : `${ret}T00:00:00`;
};
```

```js
tomorrow(); // 2017-12-27 (if current date is 2017-12-26)
tomorrow(true); // 2017-12-27T00:00:00 (if current date is 2017-12-26)
```

</details>

## 🎛️ function

<details>

<summary>展开</summary>

### attempt

使用给定的参数去**尝试**调用一个函数，返回执行结果或者捕获的错误对象。

内部使用一个 `try... catch` 块。

```js
const attempt = (fn, ...args) => {
  try {
    return fn(...args);
  } catch (e) {
    return e instanceof Error ? e : new Error(e);
  }
};
```

```js
var elements = attempt(function(selector) {
  return document.querySelectorAll(selector);
}, '>_>');
if (elements instanceof Error) elements = []; // elements = []
```

### bind

创建一个在指定上下文环境中执行的函数 `fn`，可以选择给它传入一组默认的参数

返回一个函数，使用 `Function.prototype.apply()` 将 `fn` 绑定到对应上下文环境 `context`

使用 `...` 组合默认参数和传入的参数

```js
const bind = (fn, context, ...boundArgs) => (...args) => fn.apply(context, [...boundArgs, ...args]);
```

```js
function greet(greeting, punctuation) {
  return greeting + ' ' + this.user + punctuation;
}
const freddy = { user: 'fred' };
const freddyBound = bind(greet, freddy);
console.log(freddyBound('hi', '!')); // 'hi fred!'
```

### bindKey

创建一个指定了名字的对象方法，该方法的执行上下文为该对象，可以选择传入若干默认参数

```js
const bindKey = (context, fn, ...boundArgs) => (...args) =>
  context[fn].apply(context, [...boundArgs, ...args]);
```

```js
const freddy = {
  user: 'fred',
  greet: function(greeting, punctuation) {
    return greeting + ' ' + this.user + punctuation;
  }
};
const freddyBound = bindKey(freddy, 'greet');
console.log(freddyBound('hi', '!')); // 'hi fred!'
```

### chainAsync

链式 `async` 函数

遍历含有异步操作的数组，在异步操作完成后调用 `next` 方法。

```js
const chainAsync = fns => {
  let curr = 0;
  const last = fns[fns.length - 1];
  const next = () => {
    const fn = fns[curr++];
    fn === last ? fn() : fn(next);
  };
  next();
};
```

```js
chainAsync([
  next => {
    console.log('0 seconds');
    setTimeout(next, 1000);
  },
  next => {
    console.log('1 second');
    setTimeout(next, 1000);
  },
  () => {
    console.log('2 second');
  }
]);
```

### compose

从右到左组合函数功能

使用 `Array.prototype.reduce()`

最后（右）的函数可以接受一或多个参数；剩下的函数则是一元的

```js
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
```

```js
const add5 = x => x + 5;
const multiply = (x, y) => x * y;
const multiplyAndAdd5 = compose(
  add5,
  multiply
);
multiplyAndAdd5(5, 2); // 15
```

### composeRight

从左到右组合函数功能

使用 `Array.prototype.reduce()`

最先（左）的函数可以接受一或多个参数；剩下的函数则是一元的

```js
const composeRight = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));
```

```js
const add = (x, y) => x + y;
const square = x => x * x;
const addAndSquare = composeRight(add, square);
addAndSquare(1, 2); // 9
```

### converge

接受一个聚合函数和一个分支函数列表，并返回一个传入参数给每个分支函数的函数，该函数将分支函数的运行结果作为参数传递给聚合函数。

使用 `Array.prototype.map()` 和 `Function.prototype.apply()` 给每个分支函数传入参数

使用扩展运算符 (`...`) 来传入分支函数的执行结果给 `coverger`

```js
const converge = (converger, fns) => (...args) => converger(...fns.map(fn => fn.apply(null, args)));
```

```js
const average = converge((a, b) => a / b, [
  arr => arr.reduce((a, v) => a + v, 0),
  arr => arr.length
]);
average([1, 2, 3, 4, 5, 6, 7]); // 4
```

### curry

柯里化函数

使用递归

若传入了足够的参数 `args`，调用传入的函数 `fn`; 否则返回需要剩余参数的柯里化的函数

若想要柯里化一个可以传入茫茫多参数的函数（如，`Math.min()`），可以选择传入参数个数给 `arity`

`fn.length` 指函数参数个数

```js
const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
```

```js
curry(Math.pow)(2)(10); // 1024
curry(Math.min, 3)(10)(50)(2); // 2
```

### debounce

防抖函数

延迟调用函数 `fn` 直到上一次调用它过去了 `ms` 时间

```js
const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
```

```js
window.addEventListener(
  'resize',
  debounce(() => {
    console.log(window.innerWidth);
    console.log(window.innerHeight);
  }, 250)
); // Will log the window dimensions at most every 250ms
```

### defer

延迟调用函数直至当前的调用栈清空了

```js
const defer = (fn, ...args) => setTimeout(fn, 1, ...args);
```

```js
// Example A:
defer(console.log, 'a'), console.log('b'); // logs 'b' then 'a'

// Example B:
document.querySelector('#someElement').innerHTML = 'Hello';
longRunningFunction(); // Browser will not update the HTML until this has finished
defer(longRunningFunction); // Browser will update the HTML then run the function
```

### delay

在等待了 `wait` 毫秒之后调用函数

`setTimeout()` 第三个参数传入供 `fn` 调用的函数

```js
const delay = (fn, wait, ...args) => setTimeout(fn, wait, ...args);
```

```js
delay(
  function(text) {
    console.log(text);
  },
  1000,
  'later'
); // Logs 'later' after one second.
```

### functionName

打印出函数的名字

使用 `console.debug()` 和 `name` 属性

`console.debug` 是 `console.log` 的别名

```js
const functionName = fn => (console.debug(fn.name), fn);
```

```js
functionName(Math.max); // max (logged in debug channel of console)
```

### hz

返回一个函数每秒执行的次数

`hz` 是 `hertz` 的单位, 代表频率

使用 `performance.now()` 获取执行前后的时间

```js
const hz = (fn, iterations = 100) => {
  const before = performance.now();
  for (let i = 0; i < iterations; i++) fn();
  return (1000 * iterations) / (performance.now() - before);
};
```

```js
// 10,000 element array
const numbers = Array(10000)
  .fill()
  .map((_, i) => i);

// Test functions with the same goal: sum up the elements in the array
const sumReduce = () => numbers.reduce((acc, n) => acc + n, 0);
const sumForLoop = () => {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) sum += numbers[i];
  return sum;
};

// `sumForLoop` is nearly 10 times faster
Math.round(hz(sumReduce)); // 572
Math.round(hz(sumForLoop)); // 4784
```

### memoize

返回缓存了的函数

使用 `Map` 对象

```js
const memoize = fn => {
  const cache = new Map();
  const cached = function(val) {
    return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached;
};
```

```js
// See the `anagrams` snippet.
const anagramsCached = memoize(anagrams);
anagramsCached('javascript'); // takes a long time
anagramsCached('javascript'); // returns virtually instantly since it's now cached
console.log(anagramsCached.cache); // The cached anagrams map
```

### negate

函数的返回值取非

```js
const negate = func => (...args) => !func(...args);
```

```js
[1, 2, 3, 4, 5, 6].filter(negate(n => n % 2 === 0)); // [ 1, 3, 5 ]
```

### once

保证一个函数只被调用一次

```js
const once = fn => {
  let called = false;
  return function(...args) {
    if (called) return;
    called = true;
    return fn.apply(this, args); // 注意 this
  };
};
```

```js
const startApp = function(event) {
  console.log(this, event); // document.body, MouseEvent
};
document.body.addEventListener('click', once(startApp)); // only runs `startApp` once upon click
```

### partial

把参数加入到 `fn` 接受的参数前面去

```js
const partial = (fn, ...partials) => (...args) => fn(...partials, ...args);
```

```js
const greet = (greeting, name) => greeting + ' ' + name + '!';
const greetHello = partial(greet, 'Hello');
greetHello('John'); // 'Hello John!'
```

### partialRight

把参数加入到 `fn` 接受的参数后面去

```js
const partialRight = (fn, ...partials) => (...args) => fn(...args, ...partials);
```

```js
const greet = (greeting, name) => greeting + ' ' + name + '!';
const greetJohn = partialRight(greet, 'John');
greetJohn('Hello'); // 'Hello John!'
```

### runPromisesInSeries

顺序执行数组中的 `promise` 函数元素

```js
const runPromisesInSeries = ps => ps.reduce((p, next) => p.then(next), Promise.resolve());
```

```js
const delay = d => new Promise(r => setTimeout(r, d));
runPromisesInSeries([() => delay(1000), () => delay(2000)]); // Executes each promise sequentially, taking a total of 3 seconds to complete
```

### sleep

延迟执行异步函数

其实就是将其放入 `setTimeout` 中，再在外面裹上一层 `Promise`

```js
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
```

```js
async function sleepyWork() {
  console.log("I'm going to sleep for 1 second.");
  await sleep(1000);
  console.log('I woke up after 1 second.');
}
```

### throttle

节流函数。在 `wait` 时间内最多调用一次函数。

使用 `setTimeout()` 和 `clearTimeout()` 来对函数 `fn` 节流

```js
const throttle = (fn, wait) => {
  let inThrottle, lastFn, lastTime;
  return function() {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function() {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};
```

```js
window.addEventListener(
  'resize',
  throttle(function(evt) {
    console.log(window.innerWidth);
    console.log(window.innerHeight);
  }, 250)
); // Will log the window dimensions at most every 250ms
```

### times

迭代调用函数 `n` 次，`n` 次后或者函数返回 `false` 的话就停止调用

```js
const times = (n, fn, context = undefined) => {
  let i = 0;
  while (fn.call(context, i) !== false && ++i < n) {}
};
```

```js
var output = '';
times(5, i => (output += i));
console.log(output); // 01234
```

### uncurry

反柯里化

```js
const uncurry = (fn, n = 1) => (...args) => {
  const next = acc => args => args.reduce((x, y) => x(y), acc);
  if (n > args.length) throw new RangeError('Arguments too few!');
  return next(fn)(args.slice(0, n));
};
```

```js
const add = x => y => z => x + y + z;
const uncurriedAdd = uncurry(add, 3);
uncurriedAdd(1, 2, 3); // 6
```

### unfold

使用迭代器函数和初始种子值构建数组

```js
const unfold = (fn, seed) => {
  let result = [],
    val = [null, seed];
  while ((val = fn(val[1]))) result.push(val[0]);
  return result;
};
```

```js
var f = n => (n > 50 ? false : [-n, n + 10]);
unfold(f, 10); // [-10, -20, -30, -40, -50]
```

### when

检测一个值 `x`，预测函数返回 `true` 的话就返回 `fn(x)`，否则返回 `x`

```js
const when = (pred, whenTrue) => x => (pred(x) ? whenTrue(x) : x);
```

```js
const doubleEvenNumbers = when(x => x % 2 === 0, x => x * 2);
doubleEvenNumbers(2); // 4
doubleEvenNumbers(1); // 1
```

</details>

## ➗ math

<details>

<summary>展开</summary>

### approximatelyEqual

检查两个数字是否近似相等。

内部使用 `Math.abs()` 来比较两个数字的差值和精度 `epsilon`，`epsilon` 默认取值 `0.001`

```js
const approximatelyEqual = (v1, v2, epsilon = 0.001) => Math.abs(v1 - v2) < epsilon;
```

```js
approximatelyEqual(Math.PI / 2.0, 1.5708); // true
```

### average

Returns the average of two or more numbers.

返回多个数字的均值

使用 `Array.prototype.reduce()` 累加数组的值，再除以数组长度

累加的初始值给个 `0`

```js
const average = (...nums) => nums.reduce((acc, val) => acc + val, 0) / nums.length;
```

```js
average(...[1, 2, 3]); // 2
average(1, 2, 3); // 2
```

### averageBy

将数组每个对象以 `fn` 为规则的映射值做平均，`fn` 可以是处理函数，也可以是属性名

使用 `Array.prototype.map()` 来获取经 `fn` 处理后的映射值，再使用 `Array.prototype.reduce()` 累加，随后除以数组长度获得均值

```js
const averageBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => acc + val, 0) /
  arr.length;
```

```js
averageBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], o => o.n); // 5
averageBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 5
```

### binomialCoefficient

计算两个整数 `n` 和 `k` 的二项式系数

使用 `Number.isNaN()` 来检查 `n` 和 `k` 是否为 `NaN`

检查 `k<0`, `k>=n`, `k==1` 或者 `k==n-1` 的情况并返回合适的值

若 `n - k < k` 就交换他们的值

从 `2` 到 `k` 的循环计算二项式系数

使用 `Math.round()` 计算舍入误差

```js
const binomialCoefficient = (n, k) => {
  if (Number.isNaN(n) || Number.isNaN(k)) return NaN;
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k === 1 || k === n - 1) return n;
  if (n - k < k) k = n - k;
  let res = n;
  for (let j = 2; j <= k; j++) res *= (n - j + 1) / j;
  return Math.round(res);
};
```

```js
binomialCoefficient(8, 2); // 28
```

### clampNumber

若 `num` 在区间 `a` 和 `b` 内，返回 `num`; 否则返回较近的区间边界值

```js
const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
```

```js
clampNumber(2, 3, 5); // 3
clampNumber(1, -1, -5); // -1
```

### degreesToRads

将角度转成弧度

使用 `Math.PI`

```js
const degreesToRads = deg => (deg * Math.PI) / 180.0;
```

```js
degreesToRads(90.0); // ~1.5708
```

### digitize

将一个数转化成单个数字组成的数组

先转成字符串再用扩展字符串分成数组，随后将每一个字符转成数字

```js
const digitize = n => [...`${n}`].map(i => parseInt(i));
```

```js
digitize(123); // [1, 2, 3]
```

### distance

返回两点之间的距离

使用 `Math.hypot()` (这个方法 IE 不兼容)

```js
const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);
```

```js
distance(1, 1, 2, 3); // 2.23606797749979
```

### elo

计算[ELO等级分制度](https://en.wikipedia.org/wiki/Elo_rating_system). 

传入的数组按照 `胜者->负者` 的顺序

默认 `kFactor` 为 32.

```js
const elo = ([...ratings], kFactor = 32, selfRating) => {
  const [a, b] = ratings;
  // opponent 对 self 的胜率期望值
  const expectedScore = (self, opponent) => 1 / (1 + 10 ** ((opponent - self) / 400));
  const newRating = (rating, i) =>
    (selfRating || rating) + kFactor * (i - expectedScore(i ? a : b, i ? b : a));
  if (ratings.length === 2) return [newRating(a, 1), newRating(b, 0)];

  for (let i = 0, len = ratings.length; i < len; i++) {
    let j = i;
    while (j < len - 1) {
      j++;
      [ratings[i], ratings[j]] = elo([ratings[i], ratings[j]], kFactor);
    }
  }
  return ratings;
};
```

```js
// Standard 1v1s
elo([1200, 1200]); // [1216, 1184]
elo([1200, 1200], 64); // [1232, 1168]
// 4 player FFA, all same rank
elo([1200, 1200, 1200, 1200]).map(Math.round); // [1246, 1215, 1185, 1154]
/*
For teams, each rating can adjusted based on own team's average rating vs.
average rating of opposing team, with the score being added to their
own individual rating by supplying it as the third argument.
*/
```

### factorial

计算阶乘

```js
const factorial = n =>
  n < 0
    ? (() => {
      throw new TypeError('Negative numbers are not allowed!');
    })()
    : n <= 1
      ? 1
      : n * factorial(n - 1);
```

```js
factorial(6); // 720
```

### fibonacci

生成斐波那契数组

使用 `Array.from()` 和 `Array.prototype.reduce()`

使用数组下标初始化最开始的两个值 `0` 和 `1`

```js
const fibonacci = n =>
  Array.from({ length: n }).reduce(
    (acc, val, i) => acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i),
    []
  );
```

```js
fibonacci(6); // [0, 1, 1, 2, 3, 5]
```

### gcd

计算几个数的最大公约数（可以传入数字和数组）

内部的 `_gcd` 函数用于迭代

```js
const gcd = (...arr) => {
  // y=0 就返回 x; 否则返回 x/y 的余数
  const _gcd = (x, y) => (!y ? x : gcd(y, x % y));
  return [...arr].reduce((a, b) => _gcd(a, b));
};
```

```js
gcd(8, 36); // 4
gcd(...[12, 8, 32]); // 4
```

### geometricProgression

等比级数

```js
const geometricProgression = (end, start = 1, step = 2) =>
  Array.from({ length: Math.floor(Math.log(end / start) / Math.log(step)) + 1 }).map(
    (v, i) => start * step ** i
  );
```

```js
geometricProgression(256); // [1, 2, 4, 8, 16, 32, 64, 128, 256]
geometricProgression(256, 3); // [3, 6, 12, 24, 48, 96, 192]
geometricProgression(256, 1, 4); // [1, 4, 16, 64, 256]
```

### hammingDistance

计算两个值之间的汉明距离

使用异或操作符 (`^`) 找到两个数之间的差异值，将其转换成2进制的字串并统计 `1` 出现的次数

```js
const hammingDistance = (num1, num2) => ((num1 ^ num2).toString(2).match(/1/g) || '').length;
```

```js
hammingDistance(2, 3); // 1
```

### inRange

检查给定的数字是否落在指定区间内

```js
const inRange = (n, start, end = null) => {
  if (end && start > end) [end, start] = [start, end]; // 调整区间范围
  return end == null ? n >= 0 && n < start : n >= start && n < end; // 未指定 end，区间就是 [0, start]
};
```

```js
inRange(3, 2, 5); // true
inRange(3, 4); // true
inRange(2, 3, 5); // false
inRange(3, 2); // false
```

### isDivisible

检查可除性

```js
const isDivisible = (dividend, divisor) => dividend % divisor === 0;
```

```js
isDivisible(6, 3); // true
```

### isEven

是否是偶数

```js
const isEven = num => num % 2 === 0;
```

```js
isEven(3); // false
```

### isNegativeZero

是否是 `-0`

```js
const isNegativeZero = val => val === 0 && 1 / val === -Infinity;
```

```js
isNegativeZero(-0); // true
isNegativeZero(0); // false
```

### isPrime

是否是素数

```js
const isPrime = num => {
  const boundary = Math.floor(Math.sqrt(num));
  for (var i = 2; i <= boundary; i++) if (num % i === 0) return false;
  return num >= 2;
};
```

```js
isPrime(11); // true
```

### lcm

最小公倍数

用到最大公约数（gcd）和公式 `lcm(x,y) = x * y / gcd(x,y)`

```js
const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};
```

```js
lcm(12, 7); // 84
lcm(...[1, 3, 4, 5]); // 60
```

### luhnCheck

实现 [Luhn 算法](https://en.wikipedia.org/wiki/Luhn_algorithm)

```js
const luhnCheck = num => {
  let arr = (num + '')
    .split('')
    .reverse()
    .map(x => parseInt(x));
  let lastDigit = arr.splice(0, 1)[0];
  let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
  sum += lastDigit;
  return sum % 10 === 0;
};
```

```js
luhnCheck('4485275742308327'); // true
luhnCheck(6011329933655299); //  false
luhnCheck(123456789); // false
```

### maxBy

返回对象数组的元素按某种规则运算后返回值得最大值

```js
const maxBy = (arr, fn) => Math.max(...arr.map(typeof fn === 'function' ? fn : val => val[fn]));
```

```js
maxBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], o => o.n); // 8
maxBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 8
```

### median

返回数组的中位值

```js
const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};
```

```js
median([5, 6, 50, 1, -5]); // 5
```

### midpoint

两点连线的中点坐标

```js
const midpoint = ([x1, y1], [x2, y2]) => [(x1 + x2) / 2, (y1 + y2) / 2];
```

```js
midpoint([2, 2], [4, 4]); // [3, 3]
midpoint([4, 4], [6, 6]); // [5, 5]
midpoint([1, 3], [2, 4]); // [1.5, 3.5]
```


### minBy

将数组元素的映射结果的最小值返回

```js
const minBy = (arr, fn) => Math.min(...arr.map(typeof fn === 'function' ? fn : val => val[fn]));
```

```js
minBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], o => o.n); // 2
minBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 2
```

### percentile

计算数组中不大于指定值的元素在所有元素中的占比

```js
const percentile = (arr, val) =>
  (100 * arr.reduce((acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0), 0)) / arr.length;
```

```js
percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6); // 55
```

### powerset

返回数组的幂集，即原集合中所有的子集（包括全集和空集）构成的集族

```js
const powerset = arr => arr.reduce((a, v) => a.concat(a.map(r => [v].concat(r))), [[]]);
```

```js
powerset([1, 2]); // [[], [1], [2], [2, 1]]
```

### primes

根据埃拉托斯特尼筛法生成素数数组

```js
const primes = num => {
  let arr = Array.from({ length: num - 1 }).map((x, i) => i + 2), // 从 2 到当前 num 的数组
    sqroot = Math.floor(Math.sqrt(num)), // 遍历到 √num
    numsTillSqroot = Array.from({ length: sqroot - 1 }).map((x, i) => i + 2);
  numsTillSqroot.forEach(x => (arr = arr.filter(y => y % x !== 0 || y === x)));
  return arr;
};
```

```js
primes(10); // [2,3,5,7]
```

### radsToDegrees

弧度 => 角度

使用 `Math.PI`

```js
const radsToDegrees = rad => (rad * 180.0) / Math.PI;
```

```js
radsToDegrees(Math.PI / 2); // 90
```

### randomIntArrayInRange

生成 `[min, max]` 区间内的 `n` 个数

```js
const randomIntArrayInRange = (min, max, n = 1) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);
```

```js
randomIntArrayInRange(12, 35, 10); // [ 34, 14, 27, 17, 30, 27, 20, 26, 21, 14 ]
```

### randomIntegerInRange

生成 `[min, max]` 区间内的随机**整数**

```js
const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
```

```js
randomIntegerInRange(0, 5); // 2
```

### randomNumberInRange

生成 `[min, max]` 区间内的随机数

```js
const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;
```

```js
randomNumberInRange(2, 10); // 6.0211363285087005
```

### round

将数字整到指定精度

```js
const round = (n, decimals = 0) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`);
```

```js
round(1.005, 2); // 1.01
```

### sdbm

将输入的字串哈希

```js
const sdbm = str => {
  let arr = str.split('');
  return arr.reduce(
    (hashCode, currentVal) =>
      (hashCode = currentVal.charCodeAt(0) + (hashCode << 6) + (hashCode << 16) - hashCode),
    0
  );
};
```

```js
sdbm('name'); // -3521204949
```

### standardDeviation

返回数组数组的标准偏差

```js
const standardDeviation = (arr, usePopulation = false) => {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(
    arr.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0) /
      (arr.length - (usePopulation ? 0 : 1))
  );
};
```

```js
standardDeviation([10, 2, 38, 23, 38, 23, 21]); // 13.284434142114991 (sample)
standardDeviation([10, 2, 38, 23, 38, 23, 21], true); // 12.29899614287479 (population)
```

### sum

求和

```js
const sum = (...arr) => [...arr].reduce((acc, val) => acc + val, 0);
```

```js
sum(1, 2, 3, 4); // 10
sum(...[1, 2, 3, 4]); // 10
```

### sumBy

按照 `fn` 规则求和

```js
const sumBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => acc + val, 0);
```

```js
sumBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], o => o.n); // 20
sumBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 20
```

### sumPower

求次方和，默认平方和

```js
const sumPower = (end, power = 2, start = 1) =>
  Array(end + 1 - start)
    .fill(0)
    .map((x, i) => (i + start) ** power)
    .reduce((a, b) => a + b, 0);
```

```js
sumPower(10); // 385
sumPower(10, 3); // 3025
sumPower(10, 3, 5); // 2925
```

### toSafeInteger

将数字转化成安全的整数

`Number.MAX_SAFE_INTEGER`

`Number.MIN_SAFE_INTEGER`

```js
const toSafeInteger = num =>
  Math.round(Math.max(Math.min(num, Number.MAX_SAFE_INTEGER), Number.MIN_SAFE_INTEGER));
```

```js
toSafeInteger('3.2'); // 3
toSafeInteger(Infinity); // 9007199254740991
```

</details>

## 📦 node

<details>

<summary>展开</summary>

### atob

对使用 `base-64` 编码的字符串进行解码

用给定的字串创建一个 `Buffer`，指定编码为 `base64`，随后使用 `Buffer.toString('binary')` 解码。

```js
const atob = str => Buffer.from(str, 'base64').toString('binary');
```

```js
atob('Zm9vYmFy'); // 'foobar'
```

### btoa

从一个字符串（其每个字符都被视作一字节二进制数据处理）创建一个 `Base64` 编码的 `ASCII` 字串，

用给定的字串创建一个 `Buffer`，指定编码为 `binary`，随后使用 `Buffer.toString('base64')` 解码。

```js
const btoa = str => Buffer.from(str, 'binary').toString('base64');
```

```js
btoa('foobar'); // 'Zm9vYmFy'
```

### colorize

将特殊字符添加到文本中以在控制台中打印颜色 (联合 `console.log()` 使用).

对于背景色，在字符串最后加上一些特殊字符来设置背景色

```js
const colorize = (...args) => ({
  black: `\x1b[30m${args.join(' ')}`,
  red: `\x1b[31m${args.join(' ')}`,
  green: `\x1b[32m${args.join(' ')}`,
  yellow: `\x1b[33m${args.join(' ')}`,
  blue: `\x1b[34m${args.join(' ')}`,
  magenta: `\x1b[35m${args.join(' ')}`,
  cyan: `\x1b[36m${args.join(' ')}`,
  white: `\x1b[37m${args.join(' ')}`,
  bgBlack: `\x1b[40m${args.join(' ')}\x1b[0m`,
  bgRed: `\x1b[41m${args.join(' ')}\x1b[0m`,
  bgGreen: `\x1b[42m${args.join(' ')}\x1b[0m`,
  bgYellow: `\x1b[43m${args.join(' ')}\x1b[0m`,
  bgBlue: `\x1b[44m${args.join(' ')}\x1b[0m`,
  bgMagenta: `\x1b[45m${args.join(' ')}\x1b[0m`,
  bgCyan: `\x1b[46m${args.join(' ')}\x1b[0m`,
  bgWhite: `\x1b[47m${args.join(' ')}\x1b[0m`
});
```

```js
console.log(colorize('foo').red); // 'foo' (red letters)
console.log(colorize('foo', 'bar').bgBlue); // 'foo bar' (blue background)
console.log(colorize(colorize('foo').yellow, colorize('foo').green).bgWhite); // 'foo bar' (first word in yellow letters, second word in green letters, white background for both)
```

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

### hashNode

用 [SHA-256](https://en.wikipedia.org/wiki/SHA-2) 算法创建某个值的哈希值，返回一个 `Promise`

使用 `crypto` API（兼容性不佳）来创建

```js
const crypto = require('crypto');
const hashNode = val =>
  new Promise(resolve =>
    setTimeout(
      () =>
        resolve(
          crypto
            .createHash('sha256')
            .update(val)
            .digest('hex')
        ),
      0
    )
  );
```

```js
hashNode(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } })).then(console.log); // '04aa106279f5977f59f9067fa9712afc4aedc6f5862a8defc34552d8c7206393'
```

### isDuplexStream

检查给定的参数是双向流

```js
const isDuplexStream = val =>
  val !== null &&
  typeof val === 'object' &&
  typeof val.pipe === 'function' &&
  typeof val._read === 'function' &&
  typeof val._readableState === 'object' &&
  typeof val._write === 'function' &&
  typeof val._writableState === 'object';
```

```js
const Stream = require('stream');
isDuplexStream(new Stream.Duplex()); // true
```

### isReadableStream

是否是可读流

```js
const isReadableStream = val =>
  val !== null &&
  typeof val === 'object' &&
  typeof val.pipe === 'function' &&
  typeof val._read === 'function' &&
  typeof val._readableState === 'object';
```

```js
const fs = require('fs');
isReadableStream(fs.createReadStream('test.txt')); // true
```

### isStream

是否是流

检测 `pipe` 属性

```js
const isStream = val => val !== null && typeof val === 'object' && typeof val.pipe === 'function';
```

```js
const fs = require('fs');
isStream(fs.createReadStream('test.txt')); // true
```

### isTravisCI

检测当前环境是否是 [Travis CI](https://travis-ci.org/).

是否有环境变量 `TRAVIS` 和 `CI`  ([reference](https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables)).

```js
const isTravisCI = () => 'TRAVIS' in process.env && 'CI' in process.env;
```

```js
isTravisCI(); // true (if code is running on Travis CI)
```

### isWritableStream

是否是可写流

```js
const isWritableStream = val =>
  val !== null &&
  typeof val === 'object' &&
  typeof val.pipe === 'function' &&
  typeof val._write === 'function' &&
  typeof val._writableState === 'object';
```

```js
const fs = require('fs');
isWritableStream(fs.createWriteStream('test.txt')); // true
```

### JSONToFile

将 `JSON` 对象写入文件

使用 `fs.writeFile()` 和 `JSON.stringify()`

```js
const fs = require('fs');
const JSONToFile = (obj, filename) =>
  fs.writeFile(`${filename}.json`, JSON.stringify(obj, null, 2));
```

```js
JSONToFile({ test: 'is passed' }, 'testJsonFile'); // writes the object to 'testJsonFile.json'
```

### readFileLines

返回文件内容按行划分的数组

使用 `readFileSync` 创建 `Buffer`

使用 `toString(encoding)` 将 `Buffer` 转成字串

```js
const fs = require('fs');
const readFileLines = filename =>
  fs
    .readFileSync(filename)
    .toString('UTF8')
    .split('\n');
```

```js
/*
contents of test.txt :
  line1
  line2
  line3
  ___________________________
*/
let arr = readFileLines('test.txt');
console.log(arr); // ['line1', 'line2', 'line3']
```

### untildify

转换波浪开头的路径为绝对路径

```js
const untildify = str => str.replace(/^~($|\/|\\)/, `${require('os').homedir()}$1`);
```

```js
untildify('~/node'); // '/Users/aUser/node'
```

### UUIDGeneratorNode

生成 `Node.JS` 环境下的 `UUID`

使用 `crypto` API, 遵从 [RFC4122](https://www.ietf.org/rfc/rfc4122.txt) version 4.

```js
const crypto = require('crypto');
const UUIDGeneratorNode = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  );
```

```js
UUIDGeneratorNode(); // '79c7c136-60ee-40a2-beb2-856f1feabefc'
```

</details>

## 🗃️ object

<details>

<summary>展开</summary>

### bindAll

将对象方法绑定到该对象自身，覆写已经存在的方法

使用 `Array.prototype.forEach()` 和 `Function.prototype.apply()` 将指定的每个对象方法 `fn` 绑定到对象上

```js
const bindAll = (obj, ...fns) =>
  fns.forEach(
    fn => (
      (f = obj[fn]),
      (obj[fn] = function() {
        return f.apply(obj);
      })
    )
  );
```

```js
var view = {
  label: 'docs',
  click: function() {
    console.log('clicked ' + this.label);
  }
};
bindAll(view, 'click');
jQuery(element).on('click', view.click); // Logs 'clicked docs' when clicked.
```

### deepClone

深度克隆一个对象

使用迭代

使用 `Object.assign()` 和一个空对象(`{}`) 创建一个浅复制

使用 `Object.keys()` 和 `Array.prototype.forEach()` 检查哪些键值对需要进行深度克隆

```js
const deepClone = obj => {
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  return Array.isArray(obj) ? (clone.length = obj.length) && Array.from(clone) : clone;
};
```

```js
const a = { foo: 'bar', obj: { a: 1, b: 2 } };
const b = deepClone(a); // a !== b, a.obj !== b.obj
```

### deepFreeze

深度冻结一个对象

在所有非冻结的属性上迭代调用 `Object.freeze(obj)`

```js
const deepFreeze = obj =>
  Object.keys(obj).forEach(
    prop =>
      !(obj[prop] instanceof Object) || Object.isFrozen(obj[prop]) ? null : deepFreeze(obj[prop])
  ) || Object.freeze(obj);
```

```js
'use strict';

const o = deepFreeze([1, [2, 3]]);

o[0] = 3; // not allowed
o[1][0] = 4; // not allowed as well
```

### deepMapKeys

深度处理对象的键名

使用 `Object.keys(obj)` 遍历处理对象的键

使用 `Array.prototype.reduce()` 创建新的对象，其键为经过 `fn` 处理后的键，值为原来的键值

```js
const deepMapKeys = (obj, f) =>
  Array.isArray(obj)
    ? obj.map(val => deepMapKeys(val, f))
    : typeof obj === 'object'
      ? Object.keys(obj).reduce((acc, current) => {
        const val = obj[current];
        acc[f(current)] =
            val !== null && typeof val === 'object' ? deepMapKeys(val, f) : (acc[f(current)] = val);
        return acc;
      }, {})
      : obj;
```

```js
const obj = {
  foo: '1',
  nested: {
    child: {
      withArray: [
        {
          grandChild: ['hello']
        }
      ]
    }
  }
};
const upperKeysObj = deepMapKeys(obj, key => key.toUpperCase());
/*
{
  "FOO":"1",
  "NESTED":{
    "CHILD":{
      "WITHARRAY":[
        {
          "GRANDCHILD":[ 'hello' ]
        }
      ]
    }
  }
}
*/
```

### defaults

给对象中所有的 `undefined` 属性赋默认值

使用 `Object.assign()` 依据原来的 `obj`(保证键的顺序)创建一个新对象

使用 `Array.prototype.reverse()` 和扩展运算符 `...` 进行组合，左边优先所以 `reverse` 到最后

最后再用 `obj` 中的默认值进行覆盖

```js
const defaults = (obj, ...defs) => Object.assign({}, obj, ...defs.reverse(), obj);
```

```js
defaults({ a: 1 }, { b: 2 }, { b: 6 }, { a: 3 }); // { a: 1, b: 2 }
```

### dig

返回给定键在嵌套 `JSON` 对象中对应的值

使用 `in` 查看 `obj` 中是否存在 `target`

找到了就直接返回 `obj[target]`

否则 `Object.values(obj)` 和 `Array.prototype.reduce()` 来递归地调用 `dig` 方法直到第一对符合要求的键值对被发现

```js
const dig = (obj, target) =>
  target in obj
    ? obj[target]
    : Object.values(obj).reduce((acc, val) => {
      if (acc !== undefined) return acc;
      if (typeof val === 'object') return dig(val, target);
    }, undefined);
```

```js
const data = {
  level1: {
    level2: {
      level3: 'some data'
    }
  }
};
dig(data, 'level3'); // 'some data'
dig(data, 'level4'); // undefined
```

### equals

深度比较

```js
const equals = (a, b) => {
  // 对于基本类型，直接使用全等符号 `===`
  if (a === b) return true;
  // 对于 `Date` 对象，使用 `Date.getTime()` 获得的值进行比较
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  // typeof null === 'object'
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
  if (a === null || a === undefined || b === null || b === undefined) return false;
  // 检查 prototype 属性是否相同
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  // 先看属性数目
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k])); // 进行迭代
};
```

```js
equals({ a: [2, { e: 3 }], b: [4], c: 'foo' }, { a: [2, { e: 3 }], b: [4], c: 'foo' }); // true
```

### findKey

返回第一个满足测试函数的值的键名，没有找到的话就返回 `undefined`

使用 `Object.keys(obj)` 和 `Array.prototype.find()` 

```js
const findKey = (obj, fn) => Object.keys(obj).find(key => fn(obj[key], key, obj));
```

```js
findKey(
  {
    barney: { age: 36, active: true },
    fred: { age: 40, active: false },
    pebbles: { age: 1, active: true }
  },
  o => o['active']
); // 'barney'
```

### findLastKey

返回使得函数返回真值的最后一个元素的键

```js
const findLastKey = (obj, fn) =>
  Object.keys(obj)
    .reverse()
    .find(key => fn(obj[key], key, obj));
```

```js
findLastKey(
  {
    barney: { age: 36, active: true },
    fred: { age: 40, active: false },
    pebbles: { age: 1, active: true }
  },
  o => o['active']
); // 'pebbles'
```

### flattenObject

以路径为键名展平一个对象

使用递归

```js
const flattenObject = (obj, prefix = '') =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = obj[k];
    return acc;
  }, {});
```

```js
flattenObject({ a: { b: { c: 1 } }, d: 1 }); // { 'a.b.c': 1, d: 1 }
```

### forOwn

遍历对象的自身属性（own properties）并执行函数

`Object.keys` 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 `Symbol` 属性）的键名

```js
const forOwn = (obj, fn) => Object.keys(obj).forEach(key => fn(obj[key], key, obj));
```

```js
forOwn({ foo: 'bar', a: 1 }, v => console.log(v)); // 'bar', 1
```

### forOwnRight

反向遍历对象的自身属性（own properties）并执行函数

```js
const forOwnRight = (obj, fn) =>
  Object.keys(obj)
    .reverse()
    .forEach(key => fn(obj[key], key, obj));
```

```js
forOwnRight({ foo: 'bar', a: 1 }, v => console.log(v)); // 1, 'bar'
```

### functions

返回对象自身的（可以选择包含继承的）可枚举属性中是函数的那些属性名

自身属性用 `Object.keys(obj)`

继承的对象用 `Object.getPrototypeOf(obj)`，然后再对其使用 `Object.keys(obj)`

```js
const functions = (obj, inherited = false) =>
  (inherited
    ? [...Object.keys(obj), ...Object.keys(Object.getPrototypeOf(obj))]
    : Object.keys(obj)
  ).filter(key => typeof obj[key] === 'function');
```

```js
function Foo() {
  this.a = () => 1;
  this.b = () => 2;
}
Foo.prototype.c = () => 3;
functions(new Foo()); // ['a', 'b']
functions(new Foo(), true); // ['a', 'b', 'c']
```

### get

通过检索字符串来获得对象的值

```js
const get = (from, ...selectors) =>
  [...selectors].map(s =>
    s
      .replace(/\[([^\[\]]*)\]/g, '.$1.') // 替换中括号为 .
      .split('.')
      .filter(t => t !== '')
      .reduce((prev, cur) => prev && prev[cur], from)
  );
```

```js
const obj = { selector: { to: { val: 'val to select' } }, target: [1, 2, { a: 'test' }] };
get(obj, 'selector.to.val', 'target[0]', 'target[2].a'); // ['val to select', 1, 'test']
```

### invertKeyValues

倒置一个对象的键值对，可以传入 `fn` 来生成新的键名

```js
const invertKeyValues = (obj, fn) =>
  Object.keys(obj).reduce((acc, key) => {
    const val = fn ? fn(obj[key]) : obj[key];
    acc[val] = acc[val] || [];
    acc[val].push(key);
    return acc;
  }, {});
```

```js
invertKeyValues({ a: 1, b: 2, c: 1 }); // { 1: [ 'a', 'c' ], 2: [ 'b' ] }
invertKeyValues({ a: 1, b: 2, c: 1 }, value => 'group' + value); // { group1: [ 'a', 'c' ], group2: [ 'b' ] }
```

### lowercaseKeys

将指定对象的键名转换成小写形式

```js
const lowercaseKeys = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] = obj[key];
    return acc;
  }, {});
```

```js
const myObj = { Name: 'Adam', sUrnAME: 'Smith' };
const myObjLower = lowercaseKeys(myObj); // {name: 'Adam', surname: 'Smith'};
```

### mapKeys

根据 `fn` 重新生成对象的键名

```js
const mapKeys = (obj, fn) =>
  Object.keys(obj).reduce((acc, k) => {
    acc[fn(obj[k], k, obj)] = obj[k];
    return acc;
  }, {});
```

```js
mapKeys({ a: 1, b: 2 }, (val, key) => key + val); // { a1: 1, b2: 2 }
```

### mapValues

键为原来的键，值为原来的值经过函数处理之后生成的值

```js
const mapValues = (obj, fn) =>
  Object.keys(obj).reduce((acc, k) => {
    acc[k] = fn(obj[k], k, obj);
    return acc;
  }, {});
```

```js
const users = {
  fred: { user: 'fred', age: 40 },
  pebbles: { user: 'pebbles', age: 1 }
};
mapValues(users, u => u.age); // { fred: 40, pebbles: 1 }
```

### matches

第一个对象是第二个对象的超集则返回真

```js
const matches = (obj, source) =>
  Object.keys(source).every(key => obj.hasOwnProperty(key) && obj[key] === source[key]);
```

```js
matches({ age: 25, hair: 'long', beard: true }, { hair: 'long', beard: true }); // true
matches({ hair: 'long', beard: true }, { age: 25, hair: 'long', beard: true }); // false
```

### matchesWith

第一个对象键值处理结果是第二个对象键值处理结果的超集则返回真

```js
const matchesWith = (obj, source, fn) =>
  Object.keys(source).every(
    key =>
      obj.hasOwnProperty(key) && fn
        ? fn(obj[key], source[key], key, obj, source)
        : obj[key] == source[key]
  );
```

```js
const isGreeting = val => /^h(?:i|ello)$/.test(val);
matchesWith(
  { greeting: 'hello' },
  { greeting: 'hi' },
  (oV, sV) => isGreeting(oV) && isGreeting(sV)
); // true
```

### merge

合并多个对象

相同键名会把基本类型的值合并到数组里去

```js
const merge = (...objs) =>
  [...objs].reduce(
    (acc, obj) =>
      Object.keys(obj).reduce((a, k) => {
        acc[k] = acc.hasOwnProperty(k) ? [].concat(acc[k]).concat(obj[k]) : obj[k];
        return acc;
      }, {}),
    {}
  );
```

```js
const object = {
  a: [{ x: 2 }, { y: 4 }],
  b: 1
};
const other = {
  a: { z: 3 },
  b: [2, 3],
  c: 'foo'
};
merge(object, other); // { a: [ { x: 2 }, { y: 4 }, { z: 3 } ], b: [ 1, 2, 3 ], c: 'foo' }
```

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

### objectFromPairs

根据给定的键值对创建一个对象

```js
const objectFromPairs = arr => arr.reduce((a, [key, val]) => ((a[key] = val), a), {});
```

```js
objectFromPairs([['a', 1], ['b', 2]]); // {a: 1, b: 2}
```

### objectToPairs

根据对象创建一个键值对数组

```js
const objectToPairs = obj => Object.keys(obj).map(k => [k, obj[k]]);
```

```js
objectToPairs({ a: 1, b: 2 }); // [ ['a', 1], ['b', 2] ]
```

### omit

返回除指定属性之外的属性组成的对象

```js
const omit = (obj, arr) =>
  Object.keys(obj)
    .filter(k => !arr.includes(k)) // 过滤出不在 arr 中列出的属性
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {}); // 利用这些属性创建个新对象
```

```js
omit({ a: 1, b: '2', c: 3 }, ['b']); // { 'a': 1, 'c': 3 }
```

### omitBy

返回除指定执行结果之外的属性组成的对象

```js
const omitBy = (obj, fn) =>
  Object.keys(obj)
    .filter(k => !fn(obj[k], k))
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {});
```

```js
omitBy({ a: 1, b: '2', c: 3 }, x => typeof x === 'number'); // { b: '2' }
```

### orderBy

将对象数组按照指定属性优先级排序，可以指定各个属性的排序是升序还是降序

```js
const orderBy = (arr, props, orders) =>
  [...arr].sort((a, b) =>
    props.reduce((acc, prop, i) => {
      if (acc === 0) {
        const [p1, p2] = orders && orders[i] === 'desc' ? [b[prop], a[prop]] : [a[prop], b[prop]];
        acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
      }
      return acc;
    }, 0)
  );
```

```js
const users = [{ name: 'fred', age: 48 }, { name: 'barney', age: 36 }, { name: 'fred', age: 40 }];
orderBy(users, ['name', 'age'], ['asc', 'desc']); // [{name: 'barney', age: 36}, {name: 'fred', age: 48}, {name: 'fred', age: 40}]
orderBy(users, ['name', 'age']); // [{name: 'barney', age: 36}, {name: 'fred', age: 40}, {name: 'fred', age: 48}]
```

### pick

挑出指定的属性组成一个新对象

```js
const pick = (obj, arr) =>
  arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});
```

```js
pick({ a: 1, b: '2', c: 3 }, ['a', 'c']); // { 'a': 1, 'c': 3 }
```

### pickBy

根据指定的方法挑出一些属性组成一个新对象

```js
const pickBy = (obj, fn) =>
  Object.keys(obj)
    .filter(k => fn(obj[k], k))
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {});
```

```js
pickBy({ a: 1, b: '2', c: 3 }, x => typeof x === 'number'); // { 'a': 1, 'c': 3 }
```

### renameKeys

替换键名

```js
const renameKeys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc, // 还有这种方式
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  );
```

```js
const obj = { name: 'Bobo', job: 'Front-End Master', shoeSize: 100 };
renameKeys({ name: 'firstName', job: 'passion' }, obj); // { firstName: 'Bobo', passion: 'Front-End Master', shoeSize: 100 }
```

### shallowClone

浅复制

使用 `Object.assign()`

```js
const shallowClone = obj => Object.assign({}, obj);
```

```js
const a = { x: true, y: 1 };
const b = shallowClone(a); // a !== b
```

### size

获取数组，对象和字串的长度

```js
const size = val =>
  Array.isArray(val)
    ? val.length
    : val && typeof val === 'object'
      ? val.size || val.length || Object.keys(val).length
      : typeof val === 'string'
        ? new Blob([val]).size
        : 0;
```

```js
size([1, 2, 3, 4, 5]); // 5
size('size'); // 4
size({ one: 1, two: 2, three: 3 }); // 3
```

### transform

对累加器和对象中的每个键应用一个函数（从左到右）。

```js
const transform = (obj, fn, acc) => Object.keys(obj).reduce((a, k) => fn(a, obj[k], k, obj), acc);
```

```js
transform(
  { a: 1, b: 2, c: 1 },
  (r, v, k) => {
    (r[v] || (r[v] = [])).push(k);
    return r;
  },
  {}
); // { '1': ['a', 'c'], '2': ['b'] }
```

### truthCheckCollection

集合元素验真

```js
const truthCheckCollection = (collection, pre) => collection.every(obj => obj[pre]);
```

```js
truthCheckCollection([{ user: 'Tinky-Winky', sex: 'male' }, { user: 'Dipsy', sex: 'male' }], 'sex'); // true
```

### unflattenObject

根据属性路径构造对象

```js
const unflattenObject = obj =>
  Object.keys(obj).reduce((acc, k) => {
    if (k.indexOf('.') !== -1) {
      const keys = k.split('.');
      Object.assign(
        acc,
        JSON.parse( // 解析json字串来生成对象
          '{' +
            keys.map((v, i) => (i !== keys.length - 1 ? `"${v}":{` : `"${v}":`)).join('') +
            obj[k] +
            '}'.repeat(keys.length)
        )
      );
    } else acc[k] = obj[k];
    return acc;
  }, {});
```

```js
unflattenObject({ 'a.b.c': 1, d: 1 }); // { a: { b: { c: 1 } }, d: 1 }
```

</details>

## 📜 string

<details>

<summary>展开</summary>

### byteSize

返回字符串的字节长度

将给定的字符串转换成 [`Blob` 对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 并返回它的 `size` 属性

```js
const byteSize = str => new Blob([str]).size;
```

```js
byteSize('😀'); // 4
byteSize('Hello World'); // 11
```

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

### capitalizeEveryWord

将字符串中的每个单词首字母转换成大写形式

使用 `String.prototype.replace()` 匹配每个单词的首字母，并使用 `String.prototype.toUpperCase()` 将其转换成大写形式

```js
const capitalizeEveryWord = str => str.replace(/\b[a-z]/g, char => char.toUpperCase());
```

```js
capitalizeEveryWord('hello world!'); // 'Hello World!'
```

### compactWhitespace

返回一个去除了多余空白字符的字符串

使用 `String.prototype.replace()` 和一个正则表达式替换出现 2 次及以上空白字符为 1 个空白字符

```js
const compactWhitespace = str => str.replace(/\s{2,}/g, ' ');
```

```js
compactWhitespace('Lorem    Ipsum'); // 'Lorem Ipsum'
compactWhitespace('Lorem \n Ipsum'); // 'Lorem Ipsum'
```

### CSVToArray

将一个用逗号分隔的字符串转换成二维数组。

```js
const CSVToArray = (data, delimiter = ',', omitFirstRow = false) =>
  data
    .slice(omitFirstRow ? data.indexOf('\n') + 1 : 0)
    .split('\n')
    .map(v => v.split(delimiter));
```

```js
CSVToArray('a,b\nc,d'); // [['a','b'],['c','d']];
CSVToArray('a;b\nc;d', ';'); // [['a','b'],['c','d']];
CSVToArray('col1,col2\na,b\nc,d', ',', true); // [['a','b'],['c','d']];
```

### CSVToJSON

将一个用逗号分隔的字符串转换成二维**对象**数组。

第一行作为对象键名

使用 `Array.prototype.reduce()` 创建每一行的值

```js
const CSVToJSON = (data, delimiter = ',') => {
  const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
  return data
    .slice(data.indexOf('\n') + 1)
    .split('\n')
    .map(v => {
      const values = v.split(delimiter);
      return titles.reduce((obj, title, index) => ((obj[title] = values[index]), obj), {});
    });
};
```

```js
CSVToJSON('col1,col2\na,b\nc,d'); // [{'col1': 'a', 'col2': 'b'}, {'col1': 'c', 'col2': 'd'}];
CSVToJSON('col1;col2\na;b\nc;d', ';'); // [{'col1': 'a', 'col2': 'b'}, {'col1': 'c', 'col2': 'd'}];
```

### decapitalize

首字母改成小写

```js
const decapitalize = ([first, ...rest], upperRest = false) =>
  first.toLowerCase() + (upperRest ? rest.join('').toUpperCase() : rest.join(''));
```

```js
decapitalize('FooBar'); // 'fooBar'
decapitalize('FooBar', true); // 'fOOBAR'
```

### escapeHTML

escape 用于 HTML 中的特殊字符

在 `String.prototype.replace()` 的第二个参数中进行替换

```js
const escapeHTML = str =>
  str.replace(
    /[&<>'"]/g,
    tag =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
  );
```

```js
escapeHTML('<a href="#">Me & you</a>'); // '&lt;a href=&quot;#&quot;&gt;Me &amp; you&lt;/a&gt;'
```

### escapeRegExp

将一个字符串转换成可以用在正则表达式中的样式

使用 `String.prototype.replace()`

```js
const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
```

```js
escapeRegExp('(test)'); // \\(test\\)
```

### fromCamelCase

将驼峰形式的字符串转换成正常形式，可以指定原先驼峰分隔处的分隔符（默认为 `_`）

```js
const fromCamelCase = (str, separator = '_') =>
  str
    .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
    .toLowerCase();
```

```js
fromCamelCase('someDatabaseFieldName', ' '); // 'some database field name'
fromCamelCase('someLabelThatNeedsToBeCamelized', '-'); // 'some-label-that-needs-to-be-camelized'
fromCamelCase('someJavascriptProperty', '_'); // 'some_javascript_property'
```

### indentString

缩进每行字串

匹配每行的开始处并加上缩进部分

```js
const indentString = (str, count, indent = ' ') => str.replace(/^/gm, indent.repeat(count));
```

```js
indentString('Lorem\nIpsum', 2); // '  Lorem\n  Ipsum'
indentString('Lorem\nIpsum', 2, '_'); // '__Lorem\n__Ipsum'
```

### isAbsoluteURL

检测 `URL` 是否是绝对地址

```js
const isAbsoluteURL = str => /^[a-z][a-z0-9+.-]*:/.test(str);
```

```js
isAbsoluteURL('https://google.com'); // true
isAbsoluteURL('ftp://www.myserver.net'); // true
isAbsoluteURL('/foo/bar'); // false
```

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

### isLowerCase

检查字串是否是小写形式

```js
const isLowerCase = str => str === str.toLowerCase();
```

```js
isLowerCase('abc'); // true
isLowerCase('a3@$'); // true
isLowerCase('Ab4'); // false
```

### isUpperCase

是否是大写形式

```js
const isUpperCase = str => str === str.toUpperCase();
```

```js
isUpperCase('ABC'); // true
isLowerCase('A3@$'); // true
isLowerCase('aB4'); // false
```

### mapString

对指定字串的每个字符执行某一函数 `fn` 并将结果拼接成新的字串

```js
const mapString = (str, fn) =>
  str
    .split('')
    .map((c, i) => fn(c, i, str))
    .join('');
```

```js
mapString('lorem ipsum', c => c.toUpperCase()); // 'LOREM IPSUM'
```

### mask

将字符串除了最后 `num` 位的字串替换成 `mask`, `num` 可以为负

```js
const mask = (cc, num = 4, mask = '*') => `${cc}`.slice(-num).padStart(`${cc}`.length, mask);
```

```js
mask(1234567890); // '******7890'
mask(1234567890, 3); // '*******890'
mask(1234567890, -4, '$'); // '$$$$567890'
```

### pad

在指定字符串两边补全特殊的字符

使用 `String.padStart()` 和 `String.padEnd()`

```js
const pad = (str, length, char = ' ') =>
  str.padStart((str.length + length) / 2, char).padEnd(length, char);
```

```js
pad('cat', 8); // '  cat   '
pad(String(42), 6, '0'); // '004200'
pad('foobar', 3); // 'foobar'
```

### palindrome

回文结构

不区分大小写，不关注特殊字符

```js
const palindrome = str => {
  const s = str.toLowerCase().replace(/[\W_]/g, '');
  return s === [...s].reverse().join('');
};
```

```js
palindrome('taco cat'); // true
```

### pluralize

根据输入的数字选择性的返回单词的单数或复数，可以指定 `pliral` 的值（针对不仅仅在后面加上 `s` 来表示复数形式）

```js
const pluralize = (val, word, plural = word + 's') => {
  const _pluralize = (num, word, plural = word + 's') =>
    [1, -1].includes(Number(num)) ? word : plural;
  if (typeof val === 'object') return (num, word) => _pluralize(num, word, val[word]);
  return _pluralize(val, word, plural);
};
```

```js
pluralize(0, 'apple'); // 'apples'
pluralize(1, 'apple'); // 'apple'
pluralize(2, 'apple'); // 'apples'
pluralize(2, 'person', 'people'); // 'people'

const PLURALS = {
  person: 'people',
  radius: 'radii'
};
const autoPluralize = pluralize(PLURALS);
autoPluralize(2, 'person'); // 'people'
```

### removeNonASCII

删除不可打印的ASCII字符

```js
const removeNonASCII = str => str.replace(/[^\x20-\x7E]/g, '');
```

```js
removeNonASCII('äÄçÇéÉêlorem-ipsumöÖÐþúÚ'); // 'lorem-ipsum'
```

### reverseString

翻转字串

```js
const reverseString = str => [...str].reverse().join('');
```

```js
reverseString('foobar'); // 'raboof'
```

### sortCharactersInString

排列字串中的字符

使用 `String.localeCompare()`

```js
const sortCharactersInString = str => [...str].sort((a, b) => a.localeCompare(b)).join('');
```

```js
sortCharactersInString('cabbage'); // 'aabbceg'
```

### splitLines

将多行字串转成按行划分的数组

```js
const splitLines = str => str.split(/\r?\n/);
```

```js
splitLines('This\nis a\nmultiline\nstring.\n'); // ['This', 'is a', 'multiline', 'string.' , '']
```

### stringPermutations

**会有性能问题**

生成字符串的所有排列（包含重复项）

```js
const stringPermutations = str => {
  if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str
    .split('')
    .reduce(
      (acc, letter, i) =>
        acc.concat(stringPermutations(str.slice(0, i) + str.slice(i + 1)).map(val => letter + val)),
      []
    );
};
```

```js
stringPermutations('abc'); // ['abc','acb','bac','bca','cab','cba']
```

### stripHTMLTags

移除字串中的 `HTML/XML` 标签

```js
const stripHTMLTags = str => str.replace(/<[^>]*>/g, '');
```

```js
stripHTMLTags('<p><em>lorem</em> <strong>ipsum</strong></p>'); // 'lorem ipsum'
```

### toCamelCase

将字符串转化成驼峰形式

```js
const toCamelCase = str => {
  let s =
    str &&
    str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
      .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};
```

```js
toCamelCase('some_database_field_name'); // 'someDatabaseFieldName'
toCamelCase('Some label that needs to be camelized'); // 'someLabelThatNeedsToBeCamelized'
toCamelCase('some-javascript-property'); // 'someJavascriptProperty'
toCamelCase('some-mixed_string with spaces_underscores-and-hyphens'); // 'someMixedStringWithSpacesUnderscoresAndHyphens'
```

### toKebabCase

将字串转成 `KebabCase` 形式

```js
const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-');
```

```js
toKebabCase('camelCase'); // 'camel-case'
toKebabCase('some text'); // 'some-text'
toKebabCase('some-mixed_string With spaces_underscores-and-hyphens'); // 'some-mixed-string-with-spaces-underscores-and-hyphens'
toKebabCase('AllThe-small Things'); // "all-the-small-things"
toKebabCase('IAmListeningToFMWhileLoadingDifferentURLOnMyBrowserAndAlsoEditingSomeXMLAndHTML'); // "i-am-listening-to-fm-while-loading-different-url-on-my-browser-and-also-editing-xml-and-html"
```

### toSnakeCase

将字串转换成`snake case`

```js
const toSnakeCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');
```

```js
toSnakeCase('camelCase'); // 'camel_case'
toSnakeCase('some text'); // 'some_text'
toSnakeCase('some-mixed_string With spaces_underscores-and-hyphens'); // 'some_mixed_string_with_spaces_underscores_and_hyphens'
toSnakeCase('AllThe-small Things'); // "all_the_smal_things"
toSnakeCase('IAmListeningToFMWhileLoadingDifferentURLOnMyBrowserAndAlsoEditingSomeXMLAndHTML'); // "i_am_listening_to_fm_while_loading_different_url_on_my_browser_and_also_editing_some_xml_and_html"
```

### toTitleCase

将字串转化成 `title case`

分割成首字母大写的单词

```js
const toTitleCase = str =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.charAt(0).toUpperCase() + x.slice(1))
    .join(' ');
```

```js
toTitleCase('some_database_field_name'); // 'Some Database Field Name'
toTitleCase('Some label that needs to be title-cased'); // 'Some Label That Needs To Be Title Cased'
toTitleCase('some-package-name'); // 'Some Package Name'
toTitleCase('some-mixed_string with spaces_underscores-and-hyphens'); // 'Some Mixed String With Spaces Underscores And Hyphens'
```

### truncateString

缩略显示字串

```js
const truncateString = (str, num) =>
  str.length > num ? str.slice(0, num > 3 ? num - 3 : num) + '...' : str;
```

```js
truncateString('boomerang', 7); // 'boom...'
```

### unescapeHTML

反 escape HTML

```js
const unescapeHTML = str =>
  str.replace(
    /&amp;|&lt;|&gt;|&#39;|&quot;/g,
    tag =>
      ({
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
        '&quot;': '"'
      }[tag] || tag)
  );
```

```js
unescapeHTML('&lt;a href=&quot;#&quot;&gt;Me &amp; you&lt;/a&gt;'); // '<a href="#">Me & you</a>'
```

### URLJoin

合并 url 片段

```js
const URLJoin = (...args) =>
  args
    .join('/')
    .replace(/[\/]+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?');
```

```js
URLJoin('http://www.google.com', 'a', '/b/cd', '?foo=123', '?bar=foo'); // 'http://www.google.com/a/b/cd?foo=123&bar=foo'
```

### words

将字串分割成单词组成的数组

```js
const words = (str, pattern = /[^a-zA-Z-]+/) => str.split(pattern).filter(Boolean);
```

```js
words('I love javaScript!!'); // ["I", "love", "javaScript"]
words('python, javaScript & coffee'); // ["python", "javaScript", "coffee"]
```

</details>

## 📃 type

<details>

<summary>展开</summary>

### getType

获取一个值得原生类型

```js
const getType = v =>
  v === undefined ? 'undefined' : v === null ? 'null' : v.constructor.name.toLowerCase();
```

```js
getType(new Set([1, 2, 3])); // 'set'
```

### is

类型检测

```js
const is = (type, val) => ![, null].includes(val) && val.constructor === type;
```

```js
is(Array, [1]); // true
is(ArrayBuffer, new ArrayBuffer()); // true
is(Map, new Map()); // true
is(RegExp, /./g); // true
is(Set, new Set()); // true
is(WeakMap, new WeakMap()); // true
is(WeakSet, new WeakSet()); // true
is(String, ''); // true
is(String, new String('')); // true
is(Number, 1); // true
is(Number, new Number(1)); // true
is(Boolean, true); // true
is(Boolean, new Boolean(true)); // true
```

### isArrayLike

检测是否是类数组对象（如，iterable 可迭代对象）

非 `null` 且它的 `Symbol.iterator` 属性是一个函数

```js
const isArrayLike = obj => obj != null && typeof obj[Symbol.iterator] === 'function';
```

```js
isArrayLike(document.querySelectorAll('.className')); // true
isArrayLike('abc'); // true
isArrayLike(null); // false
```

### isBoolean

检查元素是否是原生的 `boolean` 元素

```js
const isBoolean = val => typeof val === 'boolean';
```

```js
isBoolean(null); // false
isBoolean(false); // true
```

### isEmpty

是否是空对象，空集合，空 `Map`，空 `Set`

```js
const isEmpty = val => val == null || !(Object.keys(val) || val).length;
```

```js
isEmpty(new Map()); // true
isEmpty(new Set()); // true
isEmpty([]); // true
isEmpty({}); // true
isEmpty(''); // true
isEmpty([1, 2]); // false
isEmpty({ a: 1, b: 2 }); // false
isEmpty('text'); // false
isEmpty(123); // true - type is not considered a collection
isEmpty(true); // true - type is not considered a collection
```

### isFunction

是否是函数

```js
const isFunction = val => typeof val === 'function';
```

```js
isFunction('x'); // false
isFunction(x => x); // true
```

### isNil

是否是 `null` 或者 `undefined`

```js
const isNil = val => val === undefined || val === null;
```

```js
isNil(null); // true
isNil(undefined); // true
```

### isNull

是否是 `null`

```js
const isNull = val => val === null;
```

```js
isNull(null); // true
```

### isNumber

是否是数字

```js
const isNumber = val => typeof val === 'number';
```

```js
isNumber('1'); // false
isNumber(1); // true
```

### isObject

是否是对象

```js
const isObject = obj => obj === Object(obj);
```

```js
isObject([1, 2, 3, 4]); // true
isObject([]); // true
isObject(['Hello!']); // true
isObject({ a: 1 }); // true
isObject({}); // true
isObject(true); // false
```

### isObjectLike

是否是类对象

```js
const isObjectLike = val => val !== null && typeof val === 'object';
```

```js
isObjectLike({}); // true
isObjectLike([1, 2, 3]); // true
isObjectLike(x => x); // false
isObjectLike(null); // false
```

### isPlainObject

是否是 `plain object`

```js
const isPlainObject = val => !!val && typeof val === 'object' && val.constructor === Object;
```

```js
isPlainObject({ a: 1 }); // true
isPlainObject(new Map()); // false
```

### isPrimitive

是否是基本类型

```js
const isPrimitive = val => Object(val) !== val;
```

```js
isPrimitive(null); // true
isPrimitive(50); // true
isPrimitive('Hello!'); // true
isPrimitive(false); // true
isPrimitive(Symbol()); // true
isPrimitive([]); // false
```

### isPromiseLike

是否看起来是 [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

```js
const isPromiseLike = obj =>
  obj !== null &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function'; // 有一个属性方法 then
```

```js
isPromiseLike({
  then: function() {
    return '';
  }
}); // true
isPromiseLike(null); // false
isPromiseLike({}); // false
```

### isString

检测基本类型字符串

```js
const isString = val => typeof val === 'string';
```

```js
isString('10'); // true
```

### isSymbol

是否是 `Symbol`

```js
const isSymbol = val => typeof val === 'symbol';
```

```js
isSymbol(Symbol('x')); // true
```

### isUndefined

是否是 `undefined`

```js
const isUndefined = val => val === undefined;
```

```js
isUndefined(undefined); // true
```

### isValidJSON

检查传入的字串是否是 `JSON` 格式的字串

使用 `JSON.parse()` 和一个 `try... catch` 块

```js
const isValidJSON = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
```

```js
isValidJSON('{"name":"Adam","age":20}'); // true
isValidJSON('{"name":"Adam",age:"20"}'); // false
isValidJSON(null); // true
```

</details>

## 🔧 utility

<details>

<summary>展开</summary>

### castArray

若给定值不是一个数组，则将其转化成一个数组

```js
const castArray = val => (Array.isArray(val) ? val : [val]);
```

```js
castArray('foo'); // ['foo']
castArray([1]); // [1]
```

### cloneRegExp

克隆一个正则表达式

使用 `new RegExp()`, `RegExp.source` 和 `RegExp.flags` 来克隆

```js
const cloneRegExp = regExp => new RegExp(regExp.source, regExp.flags);
```

```js
const regExp = /lorem ipsum/gi;
const regExp2 = cloneRegExp(regExp); // /lorem ipsum/gi
```

### coalesce

返回第一个非 `null`/`undefined` 的参数

使用 [`Array.prototype.find()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

```js
const coalesce = (...args) => args.find(_ => ![undefined, null].includes(_));
```

```js
coalesce(null, undefined, '', NaN, 'Waldo'); // ""
```

### coalesceFactory

返回一个自定义函数，该函数返回第一个使得验证函数返回真值的参数

使用 `Array.prototype.find()` 

```js
const coalesceFactory = valid => (...args) => args.find(valid);
```

```js
const customCoalesce = coalesceFactory(_ => ![null, undefined, '', NaN].includes(_));
customCoalesce(undefined, null, NaN, '', 'Waldo'); // "Waldo"
```

### extendHex

将 3 位的颜色字串转化成 6 位的

```js
const extendHex = shortHex =>
  '#' +
  shortHex
    .slice(shortHex.startsWith('#') ? 1 : 0)
    .split('')
    .map(x => x + x)
    .join('');
```

```js
extendHex('#03f'); // '#0033ff'
extendHex('05a'); // '#0055aa'
```

### getURLParameters

获取 `URL` 中的参数对象

可以传入 `location.search` 作为当前的 `url` 参数

```js
const getURLParameters = url =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
    {}
  );
```

```js
getURLParameters('http://url.com/page?name=Adam&surname=Smith'); // {name: 'Adam', surname: 'Smith'}
getURLParameters('google.com'); // {}
```

### hexToRGB

将颜色的 `HEX` 表示转换成 `rgb()` 或 `rgba()`（如果有 `alpha` 参数）

```js
const hexToRGB = hex => {
  let alpha = false,
    h = hex.slice(hex.startsWith('#') ? 1 : 0);
  if (h.length === 3) h = [...h].map(x => x + x).join(''); // 3 位表达转成 6 位表达
  else if (h.length === 8) alpha = true; // 有 alpha 值
  h = parseInt(h, 16);
  return (
    'rgb' +
    (alpha ? 'a' : '') +
    '(' +
    (h >>> (alpha ? 24 : 16)) +
    ', ' +
    ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
    ', ' +
    ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
    (alpha ? `, ${h & 0x000000ff}` : '') +
    ')'
  );
};
```

```js
hexToRGB('#27ae60ff'); // 'rgba(39, 174, 96, 255)'
hexToRGB('27ae60'); // 'rgb(39, 174, 96)'
hexToRGB('#fff'); // 'rgb(255, 255, 255)'
```

### httpGet

对于指定的 `URL` 创建一个 `GET` 请求

使用 [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest) 

调用 `callback` 函数响应 `onload` 事件，传入参数 `request.responseText`

调用 `err` 函数响应 `onerror` 事件，传入参数 `request`

```js
const httpGet = (url, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send();
};
```

```js
httpGet(
  'https://jsonplaceholder.typicode.com/posts/1',
  console.log
); /*
Logs: {
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
  "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
}
*/
```

### httpPost

对于指定的 `URL` 创建一个 `POST` 请求

```js
const httpPost = (url, data, callback, err = console.error) => {
  const request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.setRequestHeader('Content-type', 'application/json; charset=utf-8'); // 设置请求头
  request.onload = () => callback(request.responseText);
  request.onerror = () => err(request);
  request.send(data);
};
```

```js
const newPost = {
  userId: 1,
  id: 1337,
  title: 'Foo',
  body: 'bar bar bar'
};
const data = JSON.stringify(newPost);
httpPost(
  'https://jsonplaceholder.typicode.com/posts',
  data,
  console.log
); /*
Logs: {
  "userId": 1,
  "id": 1337,
  "title": "Foo",
  "body": "bar bar bar"
}
*/
httpPost(
  'https://jsonplaceholder.typicode.com/posts',
  null, // does not send a body
  console.log
); /*
Logs: {
  "id": 101
}
*/
```

### isBrowser

检测当前运行环境是否是浏览器，可以保证 `Node` 环境代码不会跑出错误

检查全局的 `window` 和 `document`

使用 `typeof` 避免抛出 `ReferenceError`.

```js
const isBrowser = () => ![typeof window, typeof document].includes('undefined');
```

```js
isBrowser(); // true (browser)
isBrowser(); // false (Node)
```

### mostPerformant

返回函数数组中执行性能最佳的那个的下标

```js
const mostPerformant = (fns, iterations = 10000) => {
  const times = fns.map(fn => {
    const before = performance.now();
    for (let i = 0; i < iterations; i++) fn();
    return performance.now() - before;
  });
  return times.indexOf(Math.min(...times));
};
```

```js
mostPerformant([
  () => {
    // Loops through the entire array before returning `false`
    [1, 2, 3, 4, 5, 6, 7, 8, 9, '10'].every(el => typeof el === 'number');
  },
  () => {
    // Only needs to reach index `1` before returning false
    [1, '2', 3, 4, 5, 6, 7, 8, 9, 10].every(el => typeof el === 'number');
  }
]); // 1
```

### nthArg

获取函数的第 `n` 处参数

```js
const nthArg = n => (...args) => args.slice(n)[0];
```

```js
const third = nthArg(2);
third(1, 2, 3); // 3
third(1, 2); // undefined
const last = nthArg(-1);
last(1, 2, 3, 4, 5); // 5
```

### parseCookie

解析 HTTP Cookie 头并返回键值对

```js
const parseCookie = str =>
  str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
```

```js
parseCookie('foo=bar; equation=E%3Dmc%5E2'); // { foo: 'bar', equation: 'E=mc^2' }
```

### prettyBytes

将字节数字转换成带单位的字串

使用 `Number.toPrecision()` 设置精度

```js
const prettyBytes = (num, precision = 3, addSpace = true) => {
  const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  if (Math.abs(num) < 1) return num + (addSpace ? ' ' : '') + UNITS[0];
  const exponent = Math.min(Math.floor(Math.log10(num < 0 ? -num : num) / 3), UNITS.length - 1);
  const n = Number(((num < 0 ? -num : num) / 1000 ** exponent).toPrecision(precision));
  return (num < 0 ? '-' : '') + n + (addSpace ? ' ' : '') + UNITS[exponent];
};
```

```js
prettyBytes(1000); // "1 KB"
prettyBytes(-27145424323.5821, 5); // "-27.145 GB"
prettyBytes(123456789, 3, false); // "123MB"
```

### randomHexColorCode

随机生成一个十六进制表示的颜色字串

```js
const randomHexColorCode = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};
```

```js
randomHexColorCode(); // "#e34155"
```

### RGBToHex

将 `RGB` 转成 `Hex`

```js
const RGBToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
```

```js
RGBToHex(255, 165, 1); // 'ffa501'
```

### serializeCookie

构建cookie

```js
const serializeCookie = (name, val) => `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;
```

```js
serializeCookie('foo', 'bar'); // 'foo=bar'
```

### timeTaken

计算函数调用花费的时间

```js
const timeTaken = callback => {
  console.time('timeTaken');
  const r = callback();
  console.timeEnd('timeTaken');
  return r;
};
```

```js
timeTaken(() => Math.pow(2, 10)); // 1024, (logged): timeTaken: 0.02099609375ms
```

### toCurrency

货币格式表示

使用 [`Intl.NumberFormat`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)

```js
const toCurrency = (n, curr, LanguageFormat = undefined) =>
  Intl.NumberFormat(LanguageFormat, { style: 'currency', currency: curr }).format(n);
```

```js
toCurrency(123456.789, 'EUR'); // €123,456.79  | currency: Euro | currencyLangFormat: Local
toCurrency(123456.789, 'USD', 'en-us'); // $123,456.79  | currency: US Dollar | currencyLangFormat: English (United States)
toCurrency(123456.789, 'USD', 'fa'); // ۱۲۳٬۴۵۶٫۷۹ ؜$ | currency: US Dollar | currencyLangFormat: Farsi
toCurrency(322342436423.2435, 'JPY'); // ¥322,342,436,423 | currency: Japanese Yen | currencyLangFormat: Local
toCurrency(322342436423.2435, 'JPY', 'fi'); // 322 342 436 423 ¥ | currency: Japanese Yen | currencyLangFormat: Finnish
```

### toDecimalMark

使用 `toLocaleString()` 转化浮点格式为 [Decimal mark](https://en.wikipedia.org/wiki/Decimal_mark) 形式. 

 ```js
const toDecimalMark = num => num.toLocaleString('en-US');
```

```js
toDecimalMark(12305030388.9087); // "12,305,030,388.909"
```

### toOrdinalSuffix

给数字加上后缀

```js
const toOrdinalSuffix = num => {
  const int = parseInt(num),
    digits = [int % 10, int % 100],
    ordinals = ['st', 'nd', 'rd', 'th'],
    oPattern = [1, 2, 3, 4],
    tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
  return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
    ? int + ordinals[digits[0] - 1]
    : int + ordinals[3];
};
```

```js
toOrdinalSuffix('123'); // "123rd"
```

### validateNumber

有效的数字

使用 `!isNaN()` 和 `parseFloat()` 检测是否是数字
使用 `isFinite()` 检测是否是有限的
使用 `Number()` 检测强制转换

```js
const validateNumber = n => !isNaN(parseFloat(n)) && isFinite(n) && Number(n) == n;
```

```js
validateNumber('10'); // true
```

### yesNo

字串是 `y`/`yes` 则返回 `true`
字串是 `n`/`no` 则返回 `false`

```js
const yesNo = (val, def = false) =>
  /^(y|yes)$/i.test(val) ? true : /^(n|no)$/i.test(val) ? false : def;
```

```js
yesNo('Y'); // true
yesNo('yes'); // true
yesNo('No'); // false
yesNo('Foo', true); // true
```

</details>
