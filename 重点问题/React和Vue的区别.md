# React 和 Vue2 、 Vue3 的区别

- 关于组件

  Vue 组件是一个 .vue 后缀文件，包含模板、样式和脚本代码，和 HTML 文件格式一样；

  ```js
  <template>
    <p>hello vue</p>
  </template>

  <script>
  export default {
    // ...
  };
  </script>

  <style></style>
  ```

  React 组件是一个 .jsx 或 .tsx 后缀的文件，用的是其特有的 JSX 语法，模板和样式都可以写到 JS 里

  ```js
  function App() {
    return (
      // JSX 语法，类似于 HTML
      <div>
        <p>hello React</p>
      </div>
    );
  }
  export default App;
  ```

- 组件结构

  都支持组件嵌套的，嵌套规则和格式也都是参考 HTML 语法，对于自定义组件的 tag 名称，React 和 Vue 现在都推荐使用 PascalCase 写法，如 <HomePage />，即首字母大写。Vue2 当年推荐 <home-page /> 写法，Vue3 改过来了

- 关于插值

  Vue template 中使用 {{name}} ，React JSX 中使用 {name}

- 关于属性

  Vue template 使用 v-bind:xxx 动态绑定属性，或者简写为 :xxx；而 React JSX 中，属性值如果是 JS 变量，依然用插值的语法 {xxx}

  ```js
  // 这里的 p1 就只字符串，而 title1 就是一个 JS 变量。所以这个 :xxx 又是一个 Vue 新定义的语法规则
  <p id="p1" :title="title1">hello vue</p>
  ```

  ```js
  // React JSX 中，属性值如果是 JS 变量，依然用插值的语法 {name} ，没增加新规则
  <p id="p1" title={title}>
    hello vue
  </p>
  ```

  Vue 有 props 和 attrs （后者面试常考但工作不常用），React 没有 attrs ，也不耽误用

- 关于状态和响应式

  Vue3 提供了很多响应式 API 和工具，而 React 只有一个 useState

  Vue2 组件使用 data() 函数，Vue3 使用 ref 和 reactive ，Vue 都是响应式监听，直接修改数据即可监听到变化。

  reactive 与 ref 的对比
  reactive 主要用于处理对象和数组，它会递归地使对象的所有属性成为响应式的
  ref 更适用于处理基本值类型，同时也支持对象和数组，但返回的是一个引用对象

- 值类型，就是比较简单的 string number boolean 等类型

Vue2 使用 data() 函数返回数据，直接通过 this.xxx 修改数据，非常简单

```js
export default {
    data() {
        return { name: '张三' }
    }
    method: {
        changeName() { this.name = '李四' }
    }
}
```

Vue3 处理值类型，要使用 ref ，在 JS 中修改或者使用时，要使用 .value 属性，否则无效

```js
const nameRef = ref("张三");
function changeName() {
  nameRef.value = "李四";
}
```

React 使用 useState 定义数据和 setXxx 方法。注意，React 修改数据不是响应式的，要通过 setXxx 来显示修改，是命令式的，
直接调用 setXxx 让大家都明显的看出来

React 的 ref 也需要写类似的 .current 才能获取和修改数据，这是 ref 的设计决定的写法
React ref 不具备 setXxx 能力，无法触发组件更新，这和 state 有本质区别，不会混淆
React 对于 ref 和 state 的设计是有明显的定位区别的，两者各司其职

- 对象和数组

Vue2 data() 也很简单清晰，但因为内部使用 defineProperty 可能会导致如下问题（所以 Vue3 使用 Proxy 实现响应式）
对象层次较深时，可能会有性能问题，因为要一次性递归绑定响应式
修改数组只能用 API ，不能直接赋值某个 index

Vue3 刚发布的时候，推荐使用 reactive 来做对象的响应式监听，现在的文档 Vue3 推荐统一使用 ref ，无论是值类型、对象还是数组。
当然，ref 得用 .value 了

- 数据的复杂性

Vue2 Vue3 为了实现数据响应式，它都需要把数据包裹一层，即你定义的数据并不是真正的数据
这个在 Vue2 中并不明显，但在 Vue3 setup script 中 JS 操作较多的话，就会遇到这种问题

