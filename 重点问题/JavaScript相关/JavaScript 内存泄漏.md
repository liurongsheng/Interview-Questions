# JavaScript 内存泄漏

Javascript 具有自动垃圾回收机制(GC:Garbage Collecation)

也就是说，执行环境会负责管理代码执行过程中使用的内存

原理：垃圾收集器会定期(周期性)找出那些不在继续使用的变量，然后释放其内存

通常情况下有两种实现方式:

- 标记清除
- 引用计数

## 标记清除

JavaScript 最常用的垃圾收回机制

当变量进入执行环境是，就标记这个变量为“进入环境“。进入环境的变量所占用的内存就不能释放，当变量离开环境时，则将其标记为“离开环境”

垃圾回收程序运行的时候，会标记内存中存储的所有变量。然后，它会将所有在上下文中的变量，以及被在上下文中的变量引用的变量的标记去掉

在此之后再被加上标记的变量就是待删除的了，原因是任何在上下文中的变量都访问不到它们了

随后垃圾回收程序做一次内存清理，销毁带标记的所有值并收回它们的内存

```js
var m = 0,
  n = 19; // 把 m, n, add()标记为进入环境
add(m, n); // 把 a, b, c标记为进入环境
console.log(n); // a, b, c标记为离开环境,等待垃圾回收
function add(a, b) {
  a++;
  varc = a + b;
  return c;
}
```

## 引用计数

语言引擎有一张"引用表"，保存了内存里面所有的资源(通常是各种值)的引用次数。如果一个值的引用次数是 0，就表示这个值不再用到了

因此可以将这块内存释放如果一个值不再需要了，引用数却不为 0，垃圾回收机制无法释放这块内存，从而导致内存泄漏

```js
const arr = [1, 2, 3, 4];
console.log("hello");
```

上面代码中，数组[1, 2, 3, 4]是一个值，会占用内存。变量 arr 是仅有的对这个值的引用，因此引用次数为 1

尽管后面的代码没有用到 arr，它还是会持续占用内存如果需要这块内存被垃圾回收机制释放

只需要设置 `arr = null`，就解除了对数组[1,2,3,4]的引用，引用次数变为 0，就被垃圾回收了

## 常见的内存泄漏情况

- 意外的全局变量

```js
function foo(arg) {
  bar = "this is a hidden global variable";
}
```

- this 创建

```js
function foo() {
  this.variable = "potential accidental global";
}
// foo调用自己，this 指向了全局对象(window)
foo();
```

上述使用严格模式，可以避免意外的全局变量

- 定时器也常会造成内存泄露

```js
var someResource = getData();
setInterval(function () {
  var node = document.getElementById("Node");
  if (node) {
    // 处理 node 和 someResource
    node.innerHTML = JSON.stringify(someResource);
  }
}, 1000);
```

如果 id 为 Node 的元素从 DOM 中移除，该定时器仍会存在，同时，因为回调函数中包含对 someResource 的引用，定时器外面的 someResource 也不会被释放

- 闭包也会造成内存泄露，维持函数内局部变量，使其得不到释放

```js
function bindEvent() {
  var obj = document.createElement("XXX");
  var unused = function () {
    console.log(obj, "闭包内引用 obj obj 不会被释放");
    obj = null; // 解决方法
  };
}
```

- 没有清理对 DOM 元素的引用同样造成内存泄露

```js
const refA = document.getElementById("refA");
document.body.removeChild(refA); // dom 删除了
console.log(refA, "refA"); // 但是还存在引用能 console 出整个 div 没有被回收
refA = null;
console.log(refA, "refA"); // 解除引用
```

- 包括使用事件监听 addEventListener 监听的时候，在不监听的情况下使用 removeEventListener 取消对事件监听
