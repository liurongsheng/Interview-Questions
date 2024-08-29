# JavaScript原型和原型链

## 原型

JavaScript 常被描述为一种基于原型的语言，每个对象拥有一个原型对象

当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的未尾

准确地说，这些属性和方法定义在Object的构造器函数(constructor functions)之上的 prototype 属性上，而非实例对象本身

函数可以有属性。每个函数都有一个特殊的属性叫作原型 prototype

## 原型链（Prototype Chain）

原型链是 JavaScript 中实现继承和属性查找的一种机制。通过原型链，JavaScript 能够动态地查找对象的属性和方法，使得对象能够继承另一个对象的属性和方法

原型对象也可能拥有原型，并从中继承方法和属性，一层一层、以此类推。这种关系常被称为原型链(prototype chain)，

它解释了为何一个对象会拥有定义在其他对象中的属性和方法

在对象实例和它的构造器之间建立一个链接(它是 _proto_ 属性，是从构造函数的 prototype 属性派生的)，之后通过上溯原型链，在构造器中找到这些属性和方法

总结：

__proto__ 作为不同对象之间的桥梁，用来指向创建它的构造函数的原型对象

每个对象的 __proto__ 都是指向它的构造函数的原型对象 prototype 的

`person1.__proto__ === Person.prototype`

构造函数是一个函数对象，通过 Function 构造器产生

`Person.__proto__  === Function.prototype`

原型对象本身是一个普通对象，而普通对象的构造器函数是 Object

`Person.prototype.__proto__ === Object.prototype`

所有构造器都是函数对象，函数对象都是 Function 构造产生的

`Object.__proto__ === Function.prototype`

- 一切对象都是继承自 Object 对象，Object 对象直接继承根源对象 null
- 一切的函数对象(包括 Object对象)，都是继承自 Function 对象
- Object 对象直接继承自 Function 对象
- Function 对象的 _proto_ 会指向自己的原型对象，最终还是继承自 Object 对象

