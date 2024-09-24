# 设计模式

对设计模式的理解？常见的设计模式有哪些？

设计模式是一种在软件开发中解决常见问题的通用解决方案

简单来说，设计模式就是前人总结出来的、经过验证的、解决特定问题的好方法

6 大程序设计原则和 3 大类 23 种设计模式

## 常见的设计模式有

- 单例模式
- 工厂模式
- 装饰者模式
- 代理模式
- 策略模式

三大类

- 创建型模式，将对象的创建与使用进行分离从而降低系统的耦合度，使用者不需要关注创建对象的细节
- 结构型模式，描述如何将类或对象组合在一起形成更大的结构
- 行为型模式

### 创建型模式

- 单例模式:

使用场景: 确保一个类只有一个实例，并提供一个全局访问点
示例: 日志记录器、数据库连接池、配置管理器等

- 工厂模式:

使用场景: 提供一个创建对象的统一接口，让子类决定实例化哪个类
示例: 创建不同类型的消息处理器、创建不同类型的图形对象等

- 抽象工厂模式:

使用场景: 创建一系列相关或依赖对象的家族，而无需指定它们具体的类
示例: 不同操作系统下的图形界面组件（按钮、窗口等）

- 建造者模式:

使用场景: 构建复杂对象的各个部分，并逐步构建最终对象
示例: 构建复杂的文档对象模型（DOM）、构建配置文件等

- 原型模式:

使用场景: 通过复制现有的对象来创建新对象，避免创建过程中的复杂操作
示例: 游戏中的敌人生成、UI 组件的快速克隆等

### 结构型模式

- 装饰者模式:

使用场景: 动态地给一个对象添加一些额外的职责
示例: 流式处理中的过滤器、网络通信中的加密解密等

- 代理模式:

使用场景: 为其他对象提供一个代理以控制对这个对象的访问
示例: 远程代理（远程对象访问）、虚拟代理（延迟加载）、保护代理（权限控制）等

- 适配器模式:

使用场景: 将一个类的接口转换成客户希望的另一个接口
示例: 旧系统与新系统的接口兼容、第三方库的接口适配等

- 桥接模式:

使用场景: 将抽象部分与它的实现部分分离，使它们都可以独立变化
示例: 图形渲染引擎的不同实现（OpenGL、DirectX）、多平台支持等

- 组合模式:

使用场景: 将对象组合成树形结构以表示“部分-整体”的层次结构
示例: 文件系统中的目录和文件、UI 组件的层级结构等

- 外观模式:

使用场景: 提供一个统一的接口，用来访问子系统中的一群接口
示例: 复杂系统的简化接口、API 封装等

- 享元模式:

使用场景: 使用共享技术有效地支持大量细粒度的对象
示例: 缓存大量相似的小对象（如字符、图形等）

### 行为型模式

- 策略模式:

使用场景: 定义一系列算法，把它们一个个封装起来，并且使它们可互换
示例: 不同排序算法的选择、支付方式的选择等

- 观察者模式:

使用场景: 当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知并自动更新
示例: 数据绑定、事件监听等

- 发布-订阅模式:

使用场景: 实现对象之间的松散耦合，允许对象之间异步通信
示例: 消息队列、事件驱动架构等

- 模板方法模式:

使用场景: 定义一个操作中的算法骨架，而将一些步骤延迟到子类中
示例: 渲染流程中的具体步骤、游戏中的角色行为等

- 迭代器模式:

使用场景: 提供一种方法顺序访问一个聚合对象中各个元素，而又不暴露该对象的内部表示
示例: 遍历列表、集合等

- 命令模式:

使用场景: 将一个请求封装为一个对象，从而使你可用不同的请求对客户端进行参数化；对请求排队或记录请求日志，以及支持可撤销的操作
示例: UI 中的撤销操作、事务处理等

- 职责链模式:

使用场景: 使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系
示例: HTTP 请求的中间件处理、权限验证等

- 状态模式:

使用场景: 允许一个对象在其内部状态改变时改变它的行为
示例: 游戏中的角色状态（攻击、防御等）、工作流中的状态变化等

- 访问者模式:

