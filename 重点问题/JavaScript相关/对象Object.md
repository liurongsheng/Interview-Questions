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
