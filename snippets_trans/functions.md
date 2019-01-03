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
