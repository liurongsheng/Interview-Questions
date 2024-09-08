# Redux

Redux 是 JavaScript 的状态容器，提供了可预测的状态管理，React 中，状态就是 state

Redux 在实现层面并没有按照 Flux 那一套来，但 Redux 在设计思想上确实和 Flux 一脉相承，可以认为 Redux 是 Flux 的一种实现形式

Flux 并不是一个具体的框架，它是一套由 Facebook 技术团队提出的应用架构这套架构约束的是**应用处理数据的模式**

## Flux 的实现，4个部分

- View 视图层，用户界面，可以是任何形式实现出来的
- Action 动作，可以理解为视图层发出的消息，会触发应用状态的改变
- Dispatcher 派发器，它负责对 action 进行分发
- Store 数据层，存储应用状态的仓库，此外还会定义修改状态的逻辑

Flux 的核心特征是单向数据流，在单项数据流下，状态的变化是可预测的

## 为什么需要 Redux

- React 管理不断变化的 State 是非常困难的
- React 是在视图层帮助我们解决了 DOM 的渲染过程，但是 State 依然是留给我们自己来管理
- 当没有使用 Redux 时兄弟组件间传值将很麻烦，代码很复杂冗余

## Redux 的使用场景

业务场景涉及到不同层次的组件需要进行组件通信

## Redux 关键要素

- Store，它是一个单一的数据源，而且是只读的
- Action，是“动作”的意思，它是对变化的描述
- Reducer，它负责对变化进行分发和处理，最终将新的数据返回给 Store

## Redux 工作流

组件想要获取 state , 用 ActionCreator 创建一个请求给 store，Store 借助 reducer 确认该 state 的状态，Reducer 会返回给 store 一个结果，store 再把这个 state 转给组件

## 如何使用

- 创建一个对象，作为状态 State
- 创建 Store 存储 State
- 通过 Action 来修改 State
- 修改 Reducer 中的处理代码
- 可以在派发 Action 之前，监听 Store 的变化

```js
const redux = require("redux");

const initState = {
  money: 0,
};

// redux有三大巨头
// reducer 去连接 store 和 action，原来的state 和 action 在默认的情况下，state是没有值的，可以传递一个默认值

const reducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_MONEY:
      return { ...state, money: state.money + action.num };
    case SUB_MONEY:
      return { ...state, money: state.money - action.num };

    case INCREMENT:
      return { ...state, money: state.money + 1 };

    case DECREMENT:
      return { ...state, money: state.money - 1 };
    // 如果没有匹配到任何的action就直接返回state
    default:
      return state;
  }
};

// store 保存状态，创建一个store对象即可，创建 Store 的时候必须创建 Reducecer)
// 通过 store.getState() 来获取当前的store
const store = redux.createStore(reducer);

// store action reducer

// action 是用来修改 store 的
const action1 = { type: "INCREMENT" };
const action2 = { type: "DECREMENT" };
const action3 = { type: "ADD_MONEY", num: 15 };
const action4 = { type: "SUB_MONEY", num: 10 };

// 派发 action 之前可以订阅 store 的修改，监听 store 的变化
store.subscribe(() => {
  console.log("store被修改了");
  console.log(`count:${store.getstate().money}}`);
});

// 派发 action
store.dispatch(action1);
store.dispatch(action2);
store.dispatch(action3);
store.dispatch(action4);
```

一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做纯函数，reducer 就是这个纯函数

## Redux 的三大原则

- 单一数据源

  整个应用程序的 state 被存储在一棵 object tree 中，并且这个 object tree 只存储在一个 store 中,
  单一的数据源可以让整个应用程序的 state 变得很方便去维护、追踪、修改

- state 是只读的

  唯一修改的 state 的方法是：触发 action，不用试图在其他地方通过其他的方式来修改 state
  可以保证所有的修改都被集中处理，并且严格按照顺序来执行

- 使用纯函数来执行修改

  通过 reducer 将 state 和 action 联系在一起，并且返回一个新的 state

## React-Redux

React-Redux 是 React 专用的库

- Provider
- connect