使用场景: 在不改变集合元素的前提下定义作用于这些元素的新操作
示例: 对象图的遍历、代码解析等

- 中介者模式:

使用场景: 用一个中介对象来封装一系列的对象交互
示例: 聊天室、多人在线游戏中的消息传递等

- 备忘录模式:

使用场景: 在不破坏封装性的前提下捕获一个对象的内部状态，并在该对象之外保存这个状态
示例: 文档编辑器的撤销功能、游戏中的存档功能等

- 解释器模式:

使用场景: 为了解释语言的文法或表达复杂条件的语句
示例: SQL 查询解析、正则表达式解析等

### 单例模式

保证一个类仅有一个实例，并提供一个访问它的全局访问点

实现的方法为先判断实例存在与否，如果存在则直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象

### 工厂模式

工厂模式通常会分成 3 个角色:

- 工厂角色-负责实现创建所有实例的内部逻辑
- 抽象产品角色-是所创建的所有对象的父类，负责描述所有实例所共有的公共接口
- 具体产品角色-是创建目标，所有创建的对象都充当这个角色的某个具体类的实例

### 策略模式

策略模式定义了一系列算法，并将每个算法封装起来，使它们可以相互替换，且算法的变化不会影响使用算法的客户

- 策略类(可变)，策略类封装了具体的算法，并负责具体的计算过程
- 环境类(不变)，接受客户的请求，随后将请求委托给某一个策略类

### 代理模式

代理模式:为对象提供一个代用品或占位符，以便控制对它的访问

例如实现图片懒加载的功能，先通过一张 loading 图占位，然后通过异步的方式加载图片，等图片加载好了再把完成的图片加载到 img 标签里面

### 中介者模式

通过一个中介者对象，其他所有的相关对象都通过该中介者对象来通信，而不是相互引用，当其中的一个对象发生改变时，只需要通知中介者对象即可

通过中介者模式可以解除对象与对象之间的紧耦合关系

### 装饰者模式

在不改变对象自身的基础上，在程序运行期间给对象动态地添加方法

通常运用在原有方法维持不变，在原有方法上再挂载其他方法来满足现有需求

总结：
不断去学习设计模式，会对我们有着极大的帮助，主要如下:

- 从许多优秀的软件系统中总结出的成功的、能够实现可维护性、复用的设计方案，使用这些方案将可以让我们避免做一些重复性的工作
- 设计模式提供了一套通用的设计词汇和一种通用的形式来方便开发人员之间沟通和交流，使得设计方案更加通俗易懂
- 大部分设计模式都兼顾了系统的可重用性和可扩展性，这使得我们可以更好地重用一些已有的设计方案、功能模块甚至一个完整的软件系统，避免我们经常做一些重复的设计、编写一些重复的代码
- 合理使用设计模式并对设计模式的使用情况进行文档化，将有助于别人更快地理解系统
- 学习设计模式将有助于初学者更加深入地理解面向对象思想

## 工厂模式的理解？应用场景？

工厂模式是用来创建对象的一种最常用的设计模式，不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，那么这个函数就可以被视为一个工厂

其就像工厂一样重复的产生类似的产品，工厂模式只需要我们传入正确的参数，就能生产类似的产品

工厂模式根据抽象程度的不同可以分为:

- 简单工厂模式(Simple Factory)
- 工厂方法模式(Factory Method)
- 抽象工厂模式(Abstract Factory)

### 简单工厂模式

简单工厂模式也叫静态工厂模式，用一个工厂对象创建同一类对象类的实例假设我们要开发一个公司岗位及其工作内容的录入信息，不同岗位的工作内容不一致

```js
function Factory(career) {
  function User(career, work) {
    this.career = career;
    this.work = work;
  }
  let work;

  switch (career) {
    case "coder":
      work = ["写代码", "修Bug"];
      return new User(career, work);
      break;
    case "hr":
      work = ["招聘", "员工信息管理"];
      return new User(career, work);
      break;
    case "driver":
      work = ["开车"];
      return new User(career, work);
      break;
    case "boss":
      work = ["喝茶", "开会", "审批文件"];
      return new User(career, work);
      break;
  }
  let coder = new Factory("coder");
  console.log(coder);
  let boss = new Factory("boss");
  console.log(boss);
}
```

