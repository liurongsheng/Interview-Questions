# vue 中如何解析模板

## 模板是什么
- 本质：字符串
- 有逻辑，如 v-if v-for
- 与 html 格式很像，但有很大区别，可以嵌入 JS 变量
- 最终还要转换为 html 来显示

模板必须转换成 JS 代码，因为：
1. 有逻辑(v-if v-for)，必须用 JS 才能实现(图灵完备语言)
2. 转换为 html 渲染页面，必须用 JS 才能实现
3. 可能存在 JS 变量

因此，模板最终要转换成一个 JS 函数(render函数)

## render 函数

vue 使用到了 with，实际开发不建议使用，不够直观，可能还会导致其他问题
```
var obj = {
  name: 'zhangsan',
  age: 20,
  getAddress: function(){
    alert('shenzhen');
  }
} 
// 使用 with
function fn1(){
  with(obj){
    alert(name);
    alert(age);
    getAddress();
  }
}
// 不适用 with
function fn2(){
  alert(obj.name);
  alert(obj.age);
  obj.getAddress();
}
```
render 函数
1. 模板中所有信息都包含在render函数中
2. this 即 vm
3. price 即 this.price 即 vm.price，即 data 中的 price
4. _c 即 this._c 即 vm._c
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>render 函数实现</title>
</head>
<body>
<div id="app">
    <p>{{price}}</p>
</div>
<!-- 
<script src="./vue.js"></script>
<script>
    var vm = new Vue({
        el:'#app',
        data:{
            price: 100
        }
    })
</script> 
-->
<script type="text/javascript">
// 不用 with 的写法
function render1(){ 
    return vm._c(
        'div',
        {
            attrs:{"id":"app"}
        },
        [
            vm._c('p', [vm._v(vm._s(vm.price))])
        ] // vm._c 函数，vm._v 文本节点，vm._s toString转为字符串
    )
}
// 使用 with 的写法
function render2(){
    with(this){ // 这里的this相当于vm实例
        return _c(
            'div',
            {
                attrs:{"id":"app"}
            },
            [
                _c('p', [_v(_s(price))])
            ]
        )
    }
}
</script>
</body>
</html>
```
## 怎么找到 render 函数
在没有压缩的 vue.js 代码中查找 `code.render` 定位 大概在 10825行。
return 前添加 输出 alert 输出，console输出不完全。
```
var code = generate(ast, options);
  alert(code.render)
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
```
template结构：
```
<div id="root">
    <div>
        <input type="text" v-model="todoValue">
        <button @click="handleBtnClick">提交</button>
    </div>
    <ul>
        <!-- <li v-for="(item, index) in list">{{item}}</li> -->
        <todo-item :content="item"
                   :index="index"
                   v-for="(item, index) in list"
                   @delete="handleItemDelete"
        >
        </todo-item>
    </ul>
</div>
```
转换为render的结构：
```
<script>
  with (this) { 
      return 
      _c(
          'div', {
              attrs: { "id": "root" }
          },
          [
              _c('div', 
                  [_c('input', {
                          directives: [{ 
                              name: "model", 
                              rawName: "v-model", 
                              value: (todoValue), 
                              expression: "todoValue" 
                          }], 
                          attrs: { "type": "text" }, 
                          domProps: { "value": (todoValue) }, 
                          on: { "input": 
                              function ($event) { 
                                  if ($event.target.composing) 
                                  return; 
                                  todoValue = $event.target.value 
                              } 
                          }
                  }),
                  _v(" "), 
                  _c('button', { 
                      on: { "click": handleBtnClick } },
                      [_v("提交")]
                  )]
              ), 
              _v(" "), 
              _c('ul', 
                  _l((list), 
                      function (item, index) {
                          return _c('todo-item', {
                              attrs: { "content": item, "index": index },
                              on: { "delete": handleItemDelete }
                          })
                      }
                  )
              )
          ]
      ) 
  }
</script>
```

## v-model v-if v-for v-on 都是怎么处理的
v-model 双向数据绑定，能够set 和get 
v-on:click 渲染 button 的时候给绑定一个 click 事件，能对应上自己定义的函数
v-for 利用 _l 遍历每个元素。最后返回一个数组，实质上就是一个 for 循环

## render 函数 与 vdom 

render 函数执行是返回 vnode

模板生成 html 的问题
vm._c 是什么？render 函数返回了什么

vm.c 其实就相当于 snabbdom 中的 h 函数(虚拟 dom 中 snabbdom 的 h 函数几乎一样，只是名字的差异)
render函数执行之后，返回的是 vnode

1. updateComponent 中实现了 vdom 的 patch
2. 页面首次渲染执行 updateComponent 
3. data中每次修改属性，执行 updateComponent

```
vm._update(vnode){
  const prevVnode = vm._vnode
  vm._vnode = vnode // 把 vnode 存起来
  if(!prevVnode){ // 第一次的执行的时候没有 prevVnode 值，全部渲染
    vm.$el = vm.__patch__(vm.$el, vnode)
  }else{
    vm.$el = vm.__patch__(prevVnode, vnode) // 如果都有值，就新旧对比
  }
}
function updateComponent(){
  vm.update(vm._render()) //vm.render 即上面的 render 函数，返回 vnode
}
```
