# 对Fiber架构的理解？解决了什么问题

## Fiber架构要解决的问题

JavaScript引擎和页面渲染引擎两个线程是互斥的，当其中一个线程执行时，另一个线程只能挂起等待

如果 JavaScript 线程长时间地占用了主线程，那么渲染层面的更新就不得不长时间地等待，界面长时间不更新，会导致页面响应度变差，用户可能会感觉到卡顿

而这也正是 React15 的 Stack Reconciler 所面临的问题，当 React 在渲染组件时，从开始到渲染完成整个过程是一气呵成的，无法中断

如果组件较大，那么 js 线程会一直执行，然后等到整棵 VDOM 树计算完成后，才会交给渲染的线程

这就会导致一些用户交互、动画等任务无法立即得到处理，导致卡顿的情况

## Fiber架构如何解决问题

Fiber 把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务;

如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行即可以中断与恢复，恢复后也可以复用之前的中间状态，

并给不同的任务赋予不同的优先级，其中每个任务更新单元为 React Element 对应的Fiber节点

实现的上述方式的是 requestIdleCallback 方法

window.requestIdleCallback()方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，
如动画和输入响应

首先 React 中任务切割为多个步骤，分批完成。在完成一部分任务之后，将控制权交回给浏览器，让浏览器有时间再进行页面的渲染。

等浏览器忙完之后有剩余时间，再继续之前 React 未完成的任务，是一种合作式调度。

该实现过程是基于 Fiber 节点实现，作为静态的数据结构来说，每个Fiber节点对应一个React element ，

保存了该组件的类型(函数组件/类组件/原生组件等等)、对应的 DOM 节点等信息。

作为动态的工作单元来说，每个Fiber节点保存了本次更新中该组件改变的状态、要执行的工作。

每个 Fiber 节点有个对应的 React element ，多个 Fiber 节点根据如下三个属性构建一颗树:

```js
// 指向父级Fiber节点
this.return = null
// 指向子Fiber节点
this.child = null
// 指向右边第一个兄弟Fiber节点
this.sibling = null
```

通过这些属性就能找到下一个执行目标
