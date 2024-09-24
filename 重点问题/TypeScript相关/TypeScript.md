# TypeScript

## Typescript 的数据类型

- boolean（布尔类型）
- number（数字类型）
- string（字符串类型）
- array（数组类型）
- tuple（元组类型）
- enum（枚举类型）
- any（任意类型）
- null 和 undefined 类型
- void 类型
- never 类型
- object 对象类型

```ts
let flag: boolean = true;
let num: number = 123;
let str: string = `Hello, my name is ${name}`;
let arr: string[] = ["12", "23"];
```

js 中没有的类型

```ts
let tupleArr: [number, string, boolean]; // 元祖类型

enum Color { // 枚举类型
  Red,
  Green,
  Blue,
}

let num: any = 123;
let num: number | undefined; // 数值类型 或者 undefined

function hello(): void {
  alert("Hello Runoob");
}

let a: never;
a = 123; // 错误的写法

a = (() => {
  // 正确的写法
  throw new Error("错误");
})();

// 返回never的函数必须存在无法达到的终点

let obj: object = { name: "Wang", age: 25 };
```

## 枚举

- 数字枚举
- 字符串枚举
- 异构枚举，数字枚举和字符串枚举结合起来混合起来使用

```ts
enum Direction {
  Up = 10,
  Down,
  Left,
  Right,
}

enum Direction {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
}

enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

## 接口

一个接口所描述的是一个对象相关的属性和方法，但并不提供具体创建此对象实例的方法

```ts
interface Father {
  color: String;
}

interface Mother {
  height?: Number; // 可选属性
}

interface Son extends Father, Mother {
  // 继承
  name: string;
  age: Number;
}
```

## 类

定义类的关键字为 class，后面紧跟类名，类可以包含以下几个模块（类的数据成员）：

- 字段：字段是类里面声明的变量。字段表示对象的有关数据
- 构造函数：类实例化时调用，可以为类的对象分配内存
- 方法：方法为对象要执行的操作

- 只读修饰符，readonly 关键字进行声明，只读属性必须在声明时或构造函数里被初始化
- 静态属性，属性存在于类本身上面而不是类的实例上，通过 static 进行定义，访问这些属性需要通过 类型.静态属性 的这种形式访问，不能通过实例访问
- 抽象类，抽象类做为其它派生类的基类使用，它们一般不会直接被实例化，不同于接口，抽象类可以包含成员的实现细节 abstract 关键字是用于定义抽象类和在抽象类内部定义抽象方法

typescript 在此基础上添加了三种修饰符

- 公共 public：可以自由的访问类程序里定义的成员
- 私有 private：只能够在该类的内部进行访问
- 受保护 protect：除了在该类的内部可以访问，还可以在子类中仍然可以访问

```ts
class Car {
  // 字段
  engine: string;

  // 构造函数
  constructor(engine: string) {
    this.engine = engine;
  }

  // 方法
  disp(): void {
    console.log("发动机为 :   " + this.engine);
  }
}
```

## 函数

```ts
// 声明函数类型
type ShortHand = (a: number) => number;

// 当函数的参数可能是不存在的，只需要在参数后面加上 ? 代表参数可能不存在
const add = (a: number, b?: number) => a + (b ? b : 0);
```

## 泛型

泛型程序设计（generic programming）允许我们在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型
在 typescript 中，定义函数，接口或者类的时候，不预先定义好具体的类型，而在使用的时候在指定类型的一种特性

泛型通过<>的形式进行表述，可以声明：

- 函数
- 接口
- 类

```ts
// 假设我们用一个函数，它可接受一个 number 参数并返回一个 number 参数，如下写法：
function returnItem(para: number): number {
  return para;
}

// 如果我们打算接受一个 string 类型，然后再返回 string 类型，则如下写法：

function returnItem(para: string): string {
  return para;
}

// 上述两种编写方式，存在一个最明显的问题在于，代码重复度比较高

// 虽然可以使用 any 类型去替代，但这也并不是很好的方案，因为我们的目的是接收什么类型的参数返回什么类型的参数，即在运行时传入参数我们才能确定类型

// 这种情况就可以使用泛型，如下所示：

function returnItem<T>(para: T): T {
  return para;
}

// 可以看到，泛型给予开发者创造灵活、可重用代码的能力
```

### 泛型函数声明

定义泛型的时候，可以一次定义多个类型参数，比如我们可以同时定义泛型 T 和 泛型 U：

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

swap([7, "seven"]); // ['seven', 7]
```

### 泛型接口声明

```ts
interface ReturnItemFn<T> {
  (para: T): T;
}
```

### 泛型类声明

```ts
class Stack<T> {
  private arr: T[] = [];

  public push(item: T) {
    this.arr.push(item);
  }

  public pop() {
    this.arr.pop();
  }
}

const stack = new Stacn<number>();
```

上述只能传递 string 和 number 类型，这时候就可以使用 `<T extends xx>` 的方式来实现**约束泛型**

```ts
type Params = string | number;
class Stack<T extends Params> {
  private arr: T[] = [];

  public push(item: T) {
    this.arr.push(item);
  }

  public pop() {
    this.arr.pop();
  }
}

const stack = new Stacn<boolean>(); // 报错，类型 “boolean” 不兼容类型 string | number”
```

一个函数，这个函数接受两个参数，一个参数为对象，另一个参数为对象上的属性，我们通过这两个参数返回这个属性的值

这时候就涉及到泛型的**索引类型**和**约束类型**共同实现

