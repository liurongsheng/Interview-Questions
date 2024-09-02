# Vue 组件之间的通信方式都有哪些

## 组件间通信的分类

- 父子组件之间的通信
- 兄弟组件之间的通信
- 祖孙与后代组件之间的通信
- 非关系组件间之间的通信

具体的类型有：

- 通过 props 传递
- 通过 $emit 触发自定义事件
- 使用 ref
- EventBus
- parent 或 root
- attrs 与 listeners
- Provide 与 Inject
- Vuex

### 通过 props 传递

- 适用场景：父组件传递数据给子组件
- 子组件设置 props 属性，定义接收父组件传递过来的参数
- 父组件在使用子组件标签中通过字面量来传递值

// Father.vue

```js
<Children name="jack" age=18 />
```

// Children.vue

```js
props:{
  // 字符串形式
  name:String, // 接收的类型参数
  //对象形式
  age:{
    type:Number，// 接收的类型为数值
    defaule:18，// 默认值为18
    require:true // age属性必须传递
    }
}
```

### 通过 $emit 触发自定义事件

- 适用场景：子组件传递数据给父组件
- 子组件通过 $emit触发 自定义事件，$emit 第二个参数为传递的数值
- 父组件绑定监听器获取到子组件传递过来的参数

// Father.vue

```js
<Children @add="cartAdd($event)"/>
```

// Children.vue

```js
this.$emit('add', good)
```

## ref

父组件在使用子组件的时候设置 ref
父组件通过设置子组件 ref 来获取数据

```js
<Children ref="foo" />
this.$refs.foo // 获取子组件实例，通过子组件实例我们就能拿到对应的数据
```

### EventBus

- 使用场景：兄弟组件传值
- 创建一个中央事件总线 EventBus
- 兄弟组件通过 $emit 触发自定义事件，$emit 第二个参数为传递的数值
- 另一个兄弟组件通过 $on 监听自定义事件

### parent 或 root

通过共同祖辈 $parent 或 $root 搭建通信桥连

兄弟组件

`this.$parent.$on('add', this.add)`

另一个兄弟组件

`this.$parent.$emit('add')`

### attrs 与 listeners

- 适用场景：祖先传递数据给子孙
- 设置批量向下传属性 $attrs 和 $listeners
- 包含了父级作用域中不作为 prop 被识别(且获取)的特性绑定(class 和 style 除外)。
- 可以通过 v-bind="$attrs" 传入内部组件

### provide 与 inject

祖先组件

```js
provide() {
  return {foo:'foo'}
}
```

后代组件

```js
inject: ['foo'] // 获取到祖先组件传递过来的值
```

### vuex

适用场景: 复杂关系的组件数据传递

Vuex 作用相当于一个用来存储共享变量的容器

- state 存放共享变量的地方
- getter 类似于 Vue 的计算属性，用于获取 state 中的数据，并可以缓存返回结果。
- mutations 用来存放修改 state 的方法
- actions 也是用来存放修改state的方法，不过 action 是在 mutations 的基础上进行
- modules：将 store 分割成模块化的形式

```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    getCount: state => state.count
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    increment({ commit }) {
      commit('increment');
    }
  },
  modules: {
    // 可以在这里添加模块
  }
});
```

总结：

- 父子关系的组件数据传递选择 props 与 $emit 进行传递，也可选择 ref
- 兄弟关系的组件数据传递可选择 $bus，其次可以选择 $parent 进行传递
- 祖先与后代组件数据传递可选择 attrs 与 listeners 或者 provide 与 inject
- 复杂关系的组件数据传递可以通过 vuex 存放共享的变量
