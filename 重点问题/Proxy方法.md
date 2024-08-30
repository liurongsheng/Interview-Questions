# Proxy方法

```js
let a = {};

const proxy = new Proxy(a, {
  get(target, key) {
    console.log(111);
  },
  set(target, key, value) {
    console.log(222);
  }
});
console.log(proxy.b);
proxy.a = 1;
```

依次输出

111
undefined
222
