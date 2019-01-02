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

## function

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

## node

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

## object

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

## string

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

## utility

### castArray

若给定值不是一个数组，则将其转化成一个数组

```js
const castArray = val => (Array.isArray(val) ? val : [val]);
```

```js
castArray('foo'); // ['foo']
castArray([1]); // [1]
```
