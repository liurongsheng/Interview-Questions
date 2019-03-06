## 利用ES5的Object.defineProperty数据劫持实现双向绑定

数据劫持：在访问或者修改对象的某个属性时，通过一段代码拦截这个行为，进行额外的操作或者修改返回结果。
数据劫持最典型的应用------双向的数据绑定

1. Vue 2.x 利用 Object.defineProperty()，并且把内部解耦为 Observer, Dep 并使用 Watcher 相连

2. Vue 在 3.x 版本之后改用 Proxy 进行实现

Object.defineProperty(obj, prop, descriptor)
- obj 要在其上定义属性的对象
- prop 要定义或修改的属性的名称
- descriptor 将被定义或修改的属性描述符

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ES5的Object.defineProperty属性实现双向绑定</title>
  <script>
    const obj = {
      value: ''
    };

    function onKeyUp(event) {
      obj.value = event.target.value
    }

    // 对 obj.value 进行拦截
    Object.defineProperty(obj, 'value', {
      get: function () {
        return value
      },
      set: function (newValue) {
        value = newValue;
        document.querySelector('#value').innerHTML = newValue // 更新视图层
        document.querySelector('input').value = newValue // 数据模型改变
      }
    })
  </script>
</head>
<body>
  <p>
    输入的值是：<span id="value"></span>
  </p>
  <input type="text" onkeyup="onKeyUp(event)">
</body>
</html>
```

Object.defineProperty 存在的三个问题

1. 不能监听数组的变化
数组的这些方法是无法触发set的:push, pop, shift, unshift,splice, sort, reverse.
Vue 把会修改原来数组的方法定义为变异方法 (mutation method)
非变异方法 (non-mutating method):例如 filter, concat, slice 等，它们都不会修改原始数组，而会返回一个新的数组。
Vue 的做法是把这些方法重写来实现数组的劫持。

2. 必须遍历对象的每个属性
必须遍历对象的每个属性
使用 Object.defineProperty() 多数要配合 Object.keys() 和遍历，，于是多了一层嵌套

3. 必须深层遍历嵌套的对象
当一个对象为深层嵌套的时候,必须进行逐层遍历，直到把每个对象的每个属性都调用 Object.defineProperty() 为止。 



