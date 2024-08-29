# React Hooks

## React Hooks是什么

React Hooks 是 React 16.8 的新增特性，在不编写类组件的情况下使用状态 state 和其他 React 特性
React Hooks 使函数组件变得更加强大，同时也简化了状态管理和生命周期管理

至于为什么引入 hook ，官方给出的动机是解决长时间使用和维护 React 过程中常遇到的问题，例如:

- 难以重用和共享组件中的与状态相关的逻辑
- 逻辑复杂的组件难以开发与维护，当我们的组件需要处理多个互不相关的local state 时，每个生命周期函数中可能会包含着各种互不相关的逻辑在里面
- 类组件中的this增加学习成本，类组件在基于现有工具的优化上存在些许问题
- 由于业务变动，函数组件不得不改为类组件等等

在以前，函数组件也被称为无状态的组件，只负责渲染的一些工作

因此，现在的函数组件也可以是有状态的组件，内部也可以维护自身的状态以及做一些逻辑方面的处理

```js
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

```js
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    render() {
        return (
            <div>
                <p>You clicked {this.state.count} times</p >
                <button onClick={()=> this.setState({ count: this.state.count + 1})}>
                    Click me
                </button>
            </div>)
    }
}
```

## React Hooks解决什么问题

React Hooks 能够更容易解决状态相关的重用的问题:

- 每调用 useHook 一次都会生成一份独立的状态
- 通过自定义 hook 能够更好的封装我们的功能

编写 hooks 为函数式编程，每个功能都包裹在函数中，整体风格更清爽，更优雅

hooks 的出现，使函数组件的功能得到了扩充，拥有了类组件相似的功能，

在我们日常使用中，使用 hooks 能够解决大多数问题，并且还拥有代码复用机制，因此优先考虑 hooks