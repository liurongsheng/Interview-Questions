# MVVM

## 之前使用 jquery 和现在使用 vue 和 React 框架的区别
- 数据和视图的分离，解耦(对拓展开放，对修改封闭的开放封闭原则)
- 以数据驱动视图，只关心数据变化，DOM 操作被封装

jquery 数据和视图没有分离，直接操作 DOM
vue 数据和视图分离，只操作数据不操作 DOM，以数据驱动视图，只关心数据

两个版本实现todo-list：

jquery 版本需要操作 DOM， 而 vue 只需要操作数据，不需要操作 DOM 结构
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>jquery</title>
</head>
<body>
    <div>
        <input type="text" name="" id="txt-title">
        <button id="btn-submit">submit</button>
    </div>
    <div>
        <ul id="ul-list"></ul>
    </div>
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
    <script type="text/javascript">
        $('#btn-submit').click(function(){
            var title = $('#txt-title').val()
            if(!title){
                return
            }
            var $li = $('<li>'+title+'</li>')
            $('#ul-list').append($li)
            $('#txt-title').val('')
        })
    </script>    
</body>
</html>
```
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>vue</title>
</head>
<body>
    <div id="app">
        <input v-model="title">
        <button v-on:click="add">submit</button>
        <ul>
            <li v-for="item in list">{{item}}</li>
        </ul>
    </div>
    <script src="https://unpkg.com/vue"></script>
    <script type="text/javascript">
        var vm = new Vue({
            el: '#app',
            data: {
                title:'',
                list:[]
            },
            methods: {
                add: function(){
                    this.list.push(this.title)
                    this.title = ''
                }
            }
        })
    </script>    
</body>
</html>
```
 
## 你如何理解MVVM
- MVC
View - Model - Controller

M - Model 数据
V - View 视图、界面
C - Controller 控制器、逻辑处理

用户 =》 View =》 Controller => Model => View
或者 用户 =》 Controller => Model => View

- MVVM
M - Model 数据
V - View 视图、界面
VM - ViewModel 通过事件绑定和数据绑定，是连接器、桥

View =》 事件绑定 =》 Model
Model =》 数据绑定 =》 View
事件绑定和数据绑定由框架( Vue )解决 

<img src="img/MVVM.jpg" title="MVVM" /> 

关于 ViewModel 
作用是 联系 View 和 Model 两者
- MVVM 不算是一种创新
- 但其中的 ViewModel 确实是一种微创新，由后端的 MVC 改进而来
- 真正结合前端场景应用的创建

## MVVM 框架的三大要素
- 响应式：vue 如何监听到 data 的每个属性变化？
- 模板引擎： vue 的模板如何被解析，指令如何处理？
- 渲染：vue 的模板如何被渲染成 html？以及渲染过程

## vue 如何实现响应式
- 什么是响应式
  修改 data 属性之后，vue 立刻监听到
  将 data 属性被代理到 vm 上
- 核心函数 Object.defineProperty ，在ES5中加入，兼容 ie9 及以上

模拟实现
```
<script type="text/javascript">
    var obj = {
        name: 'zhangsan',
        age : 'lisi'
    }
    Object.defineProperty(obj, "name",{
        get: function(){
            console.log('get', name)
            return name
        },
        set: function(){
            console.log('set', newVal)
            name = newVal
        }
    })
    console.log(obj.name) // 可以监听到
    obj.name = 'lisi'     // 可以监听到
</script>    
```