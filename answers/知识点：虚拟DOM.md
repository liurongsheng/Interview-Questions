# 知识点：虚拟 DOM

virtual dom 是 vue 和 react 的核心，本文档简写 vdom。

问题：
vdom 是什么？为什么存在 vdom？

vdom 的如何应用，核心 API 是什么？

什么是 diff 算法，去繁就简的介绍

vdom 为何要用 diff 算法？

diff 算法的实现流程

## vdom 是什么？为什么存在 vdom？

- 什么是 vdom
  - virtual dom，虚拟 DOM
  - 利用 JS 模拟 DOM 结构，因为 DOM 操作非常的"昂贵"
  - DOM 变化的对比操作，放在 JS 层来做。前端只有 JS 能做各种逻辑（图灵完备语言）
  - 目的是提高重绘性能

1. DOM 操作是昂贵的，JS 运行效率高，利用 JS 模拟 DOM 结构
2. 尽量减少 DOM 操作，而不是"推到重来"
3. 项目越复杂，影响越严重，将 DOM 对比操作放在 JS 层，提高效率
   vdom 可以解决这些问题

```
// DOM 结构
<ul id='list'>
  <li class='item'>Item 1</li>
  <li class='item'>Item 2</li>
</ul>
```

利用 JS 模拟 DOM 实现

```
{
  tag:'ul',
  attrs:{
    id:'list'
  },
  children:[
    {
      tag:'li',
      attrs: { className: 'item'},
      children: ['Item 1']
     },{
      tag:'li',
      attrs: { className: 'item'},
      children: ['Item 2']
    }
  ]
}
```

浏览器最耗费性能的就是 DOM 操作，而执行 JS 的速度确实非常快的。
宁愿操作一万行 JS 代码，不执行一次 DOM 操作，所以 vdom 是有存在价值的。

需求场景

```
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
```

使用 jQuery 实现

```
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
```

遍历浏览器默认创建的 DOM 节点属性，可以看到属性非常的多，对比 JS 模拟，JS 相当的简单

```
var div = document.createElement('div');
var item, result = '';
for(item in div){
  result += '|' + item;
}
console.log(result)
```

## vdom 如何应用，核心 API 是什么

snabbdom 开源 vdom 库，这里 vdom 是一类技术实现。不限于 vue 和 react，vue2.0 借鉴了 snabbdom 的代码

vdom 的核心 API

- h 函数
- patch 函数

h 函数返回 vnode 节点

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

patch 函数渲染
`patch(container, vnode);`
第一渲染的时候是把 vnode 一次性塞到空的容器中

`patch(vnode, newVnode);`
通过复杂的对比只找出需要更新的部分，尽量减少更新

## diff 算法去繁就简介绍

diff 算法非常复杂，实现难度很大，源码量很大。优秀的 vdom 库没有几个
去繁就简，讲明白核心流程，不关心细节

1. diff 算法是 linux 的基础命令，主要找出文本的不同
2. vdom 中应用的 diff 算法是为了找出需要更新的节点，算是变种
3. diff 实现，patch(container, vnode) 和 patch(vnode, newVnode)
4. 核心逻辑，createElement 和 updateChildren

### vdom 为何使用 diff 算法

- DOM 操作昂贵，尽量减少
- 找出本次 DOM 必须更新的节点来更新，其他的不更新
- 这个找出的过程，就需要 diff 算法

### diff 实现过程

- patch(container, vnode) // 初始化直接插入容器
- patch(vnode, newVnode) // 新旧对比的 vnode
