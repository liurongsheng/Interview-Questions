# Redux 的相关库

## react-redux

react-redux 是 React 专用的库，配合 redux 使用的，像我们看见的 connect、useSelector, useDispatch 就是这个库

- Provider
- connect
- useSelector
- useDispatch

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
  const { data } = await axios.get("/xxx");
  dispatch(getUserInfoAction(data.userinfo));
};
```
