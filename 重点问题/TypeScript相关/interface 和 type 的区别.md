# interface 和 type 的区别

[interface 和 type 的区别](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

最大的区别在于，interface 只能用于定义对象类型，而 type 的声明方式除了对象之外还可以定义交叉、联合、原始类型等，类型声明的方式适用范围显然更加广泛

tslint 中有一条规则：当两者皆可的时候，要优先使用 interface。所以在 tslint 改规则之前，就优先使用 interface

## 应用场景

- interface 只能用于定义对象结构，例如函数参数和返回值的形状
- type 除了定义对象之外还可以定义交叉、联合、原始类型等

## 扩展与继承

- interface 支持直接通过 extends 关键字来扩展其他接口
- type 则通过交集类型 (&) 来组合多个类型

## 重定义

- interface 允许对同一个接口进行多次声明，这些声明会被自动合并
- type 不能被重新定义，如果尝试重新定义一个已存在的类型，TypeScript 编译器会报错

```ts
interface Person {
  name: string;
  age: number;
}

interface Person {
  gender: string;
}

const person: Person = {
  name: "John",
  age: 30,
  gender: "Male",
};
```

```ts
type Person = {
  name: string;
  age: number;
};

type Person = {
  gender: string;
};

const person: Person = {
  name: "John",
  age: 30,
  gender: "Male",
};
```

## 编译行为

- interface 主要用于描述对象的结构，它不生成任何额外的运行时代码
- type 也是在编译阶段进行类型检查，同样不会影响最终生成的 JavaScript 代码

## 可读性和约定

- 使用 interface 可以更好地表达出代码意图，尤其是在定义 API 或者库的时候
- type 通常用于更底层或内部的类型定义，尤其是当类型定义较为复杂或者需要利用类型系统特性时
