# React 生命周期

- 挂载阶段
- 更新阶段
- 卸载阶段

## 挂载阶段（Mounting）

挂载阶段是从组件被创建到首次渲染到 DOM 的过程

- constructor(props)：组件的构造函数，在创建组件时调用，用于初始化状态（state）和绑定事件处理方法
- static getDerivedStateFromProps(props, state)：在组件实例化时和接收新的 props 时调用，用于根据 props 更新 state
- render()：准备渲染组件的 UI 结构
- componentDidMount()：组件第一次渲染完成后调用，通常用于执行一次性的操作，如数据获取、订阅事件等 constructor

### constructor

实例过程中自动调用的方法，在方法内部通过 super 关键字获取来自父组件的 props，在该方法中，通常的操作为初始化 state 状态或者在 this 上挂载方法

### getDerivedStateFromProps

该方法是新增的生命周期方法，是一个静态的方法，因此不能访问到组件的实例

执行时机：组件创建和更新阶段，不论是 props 变化还是 state 变化，也会调用在每次 render 方法前调用

第一个参数为即将更新的 props ，第二个参数为上一个状态的 state，可以比较 props 和 state 来加一些限制条件，防止无用的 state 更新

该方法需要返回一个新的对象作为新的 state 或者返回 null 表示 state 状态不需要更新

### render

类组件必须实现的方法，用于渲染 DOM 结构，可以访问组件 state 与 prop 属性

注意:不要在 render 里面 setState，否则会触发死循环导致内存崩溃

### componentDidMount

组件挂载到真实 DOM 节点后执行，其在 render 方法之后执行

此方法多用于执行一些数据获取，事件监听等操作

## 更新阶段（Updating）

更新阶段是在组件接收到新的 props 或 state 更改后发生的

- static getDerivedStateFromProps(props, state)：在每次渲染前调用，用于根据 props 更新 state
- shouldComponentUpdate(nextProps, nextState)：在每次更新前调用，返回 false 可以阻止不必要的渲染
- render()：每次更新时都会被调用
- getSnapshotBeforeUpdate(prevProps, prevState)：在 React 更新 DOM 之前立即调用，可以用来获取 DOM 更新前的信息
- componentDidUpdate(prevProps, prevState, snapshot)：在 DOM 更新后立即调用，可以用来执行副作用操作，如数据获取、DOM 操作等

### 更新阶段的 getDerivedStateFromProps

和挂载阶段的 getDerivedStateFromProps 一样

### shouldComponentUpdate

用于告知组件本身基于当前的 props 和 state 是否需要重新渲染组件，默认情况返回 true

执行时机：到新的 props 或者 state 时都会调用，通过返回 true 或者 false 告知组件更新与否

一般情况，不建议在该周期方法中进行深层比较，会影响效率

同时也不能调用 setState，否则会导致无限循环调用更新

### 更新阶段的 render

和挂载阶段的 render 一样

### getSnapshotBeforeUpdate

该周期函数在 render 后执行，执行之时 DOM 元素还没有被更新

该方法返回的一个 Snapshot 值，作为 componentDidUpdate 第三个参数传入

```js
console.log("#enter getSnapshotBeforeUpdate");
```

```js
getSnapshotBeforeUpdate(prevProps, prevState) {
  console.log('#enter getSnapshotBeforeUpdate');
  return 'foo';
}
componentDidUpdate(prevProps, prevState, snapshot) {
  console.log('#enter componentDidUpdate snapshot',snapshot);
}
```

此方法的目的在于获取组件更新前的一些信息，比如组件的滚动位置之类的，在组件更新后可以根据这些信息恢复一些 UI 视觉上的状态

### componentDidUpdate

执行时机：组件更新结束后触发

在该方法中，可以根据前后的 props 和 state 的变化做相应的操作，如获取数据，修改 DOM 样式

## 卸载阶段（Unmounting）

卸载阶段是在组件从 DOM 中移除时发生的

- componentWillUnmount()：在组件将要从 DOM 中卸载前调用，可以用来清理定时器、取消网络请求、移除事件监听器等

## 错误边界（Error Boundaries）

错误边界是为了处理组件树中某个地方抛出的错误

- componentDidCatch(error, errorInfo)：在渲染期间抛出错误后调用，可以记录错误信息
- static getDerivedStateFromError(error)：在渲染期间抛出错误后调用，允许更新 state 使得下一次渲染可以显示回退 UI，而不是完全崩溃

## 在 React 16.3+ 版本中

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

这些生命周期方法已经被标记为不推荐使用，这三个方法仍然存在，只是在前者加上了 `UNSAFE_` 前缀

在函数组件中，生命周期行为通过 Hooks 实现，如 useEffect 用于处理副作用，useState 用于状态管理等
