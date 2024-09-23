# webwoker

Web Worker 是 HTML5 引入的一个 API，它允许在浏览器中创建独立于主线程（UI 线程）的后台线程

这些后台线程可以执行一些复杂的计算任务，而不会阻塞主线程，从而保证用户界面的流畅性和响应性

## 注意事项

- 通信机制

  - 主线程和 Worker 之间通过 postMessage 和 onmessage 进行通信
  - 通信是非同步的，需要妥善处理同步问题

- 资源访问限制

  - Worker 不能直接访问 DOM 或者某些全局对象，如 window
  - Worker 不能直接访问 Canvas 或者 WebGL 上下文

- 调试困难

  - 相较于主线程，Worker 的调试较为困难，因为大多数开发者工具提供的调试支持有限

## echarts、canvas 这种渲染耗时的工作能不能放在 webworker 中做？

ECharts 和 Canvas 渲染通常是运行在主线程上的，因为它们需要直接操作 DOM 或者 Canvas 上下文，这些都是主线程的任务

Web Workers 不能直接访问 DOM 或者 Canvas API，因此它们不能直接进行渲染

## 示例

```js
// 主线程
const worker = new Worker('worker.js');

worker.postMessage({ message: 'Hello from main thread!' });

worker.onmessage = function(event) {
  console.log('Received message:', event.data);
};

// worker.js
self.onmessage = function(event) {
  console.log('Received message:', event.data);
  self.postMessage({ message: 'Hello from worker!' });
};
```
