# Event loop（事件循环）机制

JS的单线程也就是说所有的任务都需要按照一定的规则顺序排队执行，
这个规则就是我们要说明的Event Loop事件环。Event Loop在不同的运行环境下有着不同的方式。

### 浏览器环境下的Event Loop

<img src="img/浏览器中的Event Loop.png" title="浏览器中的Event Loop">

* 当主线程运行的时候，JS会产生堆和栈(执行栈)
* 主线程中调用的webAPI所产生的异步操作(dom事件、ajax回调、定时器等)只要产生结果，
      就把这个回调塞进“任务队列”中等待执行。
* 当主线程中的同步任务执行完毕，系统就会依次读取“任务队列”中的任务，将任务放进执行栈中执行。
* 执行任务时可能还会产生新的异步操作，会产生新的循环，整个过程是循环不断的。

从事件环中不难看出当我们调用setTimeout并设定一个确定的时间，
而这个任务的实际执行时间可能会由于主线程中的任务没有执行完而大于我们设定的时间，
导致定时器不准确，也是连续调用setTimeout与调用setInterval会产生不同效果的原因

```javascript
console.log(1);
console.log(2);
setTimeout(function(){
    console.log(3)
    setTimeout(function(){
        console.log(6);
    })
},0)
setTimeout(function(){
    console.log(4);
    setTimeout(function(){
        console.log(7);
    })
},0)
console.log(5)
```
最终我们得到的输出为1，2，5，3，4，6，7。

### 宏任务与微任务

任务队列中的微任务（micro-task）优先执行有特权，宏任务（macro-task）则没有特权
```javascript
console.log(1);
setTimeout(function(){
    console.log(2);
    Promise.resolve(1).then(function(){
        console.log('promise')
    })
})
setTimeout(function(){
    console.log(3);
})
```
按照“队列理论”，结果应该为1，2，3，promise。
实际结果输出为1，2，promise，3。

### Node环境的Event Loop

Node.js是一个基于Chrome V8引擎的JavaScript运行环境，
Node 不是一门语言，是让js运行在后端的，运行时不包括js全集，
因为在服务端中不包含DOM和BOM，Node也提供了一些新的模块，比如http、fs等模块

Node的首要目标是提供一种简单的，用于创建高性能服务器的开发工具，Web服务器的瓶颈在于并发的用户量，
对比Java和Php的实现方式，** Node在处理高并发，I/O密集场景有明显的性能优势 **

Web 主要场景就是接收客户端的请求读取静态资源和渲染界面，所以Node非常适合Web应用的开发。

<img src="img/node中的Even Loop.png" title="node中的Even Loop">
node中的时间循环与浏览器的不太一样
* timers 阶段: 这个阶段执行setTimeout(callback) and setInterval(callback)预定的callback;
* I/O callbacks 阶段: 执行除了close事件的callbacks、被timers(定时器，setTimeout、setInterval等)设定的callbacks、setImmediate()设定的callbacks之外的callbacks；
* idle, prepare 阶段: 仅node内部使用;
* poll 阶段: 获取新的I/O事件, 适当的条件下node将阻塞在这里;
* check 阶段: 执行setImmediate() 设定的callbacks;
* close callbacks 阶段: 比如socket.on(‘close’, callback)的callback会在这个阶段执行。

每一个阶段都有一个装有callbacks的fifo queue(队列)，
当event loop运行到一个指定阶段时，node将执行该阶段的fifo queue(队列)，
当队列callback执行完或者执行callbacks数量超过该阶段的上限时，event loop会转入下一下阶段。

