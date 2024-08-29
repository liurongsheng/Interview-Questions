# Real Dom 和 Virtual Dom 的区别？优缺点？

## Real Dom 和 Virtual Dom 是什么

Real Dom 是真实的 DOM，意思是文档对象模型，是一个结构化文本的抽象，在页面渲染出的每一个节点都是一个真实的 DOM结构。如下：

```html
<div id="root">
    <h1>Hello Wordld</h1>
</div>
```

Virtual Dom 本质上是以 JavaScript 对象形式存在的对 DOM 的描述

创建虚拟 DOM 目的是为了更好的将虚拟的节点渲染到页面视图中，虚拟 DOM 对象的节点与真实 DOM 的属性一一对应

在React 中，JSX 是其一大特点，可以在 JS 中通过使用 XML 的方式去直接声明界面的 DOM 结构

ReactDOM.render() 用于将创建好的虚拟 DOM 节点插入到某个真实的节点上，并渲染到页面上

JSX 实际是是一个语法糖，最终会被编译成 React.createElement() 函数，如下：

JSX 就是为了简化直接调用 React.createElement() 方法：

- 第一个参数是标签名，例如 h1、div、span 等等
- 第二个参数是个对象，里面存着标签的属性，例如 id、className、style、onClick 等等
- 第三个参数是节点中的文本

## Real Dom 和 Virtual Dom 的区别

两者的区别在于：

- 虚拟 DOM 不会进行排版与重绘操作，而真实 DOM 会频繁重排与重绘操作
- 虚拟 DOM 的总消耗是“虚拟 DOM 增删改 + 真实 DOM 差异增删改 + 排版与重绘”，真实 DOM 的总消耗是“真实 DOM 完全增删改+排版与重绘”

传统的原生 api 或者 jQuery 操作 DOM，浏览器会从构建 DOM 树开始从头到尾执行一遍流程，当一次操作，需要更新 10 个 DOM 节点时，浏览器没有那么智能，收到第一个更新 DOM 请求后，并不知道后续还有 9 次更新操作，因此会马上执行流程，最终会执行 10 次流程

而通过 VNode，同样更新 10 个 DOM 节点，虚拟 DOM 不会立即操作 DOM，而是将这10次更新的 diff 内容保存到本地的一个 js 对象中，最终将这个 js 对象一次性 attach 到 DOM 树上，避免大量的无谓计算

## Real Dom 和 Virtual Dom 的优缺点

真实 DOM 的优势：

- 易用

缺点：

- 效率低，解析速度慢，内存占用量过高
- 性能差，频繁操作真实的 DOM，易于导致重绘与回流

使用虚拟 DOM 的优势：

- 简单方便：如果使用手动操作真实的 DOM 来完成页面，繁琐又容易出错，在大规模应用下维护起来也很困难
- 性能方面：使用虚拟 DOM，能够有效避免真实 DOM 的频繁更新，减少多次引起重绘与回流，提高页面性能
- 跨平台：React 借助虚拟DOM，带来了跨平台的能力，一套代码多端运行，可以很方便的在浏览器、React Native、小程序、Node 等环境进行开发
