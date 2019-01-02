# 30-seconds-of-code-trans

闲暇阅读 [30-seconds-of-code](https://github.com/30-seconds/30-seconds-of-code) 里的代码。

## adapter

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

## array

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

## browser

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

## math

### approximatelyEqual

检查两个数字是否近似相等。

内部使用 `Math.abs()` 来比较两个数字的差值和精度 `epsilon`，`epsilon` 默认取值 `0.001`

```js
const approximatelyEqual = (v1, v2, epsilon = 0.001) => Math.abs(v1 - v2) < epsilon;
```

```js
approximatelyEqual(Math.PI / 2.0, 1.5708); // true
```
