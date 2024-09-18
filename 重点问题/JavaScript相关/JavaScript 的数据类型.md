# JavaScript 的数据类型

JavaScript 的数据类型可以分为两大类：原始类型（Primitive Types）和引用类型（Reference Types）

## 原始类型（Primitive Types）

原始类型的值存储在栈内存中，每个值都是独立的。JavaScript 的原始类型包括：

- number：表示数字，包括整数和浮点数
- string：表示文本字符串
- boolean：表示逻辑值，有两个可能的值：true 和 false
- null：表示空值，通常用于表示尚未存在的对象
- undefined：表示未定义的值，通常是变量声明后但尚未赋值时的状态

在 JS 中，只有 0，-0，NaN，""，null，undefined 这六个值转布尔值时，结果为 false

## 引用类型（Reference Types）

引用类型的值存储在堆内存中，变量保存的是指向该值的一个引用

- object：对象是最基本的引用类型，可以包含键值对（属性）
- array：数组是一种特殊的对象类型，用于存储有序的值集合
- function：函数也是一种对象类型，在 JavaScript 中，函数是一等公民，可以作为对象来处理
- symbol：符号类型是在 ECMAScript 6 中引入的新类型，用于创建唯一的标识符
- bigint：大整数类型是在 ECMAScript 10 中引入的新类型，用于表示任意精度的整数

## 类型检测

### typeof：返回一个字符串，表示变量的类型

```js
console.log(typeof 123); // "number"
console.log(typeof "abc"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof null); // "object" （这是一个历史遗留问题）
console.log(typeof undefined); // "undefined"
console.log(typeof {}); // "object"
console.log(typeof []); // "object"
console.log(typeof function () {}); // "function"
```

### instanceof：检查一个对象是否是某个构造函数的实例

```js
console.log([] instanceof Array); // true
console.log({} instanceof Object); // true
```

### Array.isArray()：检查一个值是否是一个数组

```js
console.log(Array.isArray([])); // true
console.log(Array.isArray({})); // false
```

### Object.prototype.toString.call()：更准确地检测类型

```js
console.log(Object.prototype.toString.call(123)); // "[object Number]"
console.log(Object.prototype.toString.call("abc")); // "[object String]"
console.log(Object.prototype.toString.call(true)); // "[object Boolean]"
console.log(Object.prototype.toString.call(null)); // "[object Null]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
console.log(Object.prototype.toString.call({})); // "[object Object]"
console.log(Object.prototype.toString.call([])); // "[object Array]"
console.log(Object.prototype.toString.call(function () {})); // "[object Function]"
console.log(Object.prototype.toString.call(Symbol())); // "[object Symbol]"
console.log(Object.prototype.toString.call(BigInt(123))); // "[object BigInt]"
```
