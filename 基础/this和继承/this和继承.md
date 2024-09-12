# this 和继承

## this 取决于"谁在调用"

用于函数/方法内部

在 js 中 this 是动态的，因为太灵活 导致比较乱

- 非严格模式下的 this——找不到明确的 this，算 window
- 严格模式下——找不到，算 undefined

## 受什么影响

- 严格模式——全局函数，'use strict';
- 方法，window 对象
- 事件，document
- 定时器，window 定时器属于 window 对象的

## 操作 this

- 函数的方法：call、apply、bind

  // 直接就执行了函数

  - fn.call(thisObj, 参数, ...)
  - fn.apply(thisObj, [参数, ...])

  // 生成一个新的函数——this 被绑定了的，不会立即执行

  - let newFn=fn.bind(thisObj);

- 箭头函数

  箭头函数内部的 this 永远跟箭头函数外部一致
  箭头函数相当于——自带一个 bind(this)

## 概念

- 父类：被继承的类
  基类、超类

- 子类：通过继承出来的新的类
  派生类、衍生类

- 继承
  派生

- 抽象类：本身无法直接实例化、仅仅作为父类使用（公共的功能）
  **JS 本身不支持抽象类**

abstract class Node{

}

let n=new Node(); //Node 不能被实例化

## 继承：才是面向对象的精华、目的

- 继承特别常见

  txt -> HTMLInputElement -> HTMLElement -> Element -> Node

- 继承的目的

  - 清晰的层次——阅读方便、公共操作/属性
  - 功能得到重用（属性、方法）
  - **使用多态来简化程序**

- 适用场景

  - 拥有明确的、合理的父子关系
  - 子类能够完全覆盖父类（子类 >= 父类）

## 继承的写法

- ES5，传统的写法
- ES6, 现代的写法

```js
ES5，古典——乱、麻烦、不统一
  function 子类(){
    父类.call(参数...)

    this.子类属性
  }

  子类.prototype=new 父类();
  子类.prototype.constructor=子类;

  子类.prototype.xxx=function (){};

ES6，统一
  class 子类 extends 父类{
    constructor(){
      super(参数...);

      this.子类属性
    }

    showxxx(){

    }
  }
```

## 原型链

实例 -> 类.prototype -> 父类.prototype -> 父父类.prototype -> 父父父类.prototype -> ... -> Object.prototype

有啥用—— js 自身依赖这种机制来工作

arr 是 Object 的实例？ // false

arr instanceof Object // true

## 多重继承

一个类是由多个父类派生出来的  **JS不支持多重继承**

Ajax
Component

多重继承——替代方案就是组合

## super的作用

- 父类的构造器
    super(参数);
- 父类的方法的空间
    super.calc();

- 写父类的时候
  公共的——提取的时候，是否所有子类都有

- super的用法
  父类构造函数，super(...)
  父类的方法，super.xxx()

- 重写父类方法
  同名覆盖

- 多态
  同一个方法——可以有很多个版本
    具体调用的是哪一个？不重要
