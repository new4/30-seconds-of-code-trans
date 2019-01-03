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

</details>
