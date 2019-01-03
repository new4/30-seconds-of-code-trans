### hammingDistance

计算两个值之间的汉明距离

使用异或操作符 (`^`) 找到两个数之间的差异值，将其转换成2进制的字串并统计 `1` 出现的次数

```js
const hammingDistance = (num1, num2) => ((num1 ^ num2).toString(2).match(/1/g) || '').length;
```

```js
hammingDistance(2, 3); // 1
```
