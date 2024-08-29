# 如何提高组件的渲染效率？如何避免不必要的 render？

## React渲染效率是什么

React 基于虚拟 DOM 和高效 Diff算法的完美配合，实现了对 DOM 最小粒度的更新，大多数情况下，
React 对DOM 的渲染效率足以我们的业务日常

复杂业务场景下，性能问题依然会困扰我们。此时需要采取一些措施来提升运行性能，避免不必要的渲染则是业务中常见的优化手段之一

## React渲染效率如何做

render 的触发时机，简单来讲就是类组件通过调用 setState 方法就会导致 render，父组件一旦发生 render 渲染，子组件一定也会执行 render 渲染

从上面可以看到，父组件渲染导致子组件渲染，子组件并没有发生任何改变，这时候就可以从避免无谓的渲染，具体实现的方式有如下:

- shouldComponentUpdate
- PureComponent
- React.memo

通过 shouldComponentUpdate 生命周期函数来比对 state 和 props，确定是否要重新渲染默认情况下返回 true 表示重新渲染，
如果不希望组件重新渲染，返回 false 即可

PureComponent 跟 shouldComponentUpdate 原理基本一致，是一个纯组件，它继承自 React.Component，
通过对 props 和 state 的浅比较结果来实现 shouldComponentUpdate，如果 props 和 state 没有变化，则不会重新渲染组件 ，源码大致如下:

```js
if(this._compositeType === CompositeTypes.PureClass) {
    shouldUpdate = !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state,nextState);
}
```

当对象包含复杂的数据结构时，对象深层的数据已改变却没有触发 render 注意:在 React 中，是不建议使用深层次结构的数据

## React.memo

React.memo 用来缓存组件的渲染，避免不必要的更新，其实也是一个高阶组件，与 PureComponent十分类似。但不同的是，React.memo只能用于函数组件

```js
import { memo }from 'react';
function Button(props){
    //Component code
}
export default memo(Button);
```
如果需要深层次比较，这时候可以给 memo 第二个参数传递比较函数

```js
function arePropsEqual(prevProps,nextProps) {
    // your code
    return prevProps === nextProps;
}
export default memo(Button, arePropsEqual);
```

在实际开发过程中，前端性能问题是一个必须考虑的问题，随着业务的复杂，遇到性能问题的概率也在增高

除此之外，建议将页面进行更小的颗粒化，如果一个过大，当状态发生修改的时候，就会导致整个大组件的渲染，而对组件进行拆分后，粒度变小了，也能够减少子组件不必要的渲染