connect 本身是一个函数，返回一个高阶组件 mapStateToProps mapDispatchProps

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.render(
  // 把provider包裹在根组件的外层，可以使得所有的子组件都可以拿到state
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

```js
import { connect } from "react-redux";

function User(props) {
  return (
    <div>
      <hr />
      <h2>余额:{props.money}</h2>
      <button onClick={(e) => props.subNumber(1)}>支付1</button>
      <button onClick={(e) => props.makeMoney(50)}>赚50</button>
    </div>
  );
}

// 是一个函数，用于建立组件跟store的state的映射关系
// react中的state和store中的state不是同一个概念，一个是组件的状态，一个是store的数据
const mapStateToProps = (state, props) => {
  console.log(state, props); // 建立一个映射关系 组件的state和store的state建立的映射关系
  return {
    money: state.money,
    name: props.info,
    userinfo: state.userinfo,
  };
};

// 用于建立组件跟 store.dispatch 的映射关系
const mapDispatchToProps = (dispatch) => {
  return {
    subNumber: (num) => {
      dispatch(subAction(num));
    },
    makeMoney: (num) => {
      dispatch(addAction(num));
    },
  };
};

// connect起来一个连接作用，连接组件与 store
export default connect(mapStateToProps, mapDispatchToProps)(User);
// mapStateToProps，mapDispatchToProps 作用就是把state和dispacth都转成了当前的组件的props属性，供当前的组件或者子组件来使用
```

## redux-thunk

redux 推荐的网络请求中间件，这个中间件的目的就是在 dispacth 和 action 最终道道 reducer 之间扩展一些代码

所谓的中间件，其实就是一个函数，函数的作用是：增强或者是扩展功能。可以在我们请求和响应之间做一些操作

```js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";

/*  
applyMiddleware是redux的原生方法
将所有的中间件组成一个数组，依次执行，返回一个store对象
*/
const storeEnhancer = applyMiddleware(thunk);
/* 
storeEnhancer增强型的store
*/
const store = createStore(reducer, storeEnhancer);
export default store;


// action 请求
// 通过指定的中间件，action创建除了返回对象以外还可以返回一个函数
export const getHomeAction = async (dispatch) => {
  const { data } = await axios.get('/xxx');
  dispatch(getUserInfoAction(data.userinfo));
};
```

## Redux 源码

- types // 类型声明
- utils // 工具方法库
- applyMiddleware.ts // 中间件模块
- bindActionCreators.ts // 工具性质，将 actionCreator 和 dispatch 合并
- combineReducers.ts // 工具性质，将多个 reducer 合并起来
- compose.ts // 工具性质，接受到的函数从右向左组合
- createstore.ts // 核心
- index.ts // 入口文件

```js
// 引入redux
import { createStore } from 'redux'
// 创建 store
const store = createStore(
  reducer,
  initial_state
  applyMiddleware(middlewarel, middleware2, ...)
)
```

createStore 接受三个参数，reducer、preloadedState、enhancer

- 调用 createStore
- 处理没有传入初始状态(前两个入参都为function)的情况
- 若 enhancer 不为空，则用 enhancer 包装 createStore
- 定义内部变量
- 定义 ensureCanMutateNextListeners 方法该方法用于确保 currentListeners 与 nextListeners 不指向同一个引用
- 定义 getstate 方法，该方法用于获取当前的状态
- 定义 subscribe 方法，该方法用于注册 listeners (订阅监听函数)
- 定义 dispatch 方法，该方法用于派发 action、调用 reducer 并触发订阅
- 定义 replaceReducer 方法，该方法用于替换 reducer
- 执行一次 dispatch，完成状态的初始化
- 定义 observable 方法(此处可忽略)
- 将步骤 6~11 中定义的方法放进 store 对象中返回

Redux工作流的核心是 dispatch 动作

dispatch 这个动作刚好能把 action、reducer 和 store 这三位“主角”给串联起来

- 调用 dispatch，入参为 action 对象
- 前置校验
- “上锁”:将isDispatching 置为 true，避免套娃，避免 dispatch 和 reducer 两者反复调用
- 调用 reducer，计算新的 state
- “解锁”:将isDispatching 置为 false
- 触发订阅
- 返回 action

subscribe 是如何与 Redux 主流程结合的呢?

- 在 store 对象创建成功后通过调用 store.subscribe 来注册监听函数
- 当 dispatch action 发生时 Redux 会在 reducer 执行完毕后将 listeners 数组中的监听函数逐个执行

subscribe 并不是一个严格必要的方法只有在需要监听状态的变化时我们才会调用 subscribe

- 调用 subscribe，入参是一个函数
- 前置校验
- 调用 ensureCanMutateNextListeners 确保 nextListeners 与 currentListeners 不指向同一个引用
- 注册监听函数，将入参 listener 函数推入 nextListeners 数组中
- 返回取消订阅当前 listener 的方法(unsubscribe)

为什么会有 currentListeners 和 nextListeners 这两个 listeners 数组?

- currentListeners数组用于确保监听函数执行过程的稳定性

currentListeners 就是为了记录下当前正在工作中的 listeners 数组的引用将它与可能发生改变的 nextListeners 区分开来以确保监听函数在执行过程中的稳定性

## Redux 中间件

Redux 源码中只有同步操作

如果想要在 Redux 中引入异步数据流，该怎么办呢?

使用中间件来增强 createStore，redux-thunk

dispatch 的入参从 action 对象变成了一个函数 action 入参必须是一个对象

Redux中间件是如何与 Redux 主流程相结合的?

action --> middleware 1 --> middleware 2  --> middleware 3… --> dispatch --> reducer --> nextState

- 中间件的执行时机即 action 被分发之后，reducer 触发之前
- 中间件的执行前提即 applyMiddleware 将会对 dispatch 函数进行改写，使得 dispatch 在触发 reducer 之前会首先执行对 Redux 中间件的链式调用

applyMiddleware 是如何与 createStore 配合工作的?

dispatch 函数是如何被改写的?

- 外层函数的主要作用是获取 dispatch、getstate 这两个 API而真正的中间件逻辑是在内层函数中包裹的
- 待middlewares.map(middleware =>middleware(middlewareAPl)) 执行完毕后，内层函数会被悉数提取至 chain 数组

compose 源码解读：函数的合成

函数合成(组合函数)并不是 Redux的专利而是函数式编程中一个通用的概念

// 若有多个函数，那么调用 reduce 方法来实现函数的组合

`return funcs.reduce((a, b) =>(...args) => a(b(...args)))`

`(...args)=> f1(f2(f3(f4(...args))))`

### 中间件与面向切面编程

AOP (面向切面)的存在恰恰是为了解决 OOP (面向对象)的局限性

classA 继承 class B，class B 继承 classC 这样一层一层将逻辑向下传递

在面向对象中，当要为某几个类追加一段共同的逻辑时，可以通过修改它们共同的父类来实现，这无疑会使得公共类越来越臃肿

面向切面思想在很大程度上提升了我们组织逻辑的灵活度与干净度，帮助我们规避掉了逻辑冗余、逻辑耦合这类问题