Factory 就是一个简单工厂，当我们调用工厂函数时，只需要传递 name、age、career 就可以获取到包含用户工作内容的实例对象

### 工厂方法模式

工厂方法模式跟简单工厂模式差不多，但是把具体的产品放到了工厂函数的 prototype 中这样一来，扩展产品种类就不必修改工厂函数了，核心类就变成抽象类，也可以随时重写某种具体的产亟

也就是相当于工厂总部不生产产品了，交给下辖分工厂进行生产；但是进入工厂之前，需要有个判断来验证你要生产的东西是否是属于我们工厂所生产范围，如果是，就丢给下辖工厂来进行生产

```js
// 工厂方法
function Factory(career) {
  if (this instanceof Factory) {
    var a = new this[career]();
    return a;
  } else {
    return new Factory(career);
  }
}

// 工厂方法函数的原型中设置所有对象的构造函数
Factory.prototype = {
  coder: function () {
    this.careerName = "程序员";
    this.work = ["写代码", "修Bug"];
  },
  hr: function () {
    this.careerName = "HR";
    this.work = ["招聘", "员工信息管理"];
  },
  driver: function () {
    this.careerName = "司机";
    this.work = ["开车"];
  },
  boss: function () {
    this.careerName = "老板";
    this.work = ["喝茶", "开会", "审批文件"];
  },
};
let coder = new Factory("coder");
console.log(coder);
let hr = new Factory("hr");
console.log(hr);
```

工厂方法关键核心代码是工厂里面的判断 this 是否属于工厂，也就是做了分支判断，这个工厂只做我能做的产品

### 抽象工厂模式

简单工厂模式和工厂方法模式都是直接生成实例，但是抽象工厂模式不同，抽象工厂模式并不直接生成实例， 而是用于对产品类簇的创建

通俗点来讲就是：简单工厂和工厂方法模式的工作是生产产品，那么抽象工厂模式的工作就是生产工厂的

由于 JavaScript 中并没有抽象类的概念，只能模拟，可以分成四部分

- 用于创建抽象类的函数
- 抽象类
- 具体类
- 实例化具体类

示例代码如下：上面的例子中有 coder、hr、boss、driver 四种岗位，其中 coder 可能使用不同的开发语
言进行开发，比如 JavaScript、Java 等等。那么这两种语言就是对应的类簇

```js
let CareerAbstractFactory = function (subType, superType) {
  // 判断抽象工厂中是否有该抽象类
  if (typeof CareerAbstractFactory[superType] === "function") {
    // 缓存类
    function F() {}
    // 继承父类属性和方法
    F.prototype = new CareerAbstractFactory[superType]();
    // 将子类的constructor指向父类
    subType.constructor = subType;
    // 子类原型继承父类
    subType.prototype = new F();
  } else {
    throw new Error("抽象类不存在");
  }
};
```

从上面可看到，简单简单工厂的优点就是我们只要传递正确的参数，就能获得所需的对象，而不需要关心其创建的具体细节

应用场景也容易识别，有构造函数的地方，就应该考虑简单工厂，但是如果函数构建函数太多与复杂，会导致工厂函数变得复杂，所以不适合复杂的情况

抽象工厂模式一般用于严格要求以面向对象思想进行开发的超大型项目中，我们一般常规的开发的话一般就是简单工厂和工厂方法模式会用的比较多一些

综上，工厂模式适用场景如下：

如果你不想让某个子系统与较大的那个对象之间形成强耦合，而是想运行时从许多子系统中进行挑选的话，那么工厂模式是一个理想的选择

将 new 操作简单封装，遇到 new 的时候就应该考虑是否用工厂模式；需要依赖具体环境创建不同实例，这些实例都有相同的行为，这时候我们可以使用工厂模式，简化实现的过程，同时也可以减少每种对象所需的代码量，有利于消除对象间的耦合，提供更大的灵活性

## 单例模式的理解？如何实现？

单例模式(Singleton Pattern)：创建型模式，提供了一种创建对象的最佳方式，这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建

