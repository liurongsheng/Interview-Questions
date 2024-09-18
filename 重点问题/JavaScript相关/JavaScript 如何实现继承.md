# Javascript 如何实现继承

继承(inheritance)是面向对象软件技术当中的一个概念

如果一个类别 B 继承自另一个类别 A，就把这个 B 称为 A 的子类，而把 A 称为 B 的父类别也可以称 A 是 B 的超类

## 好处

继承可以使得子类具有父类别的各种属性和方法，而不需要再次编写相同的代码

在子类别继承父类别的同时，可以重新定义某些属性，并重写某些方法，即覆盖父类别的原有属性和方法，使其获得与父类别不同的功能

虽然 JavaScript 并不是真正的面向对象语言，但它天生的灵活性，使应用场景更加丰富

```js
// 定义车
class Car {
  constructor(color, speed) {
    this.color = color;
    this.speed = speed;
  }
}

// 货车
class Truck extends Car {
  constructor(color, speed) {
    super(color, speed);
    this.Container = true; // 货箱
  }
}
```

## 继承的方式

下面给出 JavaScripy 常见的继承方式:

- 原型链继承
- 原型式继承
- 构造函数继承(借助 call)
- 组合继承
- 寄生式继承
- 寄生组合式继承

### 原型链继承

原型链继承是比较常见的继承方式之一，其中涉及的构造函数、原型和实例，三者之间存在着一定的关系

即每一个构造函数都有一个原型对象，原型对象又包含一个指向构造函数的指针，而实例则包含一个原型对象的指针

```js
function Parent() {
  this.name = "parent1";
  this.play = [1, 2, 3];
}
function child() {
  this.type = "child2";
}
Child1.prototype = new Parent();
console.log(new child());

var sl = new child2();
var s2 = new child2();
s1.play.push(4);
console.log(s1.play, s2.play); // [1,2,3,4]
```

改变 s1 的 play 属性，会发现 s2 也跟着发生变化了，这是因为两个实例使用的是同一个原型对象，内存空间是共享的

### 构造函数继承

借助 call 调用 Parent 函数

```js
function Parent() {
  this.name = "parent1";
}
Parent.prototype.getName = function () {
  return this.name;
};
function child() {
  Parent1.call(this);
  this.type = "child";
}
let child = new child();
console.log(child); // 没问题
console.log(child.getName()); // 会报错
```

## 继承总结

- 不使用 object.create

  - 构造函数继承
  - 原型链继承
  - 构造函数继承、原型链继承结合，组合继承 改造 --> 寄生组合继承

- 使用 object.create

  - 原型式继承
  - 寄生式继承
  - 原型式继承、寄生式继承结合改造 --> 寄生组合继承

寄生组合继承基本类似 ES6 的 extends

通过 Obiect.create 来划分不同的继承方式，最后的寄生式组合继承方式是通过组合继承改造之后的最优继承方式，而 extends 的语法糖和寄生组合继承的方式基本类似
