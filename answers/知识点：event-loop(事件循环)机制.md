# Event loop（事件循环）机制

JS 的单线程也就是说所有的任务都需要按照一定的规则顺序排队执行，
这个规则就是我们要说明的 Event Loop 事件环。Event Loop 在不同的运行环境下有着不同的方式。

## 宏任务与微任务

所有同步任务都在主线程上执行，形成一个执行栈主线程之外，还存在一个任务队列。
任务队列分为 macro-task(宏任务) 和 micro-task(微任务)。

> 任务队列中的微任务（micro-task）优先执行有特权，宏任务（macro-task）则没有特权

macro-task(宏任务): setTimeout, setInterval, setImmediate, I/O 等

micro-task(微任务): process.nextTick, 原生 Promise, Object.observe(已废弃), MutationObserver 等

原生 Promise 的 then 是微任务

```javascript
console.log(1);
setTimeout(function () {
  console.log(2);
  Promise.resolve(1).then(function () {
    console.log("promise");
  });
});
setTimeout(function () {
  console.log(3);
});
```

按照“队列理论”，结果应该为 1，2，3，promise
实际结果输出为 1，2，promise，3

```javascript
setTimeout(() => {
  console.log(1);
}, 0);
let a = new Promise((resolve) => {
  console.log(2);
  resolve();
})
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(4);
  });
console.log(5);
```

输出为 2，5，3，4，1

如果要定时输出 100 个相同的内容，如何实现

```js
for (var i = 0; i < 100; i++) {
  setTimeout(function () {
    console.log("我是输出！");
  }, 1000 * i);
}
```

### 浏览器环境下的 Event Loop

<img src="img/浏览器中的Event Loop.png" title="浏览器中的Event Loop">

- 当主线程运行的时候，JS 会产生堆和栈(执行栈)
- 先执行当前栈，执行完主执行线程中的任务，即执行 Microtask 微任务队列中任务直到清空。
- 主线程中调用的 webAPI 所产生的异步操作(dom 事件、ajax 回调、定时器等)只要产生结果，就把这个回调塞进 Macrotask 宏任务中等待执行。
- 取出 Macrotask 宏任务中 一个 任务执行。
- 检查 Microtask 微任务中有没有任务，如果有任务执行直到清空。
- 重复执行 取出 Macrotask 宏任务中一个任务执行 和 检查 Microtask 微任务中有没有任务，有任务就执行。

整个的这种运行机制又称为 Event Loop(事件循环)

从事件环中不难看出当我们调用 setTimeout 并设定一个确定的时间，
而这个任务的实际执行时间可能会由于主线程中的任务没有执行完而大于我们设定的时间，
导致定时器不准确，也是连续调用 setTimeout 与调用 setInterval 会产生不同效果的原因

```js
console.log(1);
console.log(2);
setTimeout(function () {
  console.log(3);
  setTimeout(function () {
    console.log(6);
  });
}, 0);
setTimeout(function () {
  console.log(4);
  setTimeout(function () {
    console.log(7);
  });
}, 0);
console.log(5);
```

最终我们得到的输出为 1，2，5，3，4，6，7。

### Node 环境的 Event Loop

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，
Node 不是一门语言，是让 js 运行在后端的，运行时不包括 js 全集，
因为在服务端中不包含 DOM 和 BOM，Node 也提供了一些新的模块，比如 http、fs 等模块

Node 的首要目标是提供一种简单的，用于创建高性能服务器的开发工具，Web 服务器的瓶颈在于并发的用户量，
对比 Java 和 Php 的实现方式，**Node 在处理高并发，I/O 密集场景有明显的性能优势**

Web 主要场景就是接收客户端的请求读取静态资源和渲染界面，所以 Node 非常适合 Web 应用的开发。

<img src="img/node中的Event Loop.png" title="node中的Event Loop">
node中的时间循环与浏览器的不太一样

    * timers 阶段: 这个阶段执行setTimeout(callback) and setInterval(callback)预定的callback;
    * I/O callbacks 阶段: 执行除了close事件的callbacks、被timers(定时器，setTimeout、setInterval等)设定的callbacks、setImmediate()设定的callbacks之外的callbacks；
    * idle, prepare 阶段: 仅node内部使用;
    * poll 阶段: 获取新的I/O事件, 适当的条件下node将阻塞在这里;
    * check 阶段: 执行setImmediate() 设定的callbacks;
    * close callbacks 阶段: 比如socket.on(‘close’, callback)的callback会在这个阶段执行。

每一个阶段都有一个装有 callbacks 的 fifo queue(队列)，
当 event loop 运行到一个指定阶段时，node 将执行该阶段的 fifo queue(队列)，
当队列 callback 执行完或者执行 callbacks 数量超过该阶段的上限时，event loop 会转入下一下阶段。

### 总结

同一个上下文下，MicroTask 微任务会比 MacroTask 宏任务先运行。

浏览器是先取出一个 MacroTask 宏任务执行，再执行 MicroTask 微任务中的所有任务。

Node 是按照六个阶段执行，每个阶段切换时，再执行 MicroTask 微任务队列

同个 MicroTask 队列下 process.tick()会优于 Promise

setImmdieate()和 setTimeout()，如果他们在异步 i/o callback 之外调用（在 i/o 内调用因为下一阶段为 check 阶段），
其执行先后顺序是不确定的,需要看 loop 的执行前的耗时情况。
