# React 16 改进

## 全新的调度算法 Fiber

React 16 引入了一个全新的调度算法叫做 Fiber，它在很多方面改进了 Stack Reconciler 的设计。

Fiber 不仅提供了更好的性能，还支持真正的异步渲染，这对于复杂的用户界面来说是非常重要的。

React Fiber 是 Facebook 花费两年余时间对 React 做出的一个重大改变与优化，是对 React 核心算法的一次重新实现。

从 Facebook 在 React Conf 2017 会议上确认。React Fiber 在 React 16 版本发布在 react 中，主要做了以下的操作:

- 为每个增加了优先级，优先级高的任务可以中断低优先级的任务。然后再重新，注意是重新执行优先级低的任务
- 增加了异步任务，调用 requestldleCallbackapi，浏览器空闲的时候执行
- dom diff 树变成了链表，一个 dom 对应两个 fiber(一个链表)，对应两个队列，这都是为找到被中断的任务，重新执行

从架构角度来看，Fiber 是对 React 核心算法(即调和过程)的重写

从编码角度来看，Fiber 是 React 内部所定义的一种数据结构，它是 Fiber 树结构的节点单位，也就是 React 16 新架构下的虚拟 DOM

一个 fiber 就是一个 JavaScript 对象，包含了元素的信息、该元素的更新操作队列、类型
