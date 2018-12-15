# 知识点：虚拟DOM

virtual dom 是 vue 和 react 的核心，本文档简写 vdom。

问题：
vdom 是什么？为什么存在 vdom？

vdom 的如何应用，核心API是什么？

diff 算法介绍，vdom 中最核心的算法，复杂

## vdom 是什么？为什么存在 vdom？

- 什么是 vdom
  - virtual dom，虚拟DOm
  - 利用JS模拟DOM结构，因为DOM操作非常的"昂贵"
  - DOM变化的对比操作，放在JS层来做。前端只有JS能做各种逻辑（图灵完备语言）
  - 目的是提高重绘性能
```
<ul id='list'>
  <li class='item'>Item 1</li>
  <li class='item'>Item 2</li>
</ul>
```
JS模拟实现
```
{
  tag:'ul',
  attrs:{
    id:'list'
  },
  childred:{
    {
      tag:'li',
      attrs:{className:'item'},
      children:['Item 1']
    },{
      tag:'li',
      attrs:{className:'item'},
      children:['Item 2']
    }
  }
}
```
浏览器最耗费性能的就是DOM操作，而执行js的速度确实非常快的。宁愿操作一万行js代码，不执行一次DOM操作，所以vdom是有存在价值的

<div id="container"></div>
<button id="btn-change">change</button>
<script type="text/javascript" src="./jquery-3.2.1.js"></script>
<script type="text/javascript">
  var data = [
  {
    name:'张三', 
    age:'25', 
    address:'深圳', 
  },{
    name:'李四', 
    age:'26', 
    address:'广州', 
  },{
    name:'王五', 
    age:'26', 
    address:'上海', 
  }]
<script>

使用jQuery实现
// 渲染函数
function render(data){
  var $container = $('#container')
  // 清空现有内容，重要
  $container.html('');
  
  // 拼接 table
  var $table = $('<table>')
  $table.append($('<tr><td>name</td><td>age</td><td>address</td></tr>'))
  
  data.forEach(function(item){
    $table.append($('<tr><td>' + item.name + '</td><td>' + item.age + '</td><td>' +
      item.address + '</td></tr>'
    ))
  })
  // 渲染到页面
  $container.append($table)
}
// 修改信息
$('#btn-change').click(function(){
  data[1].age = 30;
  data[2].address = '深圳';
  render(data)
})

// 初始化时候渲染
render(data)

遍历浏览器默认创建的dom节点属性，可以看到属性非常的多，对比js模拟，js相当的简单
```
var div = document.createElement('div');
var item, result = '';
for(item in div){
  result += '|' + item;
}
console.log(result)
```
## vdom 如何应用，核心API

snabbdom 开源 vdom 库，这里 vdom 是一类技术实现。不限于vue和react

使用jquery需要清空容器

h函数和patch函数是vdom的核心API

h函数返回vnode节点
```
{
  tag:'ul',
  attrs:{
    id:'list'
  },
  childred:{
    {
      tag:'li',
      attrs:{className:'item'},
      children:['Item 1']
    },{
      tag:'li',
      attrs:{className:'item'},
      children:['Item 2']
    }
  }
}
// 使用h函数实现简单的节点
var vnode = h('ul#list',{},[
  h('li.item',{},'Item 1'),
  h('li.item',{},'Item 2'),
])
```
patch函数渲染
patch(container, vnode);
第一渲染的时候是把vnode一次性塞到空的容器中
patch(vnode, newVnode);
通过复杂的对比只找出需要更新的部分，尽量减少更新
