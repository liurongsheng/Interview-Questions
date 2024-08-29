# React各版本改进问题

## React 18

React 18 相对于 React 17 来说，带来了许多重要的更新和新特性，特别是在性能优化和异步渲染方面。以下是一些主要的变化：

### Concurrent Mode（并发模式）

React 18 继续推进了 React 17 开始的 Concurrent Mode 的工作。Concurrent Mode 允许 React 在空闲时间进行更新，而不是阻塞整个浏览器线程。这样可以提高用户体验，即使在执行重渲染时也能保证应用的交互性。

### 自动批处理更新（Automatic Batching）

React 18 引入了自动批处理机制，能够将多个状态更新合并成一次重渲染，减少了不必要的渲染次数，从而提高了性能。例如，在连续调用 setState 方法时，React 会尝试将这些更新合并在一起执行。

### Create Root API

为了支持 Concurrent Mode，React 18 引入了 createRoot 方法来替代原有的 ReactDOM.render 方法。createRoot 提供了一种更安全的方式来启动应用，并允许使用新的特性，比如批处理更新。
Start Transition API：

React 18 新增了 startTransition API，允许开发者标记某些状态更新为过渡性的，这样 React 会在较低优先级下处理这些更新，从而改善用户体验。

### Strict Mode 的新功能

在 React 18 中，Strict Mode 引入了新的检查，帮助开发者发现潜在的问题，特别是在使用新的并发特性时。

### 错误恢复（Error Recovery）

React 18 改进了错误恢复机制，使得在某个组件抛出错误后，其他未受影响的部分仍能正常渲染，而不仅仅是整个应用崩溃。

### Server Components

虽然 Server Components 不是 React 18 的一部分，但是 React 18 为 Server Components 提供了更好的支持，使得在服务器端渲染时可以利用 React 的新特性。

### Suspense for Data Fetching

React 18 改进了 Suspense 的使用体验，使其不仅限于等待异步数据加载，还可以用来处理数据获取过程中的延迟，从而提供更好的用户体验。
这些更新意味着 React 18 更加专注于性能优化和现代化的 Web 应用开发需求，特别是在异步渲染和支持现代 Web 开发模式方面。对于开发者来说，React 18 的这些改进可以帮助构建更加流畅和响应迅速的应用程序。

## React 17

React 17 相比 React 16 的主要更新集中在底层架构的变化，目的是为了更好地兼容未来的 React 特性，特别是那些在 React 18 中引入的。以下是 React 17 相对于 React 16 的一些重要变化：

### 事件代理的更改

- React 17 改变了事件代理的实现方式，从之前在 document 对象上监听事件变为在每个 React 应用的 rootNode 节点上绑定事件处理器。这一改动有助于解决多个版本的 React 应用在同一页面中共存时可能出现的问题。
- onScroll 事件不再冒泡，这可以避免一些常见的问题。

### 新的 JSX 转换

React 17 引入了新的 JSX 转换规则，虽然对于大多数开发者来说这不会直接影响到他们的代码编写方式，但这为未来的 React 版本提供了更好的支持。

### 事件池(event pooling)的改变

在 React 17 中，事件池机制被移除，因此不再需要调用 e.persist() 来保留事件对象。现在可以在异步回调中直接访问事件对象，使得事件处理逻辑更加直观。

### 异步执行

React 17 使副作用清理函数（如 componentWillUnmount 或 useEffect 的清理函数）在浏览器完成渲染之后异步执行。

### forwardRef 和 memo 组件行为一致化

在 React 17 中，forwardRef 和 memo 包装的组件在某些情况下（例如返回 undefined 时）的行为与普通的函数组件和类组件保持一致。

总的来说，React 17 的目标主要是为了简化框架内部结构，为未来版本的功能铺平道路，而不是引入许多面向用户的显著新特性。这意味着对于大多数应用程序来说，React 16 到 React 17 的迁移应该相对平滑，不会涉及到大量的代码更改

## React 16

### 全新的调度算法z Fiber

React 16 引入了一个全新的调度算法叫做 Fiber，它在很多方面改进了 Stack Reconciler 的设计。

Fiber 不仅提供了更好的性能，还支持真正的异步渲染，这对于复杂的用户界面来说是非常重要的。

React Fiber 是 Facebook 花费两年余时间对 React 做出的一个重大改变与优化，是对 React 核心算法的一次重新实现。

从Facebook在 React Conf 2017 会议上确认。React Fiber 在React 16 版本发布在 react 中，主要做了以下的操作:

- 为每个增加了优先级，优先级高的任务可以中断低优先级的任务。然后再重新，注意是重新执行优先级低的任务
- 增加了异步任务，调用 requestldleCallbackapi，浏览器空闲的时候执行
- dom diff树变成了链表，一个dom对应两个fiber(一个链表)，对应两个队列，这都是为找到被中断的任务，重新执行

从架构角度来看，Fiber是对 React 核心算法(即调和过程)的重写

从编码角度来看，Fiber是 React 内部所定义的一种数据结构，它是 Fiber 树结构的节点单位，也就是 React 16 新架构下的虚拟 DOM

一个 fiber 就是一个 JavaScript 对象，包含了元素的信息、该元素的更新操作队列、类型，其数据结构如下:

## React 15

### Stack Reconciler

Stack Reconciler 是一个用于优化 React 更新过程的关键组件。

在 React 15 版本中，为了提高列表渲染和更新的性能，Facebook 引入了这个新的 reconciler 算法。

Stack Reconciler 主要是为了处理虚拟 DOM 树的比较与更新操作，它通过栈（stack）的方式来管理递归调用，从而更有效地处理嵌套组件的更新。

Stack Reconciler 的特点

- 性能优化：通过栈来管理递归调用，减少内存消耗。
- 更好的列表渲染：对于大量列表项的更新更加高效。
- 异步支持：虽然 React 15 中的 Stack Reconciler 没有完全实现异步渲染，但它为后续版本中引入异步功能奠定了基础。

如何工作

- 初始化栈：当开始渲染一个新的树或者更新现有的树时，Stack Reconciler 会创建一个栈来跟踪当前的渲染状态。
- 递归处理：对于每一个需要被渲染或更新的组件，Stack Reconciler 会将其相关信息压入栈中，并且处理子组件。
- 比较差异：在栈中逐层比较新旧虚拟 DOM 树，找出需要更新的部分。
- 应用更改：一旦确定了需要更新的部分，Stack Reconciler 将这些更改应用到实际的 DOM 上。

总结
尽管 Stack Reconciler 在 React 15 中起到了重要的作用，但随着 React 技术的发展，尤其是 React 16 及其后续版本中 Fiber 的引入，Stack Reconciler 已经不再是最新版本的核心部分。不过理解 Stack Reconciler 的工作机制对于理解 React 的历史发展以及如何优化应用程序仍然非常有价值。
