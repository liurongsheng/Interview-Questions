# this 对象

在绝大多数情况下，函数的调用方式决定了 this 的值(运行时绑定，与执行上下文相关)

this 关键字是函数运行时自动生成的一个内部对象，只能在函数内部使用，总指向调用它的对象

| 调用方式          | 示例             | 函数中的 this 指向       |
| :---------------- | :--------------- | :----------------------- |
| 通过 new 调用     | new method()     | 新对象                   |
| 直接调用          | method()         | 全局对象 window、 global |
| 通过对象调用      | obj.method()     | 前面的对象               |
| call、apply、bind | method.call(ctx) | 第一个参数               |

```js
function fn() {
  console.log(this);
}
const newFn = fn.bind(3);
new fn(); // fn {}
fn(); // global
new newFn(); // fn {}
newFn(); // [Number: 3]
console.log(newFn === fn); // false
```

```js
function fn() {
  console.log(this);
  let n = 1;
  const a = () => {
    console.log(n);
    console.log(this);
  };
  return a;
}
fn(); // 1, global
```

上面的示例，箭头函数的 n 是闭包中的 1，this 也是闭包中的 this

## 绑定规则

根据不同的使用场合 this 有不同的值，主要分为下面几种情况

- new 绑定
- 显示绑定
- 隐式绑定
- 默认绑定

new 绑定优先级 > 显示绑定优先级> 隐式绑定优先级 > 默认绑定优先级

## new 操作符

在 JavaScript 中，new 操作符用于创建一个给定构造函数的实例对象

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayName = function () {
  console.log(this.name);
};
const personl = new Person("Tom", 20);
console.log(person1); // Person { name: "Tom", age: 20 };
t.sayName(); //  Tom
```

new 创建出来的实例可以访问到构造函数中的属性通过构造函数 Person

new 通过构造函数 Person 创建出来的实例可以访问到构造函数原型链中的属性，即实例与构造函数通过原型链连接了起来

```js
function Test(name) {
  this.name = name;
  return 1;
}
const t = new Test("xxx");
console.log(t.name); // 'xxx'
```

可以发现，构造函数中返回一个原始值，然而这个返回值并没有作用

```js
function Test(name) {
  this.name = name;
  console.log(this); // Test {name:'xxx'}
  return { age: 26 };
}
const t = new Test("xxx");
console.log(t); // {age:26 }
console.log(t.name); // undefined
```

构造函数如果返回值为一个对象，那么这个返回值会被正常使用

从上面介绍中，我们可以看到 new 关键字主要做了以下的工作:

- 创建一个新的对象 obj
- 将对象与构建函数通过原型链连接起来
- 将构建函数中的 this 绑定到新建的对象 obj 上
- 根据构建函数返回类型作判断，如果是原始值则被忽略，如果是返回对象，需要正常处理

## 手写实现 new 操作符

```js
function mynew(Func, ...args) {
  // 1.创建一个新对象
  const obj = {};
  // 2.新对象原型指向构造函数原型对象
  obj.__proto__ = Func.prototype;
  // 3.将构建函数的this指向新对象
  let result = Func.apply(obj, args);
  // 4.根据返回值判断
  return result instanceof Object ? result : obi;
}
```

// 测试手写 new 操作符

```js
function mynew(func, ...args) {
  const obj = {};
  obj.__proto__ = func.prototype;
  let result = func.apply(obj, args);
  return result instanceof Object ? result : obj;
}
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.say = function () {
  console.log(this.name);
};
let p = mynew(Person, "huihui", 123);
console.log(p); // Person {name:"huihui",age:123}
p.say(); // huihui
```
