# vue 整体实现流程

第一步：解析模板成 render 函数
第二步：响应式开始监听
第三步：首次渲染，显示页面，且绑定依赖
第四步：data 属性变化，触发 rerender

[知识点：源码系列Vue问题.md] 解析模板成 render 函数的具体实现

[知识点：MVVM.md] 响应式监听的具体实现

## 第一步：解析模板成 render 函数
1. with 的写法
2. 模板中所有信息都被 render 函数包含
3. 模板中用到的 data 中的属性，都变成了 JS 变量
4. 模板中的 v-model v-for v-on 都变成了 JS 逻辑
5. render 函数返回 vnode

## 第二步：响应式开始监听
1. Object.defineProperty的 set() 和 get() 方法
2. 将 data 的属性代理到 vm 上

## 第三步：首次渲染，显示页面，且绑定依赖
1. 初次渲染，执行 updateComponent，执行 vm._render()
2. 执行 render 函数，会访问到 vm.list 和 vm.title
3. 会被响应式的 get 方法监听到
4. 执行 updateComponent，会走到 vdom 的 patch 方法
5. patch 将 vnode 渲染成 DOM，初次渲染完成

为什么会被响应式的 get() 监听，直接监听 set() 不行么？
- data 中有很多属性，有些会被用到，有些可能不会被用到
- 被用到的会走到 get，不会用到的不会走到 get
- 未走到 get 中的属性，set 的时候我们就无需关心
- 避免不必要的重复渲染

## 第四步：data 属性变化，触发 rerender
1. 修改属性，被响应式的 set 监听到
2. set 中执行 updateComponent
3. updateComponent 重新执行 vm.render()
4. 生成的 vnode 和 prevVnode，通过 patch 进行对比
5. 渲染到 html 中