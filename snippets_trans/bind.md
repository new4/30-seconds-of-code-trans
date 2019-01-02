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
