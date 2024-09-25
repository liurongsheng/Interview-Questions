# 对象 Object

## 对象属性名问题

// 下面代码输出的结果是什么

```js
const obj = { a: 0 };
obj[1] = 0;
console.log(obj); // { '1': 0, a: 0 }
obj[++obj.a] = obj.a++; // ++obj.a = {a: 1}, obj[1] = 1, obj.a++ => {a: 2}, {'1': 1, a: 2}
const values = Object.values(obj); // [1, 2]
obj[values[0]] = obj.a; // obj[1] = 2 => {'1': 2, a: 2}
console.log(obj); // { '1': 2, a: 2 }
```

- 对象的属性名只能是字符串或者 Symbol 类型，而数字类型会被自动转换成字符串类型
- 数字类的属性会全部提前
- ++obj.a，先自增，再取值
- obj.a++，先取值，再自增

## typeof null

typeof null === 'object'

在 JavaScript 的早期版本中，所有的值都被设计成 32 位，其中最低的 3 位用来表示数据类型

object 对应的值是 000，而 null 被设计成一种特殊值，其 32 位全部为 0。这意味着 null 的类型标志与 object 的标志相同，因此 typeof null 返回 'object'

这个行为实际上是一个设计上的 bug，但由于向后兼容性的原因，JavaScript 一直保留了这种行为

即使是在现代的 JavaScript 实现中，null 的 typeof 结果依然是 'object'，这是为了保证与早期版本的兼容性，避免破坏已经存在的代码
