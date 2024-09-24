# Number

## NaN (Not a number)

通常在计算失败的时候会得到该值，要判断一个变量是否为 NaN 则可以通过 Number.isNaN 函数进行判断

```js
console.log(Number.isNaN(Number("2a"))); // true
```

## Infinity

Infinity 是无穷大，加上负号会变成无穷小

在某些场景下比较有用

比如通过数值来表示权重或者优先级
Infinity 可以表示最高优先级或最大权重

```js
console.log(1 / 0); // Infinity
console.log(-1 / 0); // -Infinity
console.log(-0 === +0); // true
```
