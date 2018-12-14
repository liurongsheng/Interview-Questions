# 知识点：Promise

1. Promise 是具有状态的
- 处在等待被赋值的等待态（pending）
- 被给予一个值并转为解决态（resolved）

2. 一旦 promise 被一个值 resolve 掉，其就会一直保持这个值并不会再被 resolve

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

