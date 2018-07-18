# JavaScript原型及原型链

## 原型

原型是 ECMAScript 实现继承的过程中产生的一个概念。

继承：

java 中：指在已有的一个类基础上创建新类的过程。

ES：指在一个对象的基础上创建新对象的过程。原型指在这过程中作为基础的对象。

创建原型

```
// 鸟对象
var bird = {
    name: "bird",
    fly: function () {
        console.log("fly");
    }
}
```

假设我们需要一个鹰对象，因为我们已经有一个鸟对象，因此可以从这个鸟对象继承信息。

```
//鹰对象
var eagle = Object.create(bird);
eagle.fly(); // fly
```

通过 Object.create() 方法我们传入了鸟对象，作为鹰对象的原型来创建鹰对象，然后鹰对象中就产生了一个叫 `_proto_` 的指针，这指针指向鸟对象。
通过这个指针鹰对象就可以访问到鸟对象的 fly() 方法，当然编译器帮我们自动处理了这个指针访问的过程。

但是对于原型来讲，prototype 属性是很重要的存在，下面来讲讲 prototype。


## prototype 属性

从一个例子讲 prototype 属性存在解决了什么问题。

现在有一个叫做 DOG 的构造函数，表示狗对象的原型。

```
function DOG(name){
    this.name = name;
}
```

对这个构造函数使用new，就会生成一个狗对象的实例。

```
var dogA = new DOG('大毛');
alert(dogA.name); // 大毛
```

new运算符的缺点

但是，用构造函数生成实例对象，有一个缺点，那就是无法共享属性和方法。

比如，在DOG对象的构造函数中，设置一个实例对象的共有属性species。

```
function DOG(name){
    this.name = name;
    this.species = '犬科';
}
```

然后，生成两个实例对象：

var dogA = new DOG('大毛');
var dogB = new DOG('二毛');

这两个对象的species属性是独立的，修改其中一个，不会影响到另一个。

```
dogA.species = '猫科';
alert(dogB.species); // 显示"犬科"，不受dogA的影响
```

每一个实例对象，都有自己的属性和方法的副本。这不仅无法做到数据共享，也是极大的资源浪费。


prototype属性的引入

考虑到这一点，Brendan Eich 决定为构造函数设置一个 prototype 属性。

这个属性包含一个对象（以下简称” prototype 对象”），所有实例对象需要共享的属性和方法，都放在这个对象里面；
那些不需要共享的属性和方法，就放在构造函数里面。

实例对象一旦创建，将自动引用 prototype 对象的属性和方法。也就是说，实例对象的属性和方法，分成两种，一种是本地的，另一种是引用的。


还是以 DOG 构造函数为例，现在用 prototype 属性进行改写：

```
function DOG(name){
    this.name = name;
}
DOG.prototype = { species : '犬科' };

var dogA = new DOG('大毛');
var dogB = new DOG('二毛');

alert(dogA.species); // 犬科
alert(dogB.species); // 犬科
```

现在，species属性放在prototype对象里，是两个实例对象共享的。只要修改了prototype对象，就会同时影响到两个实例对象。

DOG.prototype.species = '猫科';

alert(dogA.species); // 猫科
alert(dogB.species); // 猫科


## 原型链

讲原型一个不可避免的概念就是原型链，原型链是通过前面两种创建原型的方式 Object.create() 或 DOG.prototype 时生成的一个 `_proto_` 指针来实现的。

以 DOG 为例讲原型链

<img src="/img/原型链_prop_属性1.png" title="原型链_prop_属性" />

红色的箭头就是原型链。

DOG 对象有一个 prototype 对象，而实例对象 dogA 通过一个 `_proto_` 对象引用这个 prototype 对象。

可以看出 dogA 能访问到的 species 属性实际上是在 DOG 的原型电源线 prototype 中，因此才能实现实例对象属性共享访问却不能修改。

但是在 DOG.prototype 中还存在一个 `_proto_` 属性，这又是指向谁呢？

<img src="/img/原型链_prop_属性2.png" title="原型链_prop_属性" />

指向 Object 对象，这样 DOG 对象就拥有 Object 对象中原型属性和方法。比如说 toString() 就在其中。


还有一点，那就是 Js 的函数也是对象啊，我们每个创建的函数其实也继承了一个函数对象，而函数则继承了 Object 对象。。

<img src="/img/原型链_prop_属性3.png" title="原型链_prop_属性" />image

以上就是一个简单的 Dog 类完整的原型链。

---

总结一下原型链作用：

1. 对象属性的访问修改和删除。

1. 访问。优先在对象本身查找，没有则顺着原型链向上查找

1. 修改。只能修改跟删除自身属性，不会影响到原型链上的其他对象。

## 总结

由于所有的实例对象共享同一个 prototype 对象，那么从外界看起来，
prototype 对象就好像是实例对象的原型，而实例对象则好像”继承”了 prototype 对象一样。