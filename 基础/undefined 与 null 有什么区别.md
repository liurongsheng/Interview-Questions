# undefined 与 null 有什么区别

## 语义不同

- undefined 表示一个变量未被赋值或声明后未初始化
- null 表示一个变量被明确地设置为空值，通常用于表示没有对象

null 是 js 的保留关键字
undefined 只是一个常量

这就可以声明名称为 undefined 的变量，但将 null 不能用作变量名，否则会抛出语法错误错

```js
let undefined = 0; // undefined
console.log(undefined);
let null = 0; // SyntaxError
```

## 类型检测不同

console.log(typeof undefined); // undefined
console.log(typeof null); // object

## 相等性比较

undefined == null // true，进行宽松相等比较时，undefined 与 null 视为相等
undefined === null // false，进行严格相等比较时，undefined 与 null 是不相等的

## 使用场景

不推荐显式地赋值为 undefined，因为它通常表示一个变量还未被赋值

undefined 的使用场景

- 变量声明但未赋值，var a; // undefined
- 未定义的对象属性，var o = {}; o.b // undefined
- 函数参数未传递
- 执行无返回值函数，(()=>{})() // undefined
- 执行 void 表达式，void 0 // undefined
- 全局常量 window.undefined 或 undefined

```js
function test(param) {
  console.log(param); // 如果没有传递参数，输出：undefined
}
test();

let obj = {};
console.log(obj.property); // 输出：undefined
```

null 的使用场景

- 用来释放一个对象引用
- DOM 操作，如果元素不存在，输出：null

```js
let obj = { name: "Alice" };
obj = null; // 释放对象引用

let element = document.getElementById("nonexistent");
console.log(element); // 如果元素不存在，输出：null
```
