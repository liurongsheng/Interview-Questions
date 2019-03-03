# 知识点：Promise

1. Promise 是具有状态的
- 处在等待被赋值的等待态（pending）
- 被给予一个值并转为解决态（resolved）

2. 一旦 promise 被一个值 resolve 掉，其就会一直保持这个值并不会再被 resolve

## Promise的executor以及then的执行方式
Promise 的 executor 是同步的

从Promise的实现来说，Promise 的 executor 是一个同步函数，即非异步，立即执行的一个函数，因此他应该是和当前的任务一起执行的。
而 Promise 的链式调用 then，每次都会在内部生成一个新的 Promise，然后执行then，在执行的过程中不断向微任务(microtask)推入新的函数，
因此直至微任务(microtask)的队列清空后才会执行下一波的 macrotask。

## Promise的then中创建一个Promise
一个Promise所有的then的回调函数是在一个microtask函数中执行的，
但是每一个回调函数的执行，又按照情况分为立即执行，微任务(microtask)和宏任务(macrotask)。



```
new Promise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    new Promise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})
```
输出：promise1，then11，promise2，then21，then12，then23

新promise的then函数输出then21和promise的第二个then函数输出then12

## 回调模式的语法糖

原始写法：
```javascript
// 声明
function doSomething(callback) {
  var value = 42;
  callback(value);
}

doSomething(function(value) {
  console.log('Got a value:' + value);
});
```

改写：
```javascript
// Promise 基础版
function doSomething() {
  return {
    then: function(callback) {
      var value = 42;
      callback(value);
    }
  };
}

doSomething().then(function(value) {
  console.log('Got a value:' + value);
});
```

1. 初始化，状态：pending
2. 当调用resolve(成功)，状态：pending=>fulfilled
3. 当调用reject(失败)，状态：pending=>rejected

reslove(成功时)，调用onFulfilled
reject(失败时)， 调用Rejected
