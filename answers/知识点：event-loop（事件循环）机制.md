# Event loop（事件循环）机制

JS的单线程也就是说所有的任务都需要按照一定的规则顺序排队执行，
这个规则就是我们要说明的Event Loop事件环。Event Loop在不同的运行环境下有着不同的方式。

### 浏览器环境下的Event Loop

<img src="img/浏览器中的Event Loop.png" title="浏览器中的Event Loop">

* 当主线程运行的时候，JS会产生堆和栈(执行栈)
* 先执行当前栈，执行完主执行线程中的任务，即执行Microtask微任务队列中任务直到清空。
* 主线程中调用的webAPI所产生的异步操作(dom事件、ajax回调、定时器等)只要产生结果，就把这个回调塞进Macrotask宏任务中等待执行。
* 取出Macrotask宏任务中 一个 任务执行。
* 检查Microtask微任务中有没有任务，如果有任务执行直到清空。
* 重复执行 取出Macrotask宏任务中一个任务执行 和 检查Microtask微任务中有没有任务，有任务就执行。 

整个的这种运行机制又称为Event Loop(事件循环)

从事件环中不难看出当我们调用setTimeout并设定一个确定的时间，
而这个任务的实际执行时间可能会由于主线程中的任务没有执行完而大于我们设定的时间，
导致定时器不准确，也是连续调用setTimeout与调用setInterval会产生不同效果的原因

```javascript
console.log(1);
console.log(2);
setTimeout(function(){
    console.log(3);
    setTimeout(function(){
        console.log(6);
    })
},0);
setTimeout(function(){
    console.log(4);
    setTimeout(function(){
        console.log(7);
    })
},0);
console.log(5)
```
最终我们得到的输出为1，2，5，3，4，6，7。

### 宏任务与微任务

所有同步任务都在主线程上执行，形成一个执行栈主线程之外，还存在一个任务队列。
任务队列分为macro-task(宏任务)和micro-task(微任务)。

>任务队列中的微任务（micro-task）优先执行有特权，宏任务（macro-task）则没有特权

macro-task(宏任务): setTimeout, setInterval, setImmediate, I/O等

micro-task(微任务): process.nextTick,原生Promise,Object.observe(已废弃), MutationObserver等

(有些实现的promise将then方法放到了宏任务中)

```javascript
console.log(1);
setTimeout(function(){
    console.log(2);
    Promise.resolve(1).then(function(){
        console.log('promise')
    })
});
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

<img src="img/node中的Event Loop.png" title="node中的Event Loop">
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


### 总结
同一个上下文下，MicroTask微任务会比MacroTask宏任务先运行。

浏览器是先取出一个MacroTask宏任务执行，再执行MicroTask微任务中的所有任务。

Node是按照六个阶段执行，每个阶段切换时，再执行MicroTask微任务队列

同个MicroTask队列下process.tick()会优于Promise

setImmdieate()和setTimeout()，如果他们在异步i/o callback之外调用（在i/o内调用因为下一阶段为check阶段），
其执行先后顺序是不确定的,需要看loop的执行前的耗时情况。