在 javascript 中，实现一个单例模式可以用一个变量来标志当前的类已经创建过对象，如果下次获取当前类的实例时，直接返回之前创建的对象即可

```js
// 定义一个类
function Singleton(name) {
  this.name = name;
  this.instance = null;
  // 原型扩展类的一个方法getName()
  Singleton.prototype.getName = function () {
    console.log(this.name);
  };
  // 获取类的实例
  Singleton.getInstance = function (name) {
    if (!this.instance) {
      this.instance = new Singleton(name);
    }
    return this.instance;
  };
  // 获取对象1
  const a = Singleton.getInstance("a");
  // 获取对象2
  const b = Singleton.getInstance("b");
  // 进行比较
  console.log(a === b);
}
```

使用闭包实现单例模式

```js
function Singleton(name) {
  this.name = name;
}
// 原型扩展类的一个方法getName()
Singleton.prototype.getName = function () {
  console.log(this.name);
};
// 获取类的实例
Singleton.getInstance = (function () {
  var instance = null;
  return function (name) {
    if (!this.instance) {
      this.instance = new Singleton(name);
    }
    return this.instance;
  };
})();
// 获取对象1
const a = Singleton.getInstance("a");
// 获取对象2
const b = Singleton.getInstance("b");
// 进行比较
console.log(a === b);
```

Redux 、Vuex 全局态管理库也应用单例模式的思想

现在很多第三方库都是单例模式，多次引用只会使用同一个对象如 jquery、lodash、moment

## 策略模式的理解？应用场景？

定义一系列的算法，把它们一个个封装起来，目的就是将算法的使用与算法的实现分离开来

一个基于策略模式的程序至少由两部分组成:

- 策略类，策略类封装了具体的算法，并负责具体的计算过程
- 环境类 Context，Context 接受客户的请求，随后 把请求委托给某一个策略类

```js
var calculateBouns = function (salary, level) {
  if (level === "A") {
    return salary * 4;
  }
  if (level === "B") {
    return salary * 3;
  }
  if (level === "C") {
    return salary * 2;
  }
};
// 调用如下:
console.log(calculateBouns(4000, "A")); // 16000
console.log(calculateBouns(2500, "B")); //7500
```

函数内部包含过多 if...else ，并且后续改正的时候，需要在函数内部添加逻辑，违反了开放封闭原则

而如果使用策略模式，就是先定义一系列算法，把它们一个个封装起来，将不变的部分和变化的部分隔
开

```js
var obj = {
  A: function (salary) {
    return salary * 4;
  },
  B: function (salary) {
    return salary * 3;
  },
  C: function (salary) {
    return salary * 2;
  },
};
var calculateBouns = function (level, salary) {
  return obj[level](salary);
};
console.log(calculateBouns("A", 10000)); //40000
```

obj 对应的是策略类，而 calculateBouns 对应上下通信类

```js
var registerForm = document.getElementById("registerForm");
registerForm.onsubmit = function () {
  if (registerForm.userName.value === "") {
    alert("用户名不能为空");
    return;
  }
  if (registerForm.password.value.length < 6) {
    alert("密码的长度不能小于6位");
    return;
  }
  if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
    alert("手机号码格式不正确");
    return;
  }
};
```

上述代码包含多处 if 语句，并且违反了开放封闭原则，如果应用中还有其他的表单，需要重复编写代码

此处也可以使用策略模式进行重构校验，第一步确定不变的内容，即策略规则对象

```js
var strategy = {
  isNotEmpty: function (value, errorMsg) {
    if (value === "") {
      return errorMsg;
    }
  },
  //限制最小长度
  minLength: function (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },

  // 手机号码格式
  mobileFormat: function (value, errorMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
      return errorMsg;
    }
  },
};
```

- 策略模式利用组合，委托等技术和思想，有效的避免很多 if 条件语句
- 策略模式提供了开放-封闭原则，使代码更容易理解和扩展
- 策略模式中的代码可以复用

策略模式不仅仅用来封装算法，在实际开发中，通常会把算法的含义扩散开来，使策略模式也可以用来封装一系列的“业务规则”

只要这些业务规则指向的目标一致，并且可以被替换使用，我们就可以用策略模式来封装它们

## 发布订阅、观察者模式的理解？区别？

