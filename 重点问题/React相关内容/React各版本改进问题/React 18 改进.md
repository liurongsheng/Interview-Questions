# React 18 改进

React 18 相对于 React 17 来说，带来了许多重要的更新和新特性，特别是在性能优化和异步渲染方面。以下是一些主要的变化：

## Concurrent Mode（并发模式）

React 18 继续推进了 React 17 开始的 Concurrent Mode 的工作。Concurrent Mode 允许 React 在空闲时间进行更新，而不是阻塞整个浏览器线程。这样可以提高用户体验，即使在执行重渲染时也能保证应用的交互性。

## 自动批处理更新（Automatic Batching）

React 18 引入了自动批处理机制，能够将多个状态更新合并成一次重渲染，减少了不必要的渲染次数，从而提高了性能。例如，在连续调用 setState 方法时，React 会尝试将这些更新合并在一起执行。

## Create Root API

为了支持 Concurrent Mode，React 18 引入了 createRoot 方法来替代原有的 ReactDOM.render 方法。createRoot 提供了一种更安全的方式来启动应用，并允许使用新的特性，比如批处理更新。
Start Transition API：

React 18 新增了 startTransition API，允许开发者标记某些状态更新为过渡性的，这样 React 会在较低优先级下处理这些更新，从而改善用户体验。

## Strict Mode 的新功能

在 React 18 中，Strict Mode 引入了新的检查，帮助开发者发现潜在的问题，特别是在使用新的并发特性时。

## 错误恢复（Error Recovery）

React 18 改进了错误恢复机制，使得在某个组件抛出错误后，其他未受影响的部分仍能正常渲染，而不仅仅是整个应用崩溃。

## Server Components

虽然 Server Components 不是 React 18 的一部分，但是 React 18 为 Server Components 提供了更好的支持，使得在服务器端渲染时可以利用 React 的新特性。

## Suspense for Data Fetching

React 18 改进了 Suspense 的使用体验，使其不仅限于等待异步数据加载，还可以用来处理数据获取过程中的延迟，从而提供更好的用户体验。
这些更新意味着 React 18 更加专注于性能优化和现代化的 Web 应用开发需求，特别是在异步渲染和支持现代 Web 开发模式方面。对于开发者来说，React 18 的这些改进可以帮助构建更加流畅和响应迅速的应用程序。