索引类型 `keyof T` 把传入的对象的属性类型取出生成一个联合类型，这里的泛型 U 被约束在这个联合类型中，如下所示：

```ts
function getValue<T extends object, U extends keyof T>(obj: T, key: U) {
  return obj[key]; // ok
}
```

### 多类型约束

```ts
// 需要实现两个接口的类型约束：
interface FirstInterface {
  doSomething(): number;
}

interface SecondInterface {
  doSomethingElse(): string;
}

// 可以创建一个接口继承上述两个接口
interface ChildInterface extends FirstInterface, SecondInterface {}

class Demo<T extends ChildInterface> {
  private genericProperty: T;

  constructor(genericProperty: T) {
    this.genericProperty = genericProperty;
  }
  useT() {
    this.genericProperty.doSomething();
    this.genericProperty.doSomethingElse();
  }
}

// 通过泛型约束就可以达到多类型约束的目的
```

## 高级类型

常见的高级类型有如下：

- 交叉类型，通过 & 将多个类型合并为一个类型，包含了所需的所有类型的特性，本质上是一种并的操作，T & U
- 联合类型，联合类型的语法规则和逻辑 “或” 的符号一致，表示其类型为连接的多个类型中的任意一个，本质上是一个交的关系，T | U
- 类型别名
- 类型索引
- 类型约束
- 映射类型
- 条件类型

### 类型别名

类型别名会给一个类型起个新名字，类型别名有时和接口很像，但是可以作用于原始值、联合类型、元组以及其它任何你需要手写的类型

```ts
type some = boolean | string;

const b: some = true; // ok
const c: some = "hello"; // ok
const d: some = 123; // 不能将类型“123”分配给类型“some”
```

### 类型索引

keyof 类似于 Object.keys ，用于获取一个接口中 Key 的联合类型

```ts
interface Button {
  type: string;
  text: string;
}

type ButtonKeys = keyof Button;
// 等效于
type ButtonKeys = "type" | "text";
```

### 类型约束

通过关键字 extend 进行约束，不同于在 class 后使用 extends 的继承作用，泛型内使用的主要作用是对泛型加以约束

```ts
type BaseType = string | number | boolean;

// 这里表示 copy 的参数
// 只能是字符串、数字、布尔这几种基础类型
function copy<T extends BaseType>(arg: T): T {
  return arg;
}
```

类型约束通常和类型索引一起使用，例如我们有一个方法专门用来获取对象的值，但是这个对象并不确定，我们就可以使用 extends 和 keyof 进行约束

```ts
function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const obj = { a: 1 };
const a = getValue(obj, "a");
```

### 映射类型

通过 in 关键字做类型的映射，遍历已有接口的 key 或者是遍历联合类型

- keyof T：通过类型索引 keyof 的得到联合类型 'a' | 'b'
- P in keyof T 等同于 p in 'a' | 'b'，相当于执行了一次 forEach 的逻辑，遍历 'a' | 'b'

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Obj {
  a: string;
  b: string;
}

type ReadOnlyObj = Readonly<Obj>;

// 最终ReadOnlyObj的接口为
interface ReadOnlyObj {
  readonly a: string;
  readonly b: string;
}
```

### 条件类型

条件类型的语法规则和三元表达式一致，经常用于一些类型不确定的情况

```ts
// 如果 T 是 U 的子集，就是类型 X，否则为类型 Y
T extends U ? X : Y
```

## TypeScript 装饰器

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上

在不改变原类和使用继承的情况下，动态地扩展对象功能

本质也不是什么高大上的结构，就是一个普通的函数，@expression 的形式其实是 Object.defineProperty 的语法糖

类的装饰器可以装饰：

- 类
- 方法/属性
- 参数
- 访问器

```ts
// 需要在 tsconfig.json 文件启动
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

```ts
function addAge(constructor: Function) {
  constructor.prototype.age = 18;
}

@addAge
class Person {
  name: string;
  age!: number;
  constructor() {
    this.name = "huihui";
  }
}

let person = new Person();

console.log(person.age); // 18
```

## interface 和 type 的区别

最大的区别在于，interface 只能用于定义对象类型，而 type 的声明方式除了对象之外还可以定义交叉、联合、原始类型等，类型声明的方式适用范围显然更加广泛

## 命名空间

TypeScript 与 ECMAScript 2015 一样，任何包含顶级 import 或者 export 的文件都被当成一个模块

相反地，如果一个文件不带有顶级的 import 或者 export 声明，那么它的内容被视为全局可见的

命名空间一个最明确的目的就是解决重名问题

命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的

如果我们需要在外部可以调用 SomeNameSpaceName 中的类和接口，则需要在类和接口添加 export 关键字

```ts
namespace SomeNameSpaceName {
  export interface ISomeInterfaceName {}
  export class SomeClassName {}
}

SomeNameSpaceName.SomeClassName;
```

命名空间本质上是一个对象，作用是将一系列相关的全局变量组织到一个对象的属性

- 命名空间是位于全局命名空间下的一个普通的带有名字的 JavaScript 对象，使用起来十分容易。但就像其它的全局命名空间污染一样，它很难去识别组件之间的依赖关系，尤其是在大型的应用中
- 像命名空间一样，模块可以包含代码和声明。 不同的是模块可以声明它的依赖
- 在正常的 TS 项目开发过程中并不建议用命名空间，但通常在通过 d.ts 文件标记 js 库类型的时候使用命名空间，主要作用是给编译器编写代码的时候参考使用