观察者模式定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新

观察者模式属于行为型模式，行为型模式关注的是对象之间的通讯，观察者模式就是观察者和被观察者之间的通讯

例如生活中，我们可以用报纸期刊的订阅来形象的说明，当你订阅了一份报纸，每天都会有一份最新的报纸送到你手上，有多少人订阅报纸，报社就会发多少份报纸

报社和订报纸的客户就形成了一对多的依赖关系

```js
class Subject {
  constructor() {
    this.observerList = [];
  }

  addObserver(observer) {
    this.observerList.push(observer);
  }

  removeObserver(observer) {
    const index = this.observerList.findIndex((o) => o.name === observer.name);
    this.observerList.splice(index, 1);
  }
  notifyObservers(message) {
    const observers = this.observeList;
    observers.forEach((observer) => observer.notified(message));
  }
}

class Observer {
  constructor(name, subject) {
    this.name = name;
    if (subject) {
      subject.addObserver(this);
    }
  }
  notified(message) {
    console.log(this.name, "got message", message);
  }
}

const subject = new Subject();
const observerA = new Observer("observerA", subject);
const observerB = new Observer("observerB");
subject.addObserver(observerB);
subject.notifyObservers("Hello from subject");
subject.removeObserver(observerA);
subject.notifyObservers("Hello again");
```

观察者主动申请加入被观察者的列表，被观察者主动将观察者加入列表

### 发布-订阅模式

你在关注一个天气预报网站，你想知道每天的天气变化。在这种情况下：

- 天气站（被观察者/Subject）：它负责收集天气数据
- 你（观察者/Observer）：是你自己，你关心天气变化，想要及时获取更新

在这个模式下，当你注册成为天气站的会员后，天气站就会在每次天气变化时直接给你发送邮件通知。这里的关键在于，天气站知道你是谁，也知道你的联系方式，所以可以直接通知你。这种属于观察者模式

发布-订阅模式

现在假设你不再直接从天气站获取信息，而是通过一个社交媒体平台来获取天气信息。这种情况下：

- 天气站（发布者/Publisher）：天气站会在社交媒体平台上发布最新的天气情况
- 社交媒体平台（订阅管理器/Broker）：这是一个中间平台，它负责管理所有的天气信息，并将这些信息推送给所有感兴趣的人
- 你（订阅者/Subscriber）：你关注了天气站的社交媒体账号，这样每当天气站发布新的天气信息时，你会从社交媒体平台接收到更新

在这个模式里，天气站并不知道你是谁，也不知道你是通过什么方式接收信息的，它只负责发布信息。而社交媒体平台则知道哪些人对天气信息感兴趣，并且会把这些信息推送给订阅者

### 总结

观察者模式就像你直接订阅了一个服务，服务方知道你是谁并且会直接联系你

发布-订阅模式则是你通过一个第三方平台来订阅服务，服务方不知道你是谁，只知道有人对它的信息感兴趣，而第三方平台负责将信息传达给你

在观察者模式中，观察者是知道 Subject 的，Subject 一直保持对观察者进行记录

然而，在发布订阅模式中，发布者和订阅者不知道对方的存在。它们只有通过消息代理进行通信

在发布订阅模式中，组件是松散耦合的，正好和观察者模式相反

观察者模式大多数时候是同步的，比如当事件触发，Subject 就会去调用观察者的方法

发布-订阅模式大多数时候是异步的(使用消息队列)

## 代理模式的理解？应用场景？

是为一个对象提供一个代用品或占位符，以便控制对它的访问

代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要时，提供一个替身对象来控制这个对象的访问，客户实际上访问的是替身对象

在生活中，代理模式的场景是十分常见的，例如我们现在如果有租房、买房的需求，更多的是去找链家等房屋中介机构，而不是直接寻找想卖房或出租房的人谈。此时，链家起到的作用就是代理的作用

在 ES6 中，存在 proxy 构建函数能够让我们轻松使用代理模式

`const proxy = new Proxy(target, handler);`

而按照功能来划分，javascript 代理模式常用的有

- 缓存代理
- 虚拟代理

缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果

虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建。常见的就是图片预加载功能