```js
const raw = {}
const proxy = reactive(raw)
console.log(proxy === raw) // false 代理对象和原始对象不是全等的
```

Vue3 的 ref 和 reactive 两种响应式的类型也不一样，为此 Vue 设计了很多 API 来进行各种数据类型的判断和转换，
例如 isRef isReactive toRef toRaw toValue [响应式工具](https://cn.vuejs.org/api/)
还有，为了满足非深度监听，Vue 还设计了各种 shallowXxx

响应式: 核心

```js
ref();
computed();
reactive();
readonly();
watchEffect();
watchPostEffect();
watchSyncEffect();
watch();
```

响应式: 工具

```js
isRef();
unref();
toRef();
toValue();
toRefs();
isProxy();
isReactive();
isReadonly();
```

响应式: 进阶

```js
shallowRef();
triggerRef();
customRef();
shallowReactive();
shallowReadonly();
toRaw();
markRaw();
effectScope();
getCurrentScope();
onScopeDispose();
```

Vue 是双向数据绑定，修改数据自动更新视图；而 React 单向数据流，需要手动 setState 触发视图更新。

这里单向/双向数据流指的的是 VM 层，即是视图层数据层。而父子组件之间的数据流都是单向的，即不允许子组件直接修改父组件传递过来的数据

- 关于 Props

  都可以通过 props 进行父子组件数据传递，Vue 中组件接收属性时，需要用 props: ['a', 'b'] 来定义各个属性的名称，即便是 Vue3 setup script 也需要一个 defineProps(['a', 'b']) 一个宏来定义。这种写法是 Vue 组件独有的，Vue 发明的。 React 组件是一个函数，它的属性就是函数的参数，不用声明可能直接使用。

  ```js
  export default {
    props: ["foo"],
    setup(props) {
      console.log(props.foo); // setup() 接收 props 作为第一个参数
    },
  };
  ```

- 关于 DOM 事件

  Vue 提供 v-on 指令，也可以简写为 @ 来监听 DOM 事件，用法：v-on:click="handler" 或 @click="handler"。React 必须使用驼峰写法，如 onClick={handler}

  ```vue
  <button @click="greet">Greet</button>
  ```

  ```js
  <p onClick={addTodoHandler}>todo input</p>
  ```

- 关于自定义事件

  在父子组件中传递调用自定义事件时，Vue 通过 @add="add" 添加绑定事件；React 中还是当属性传递，插值语法绑定事件 add={add}。但是 Vue 子组件需要通过 emit，React 子组件可以直接拿到 props 里的事件进行调用

  ```js
  // Vue 组件的事件，可以不定义，直接通过 this.$emit('xxx') 触发即可
  methods: {
      deleteItem(id) { this.$emit('delete', id) }
  }
  ```

  ```vue
  // Vue3 setup script 中使用 defineEmits 这个宏来定义
  <script setup>
  const emit = defineEmits(["inFocus", "submit"]);
  function buttonClick() {
    emit("submit");
  }
  </script>
  ```

  vue 的这两种方式：

  - 不定义，你就不知道这个事件的来源，就需要去全局查找。如果名称不小心写错了，也无法提前报错提示
  - 使用 defineEmits 定义，就和上面 props 一样，又是 Vue 独有的语法。包括使用 $emit 去执行，也是 Vue 独有的写法

  React：组件事件和属性一样，还是函数的参数，执行事件就是执行一个函数，就简单的 JS 代码

- 关于样式

  Vue 可以直接用 class，React 则需要使用 className，因为 React 完全是 JS 代码，class  是 JS 的关键字，没法直接使用。动态样式 Vue 有很多自己的写法[文档](https://cn.vuejs.org/guide/essentials/class-and-style) ，而 React 还是用插值语法

  ```vue
  <div :class="{ active: isActive }"></div>
  <div :class="[isActive ? activeClass : '', errorClass]"></div>
  ```

- 关于条件渲染

  Vue template 使用  v-if  和  v-else  等指令实现判断逻辑条件渲染；React JSX 依然使用插值语法  {} ，只不过里面是使用 JS 表达式，如 { flag ? <Aaa/> : <Bbb/> }

  ```vue
  // 其中的 awesome 是一个 JS 变量，别误看做是静态的
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
  ```

- 关于列表渲染

  Vue template 中循环渲染使用  v-for  指令；而 React 还是使用  {xxx}  表达式。其中主要用到 JS 数组的  map  方法

  ```vue
  <li v-for="item in items">
      {{ item.message }}
  </li>
  ```

  ```js
  // 已定义 arr1 = ['a', 'b', 'c']
  <ul>
    {arr1.map((item) => {
      return <li>{item}</li>;
    })}
  </ul>
  ```

  Vue 和 React 一样，循环时都需要一个唯一的 key ，否则会有警告

- 关于副作用和组件生命周期

  Vue 和 React 都定义了很多生命周期，这里主要举三个，组件挂载、更新、卸载

  生命周期：Vue 分别对应 onMounted()、onUpdated()、onUnmounted()；

  React 组件只需要一个 useEffect hook 即可，挂载后执行 useEffect，在 useEffect hook 里返回一个函数可以用于在组件卸载时触发调用，useEffect 第二个参数是依赖项数组，可以处理更新的情况

  React 使用函数式组件，函数接收 props 返回 JSX ，按理说应该也是个纯函数，但作为一个 UI 组件，不能光考虑一次性的输出 JSX ，你还得考虑组件完整的生命周期，如更新、销毁。而这些都可以通过副作用来实现。（副作用有些是坏的，有些是好的，这里就是好的）

  - 初次渲染

  Vue 对应的生命周期 beforeCreate created beforeMount Mounted，Vue3 composition API 做了一些 API 改动，如 onMounted 写法，但语义是一样的

  ```js
  import { ref, onMounted } from "vue";
  const el = ref(0);
  onMounted(() => {
    el.value = 10;
  });
  ```

  React 使用 useEffect 来处理副作用，也包括组件初次渲染相关的

  ```js
  import { useEffect } from "react";

  function App(props) {
    function fn() {
      console.log("发起 ajax 请求");
    }
    useEffect(fn);

    return <p>App page</p>;
  }
  ```

  - 组件更新

  Vue 组件更新的生命周期是 beforeUpdate 和 updated，Vue3 Composition API 有写法上的改变，但语义是相同的

  React 依然使用 useEffect 副作用处理组件更新的情况。React 擅长统一和抽象概念，体现设计思维

  useEffect 其实有两个参数：

    第一个参数是函数，即副作用要执行的具体内容，必填
    第二个参数是依赖项数组，选填

  ```js
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    // 组件初次渲染完成，执行副作用，page 或 keyword 有变化，也会执行副作用
    fn(page, keyword);
  }, [page, keyword]);
  ```

  - 组件销毁

  Vue 使用 beforeDestroy 和 Desctroyed 两个生命周期，很好理解

  React 依然使用 useEffect ，只不过需要你记住一件事儿：useEffect 函数里面，可以再 return 一个函数，用于监听组件销毁

  ```js
  useEffect(() => {
    // xxx
    return () => {
      console.log("组件销毁之前，如解绑自定义事件");
    };
  });
  ```

- 关于 watch/computed

  Vue  中 使用 watch  监听某个数据，React  还是通过 useEffct  第二个参数（依赖项数组）实现。
  Vue 使用 computed 对计算结果进行缓存，React 中使用 useMemo 缓存结果

  其实绝大部分情况都不用缓存，JS 计算是非常快的，很少遇到性能瓶颈

  前端面试动不动就问性能优化，其实大部分情况下不需要做 JS 计算层面的性能优化
  所以无论是 Vue computed 还是 React useMemo 都用的不多

- 表单

  Vue 使用 v-model 双向绑定表单项的值，这在用户体验方面感觉非常棒，非常方便。单从 v-model 的开发体验上，Vue 是胜过 React 的

  ```html
  <p>Message is: {{ message }}</p>
  <input v-model="message" placeholder="请输入..." />
  ```

- 关于插槽<slot>

  插槽，用于定义和显示子组件的内容。插槽的概念是 Vue 提出来的，什么具名插槽、作用域插槽···，其实插槽编译后就是一个普通对象；React 是通过 props 里的 children 拿到子组件

  ```js
  function Layout({ children }) {
    return (
      <div>
        <Nav /> {/* 导航栏 */}
        <div>{children}</div> {/* 子组件 */}
      </div>
    );
  }
  ```

- 关于数据管理

  Vue2 用 VueX，Vue3 用 Pinia；React 可选择的就更多，比如 Redux、dva、jotai、zustand 等。

- 关于 api
  Vue API 概念更多，React API 少

## 响应式原理

Vue2 响应式的特点就是依赖收集，数据可变，自动派发更新，初始化时通过 Object.defineProperty 递归劫持 data 所有属性添加 getter/setter，触发 getter 的时候进行依赖收集，修改时触发 setter 自动派发更新找到引用组件重新渲染

Vue3 响应式使用原生 Proxy 重构了响应式，一是 proxy 不存在 Vue2 响应式存在的缺陷，二是性能更好，不仅支持更多的数据结构，而且不再一开始递归劫持对象属性，而是代理第一层对象本身。运行时才递归，用到才代理，用 effect 副作用来代替 Vue2 里的 watcher，用一个依赖管理中心 trackMap 来统一管理依赖代替 Vue2 中的 Dep，这样也不需要维护特别多的依赖关系，性能上取得很大进步

相比 Vue 的自动化，React 则是基于状态，单向数据流，数据不可变，需要手动 setState 来更新，而且当数据改变时会以组件根为目录，默认全部重新渲染整个组件树，只能额外用 pureComponent/shouldComponentUpdate/useMemo/useCallback 等方法来进行控制

Vue 通过数据劫持和代理来监测数据变化，能够精准地检测到具体数据的变化，触发相应的更新，因此更新粒度非常小。而 React 推崇函数式编程，这种方式无法感知数据变化，不知道何时应该刷新。即便是手动调用  setState  触发更新，它也无法确定哪些组件需要刷新，而是渲染整个虚拟 DOM，基本上就是无差别刷新。这导致了性能问题，因此需要不断通过其他方法来避免不必要的刷新，或者优化这种无差别刷新的性能

## Diff 算法

- Vue2 是同层比较新老 vnode，新的不存在老的存在就删除，新的存在老的不存在就创建，子节点采用双指针头对尾两端对比的方式，全量 diff，然后移动节点时通过 splice 进行数组操作

- Vue3 是采用 Map 数据结构以及动静结合的方式，在编译阶段提前标记静态节点，Diff 过程中直接跳过有静态标记的节点，并且子节点对比会使用一个 source 数组来记录节点位置及最长递增子序列算法优化了对比流程，快速 Diff，需要处理的边际条件会更少

- React 是递归同层比较，标识差异点保存到 Diff 队列保存，得到 patch 树，再统一操作批量更新 DOM。Diff 总共就是移动、删除、增加三个操作，如果结构发生改变就直接卸载重新创建，如果没有则将节点在新集合中的位置和老集合中的 lastIndex 进行比较是否需要移动，如果遍历过程中发现新集合没有，但老集合有就删除

## 总结

Vue template 定义了更多的规则，例如：

:xxx 动态属性
@xxx 事件
:class 和 :style 的多种写法
v-if v-for 等多种指令
还有更多，如 v-model slot 等

JSX 语法非常简洁，记住这两条就够了：

{xxx} 大括号里面是 JS 的变量或者表达式，可实现一切动态的功能，包括判断和循环
onXxx 是 DOM 事件的写法

JSX 中 {x} 是动态的， "x" 是静态的，一眼识别，特清晰。
Vue template 中 "x" 有时候是静态，有时候动态，还得根据前面的 key 格式去判断，而且格式还那么多

- React 组件就是 JS 函数，简单
- React 组件的属性，就是函数参数，简单
- React 组件的事件，也是函数参数，执行事件就是执行 JS 函数，简单
- JSX 的插值、属性、事件和样式，规则很少，更简洁
- JSX 判断和循环完全使用 JS 语法，简单
- React useState 语义明确，没有心智负担，简单
- React state 就是原始数据，没有任何包裹处理，简单
- React useEffect 涵盖所有副作用操作，API 更简洁
- React 表单受控组件比 Vue v-model 会多写几行代码，但也没有其他心智负担
