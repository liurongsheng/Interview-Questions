# 懒加载和预加载

在 js 中，我们可以使用 import() 语法实现懒加载，通过 webpackPrefetch: true 实现预加载

懒加载的前提条件是：进行了代码分割 code split 配置

只要加载过一次，那么下次就不需要加载了会使用缓存

```js
document.getElementById('btn').onclick = function() {
  // 懒加载~：当文件需要使用时才加载~
  // 预加载 prefetch：会在使用之前，提前加载js文件 
  // 正常加载可以认为是并行加载（同一时间加载多个文件）  
  // 预加载 prefetch：等其他资源加载完毕，浏览器空闲了，再偷偷加载资源
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
    console.log(mul(4, 5));
  });
};
```

如果配置了预加载参数

打包的时候会给出提示 prefetch 的`Entrypoint main = js/main.d8fd8c9cb2.js (prefetch: js/test.3664330d26.js)`

懒加载支持较好，预加载在低版本浏览器兼容性差，慎用
