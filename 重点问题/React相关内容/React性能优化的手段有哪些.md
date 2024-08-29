# React性能优化的手段有哪些

## React性能优化是什么

类组件通过调用 setState 方法，就会导致 render ，父组件一旦发生 render 渲染，子组件一定也会执行 render 渲染

当某一个节点发生变化，理想情况下只会对改变的节点进行 diff比较

但是 React 的默认做法是调用所有组件的 render，再对生成的虚拟 DOM 进行对比如不变则不进行更新

## React性能优化如何做

在 React 中如何避免不必要的渲染中，我们了解到如何避免不必要的染来应付上面的问题，主要手段是通过 shouldComponentUpdate、PureComponent、React.memo，这三种形式这里就不再复述

除此之外， 常见性能优化常见的手段有如下:

- 避免使用内联函数
- 使用 React Fragments 避免额外标记
- 使用 Immutable.js
- 懒加载组件
- 事件绑定方式
- 服务端渲染

### 避免使用内联函数

函数组件和类组件的 props 都是引用类型，每次渲染都会重新创建一个新的 props 对象，这样就会触发组件的 shouldComponentUpdate 方法

我们需要避免使用内联函数，即，在函数组件和类组件中，尽量避免使用内联

如果我们使用内联函数，则每次调用 render 函数时都会创建一个新的函数实例，如下:

```js
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

onClick 事件处理器直接定义了一个内联函数 () => setCount(count + 1)，每次组件重新渲染时，内联函数都会被重新创建。这可能导致不必要的重新渲染，尤其是在函数作为 props 传递给子组件时

使用箭头函数

在事件处理器中使用命名的箭头函数，可以避免每次渲染都重新创建函数

```js
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

### 使用 React Fragments 避免额外标记

用户创建新组件时，每个组件应具有单个父标签。父级不能有两个标签，所以顶部要有一个公共标签所以我们经常在组件顶部添加额外标签 div
这个额外标签除了充当父标签之外，并没有其他作用，这时候则可以使用 fragement 其不会向组件引入任何额外标记，但它可以作为父级标签的作用

### 事件绑定方式

在事件绑定方式中，四种事件绑定的方式

从性能方面考虑，在 render 方法中使用 bind 和 render方法中使用箭头函数这两种形式在每次组件 render的时候都会生成新的方法实例，性能欠缺
而 constructor 中 bind 事件与定义阶段使用箭头函数绑定这两种形式只会生成一个方法实例，性能方面会有所改善

### 使用 Immutable

使用 Immutable 给 React 应用带来性能的优化，主要体现在减少染的次数

React 性能优化的时候，为了避免重复渲染，我们会在 shouldComponentUpdate()中做对比，当返回 true 执行 render 方法

Immutable 通过 is 方法则可以完成对比

```js
import React, { Component } from 'react';
import { Map } from 'immutable';

class UserList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // 使用 Immutable.js 的 is 方法进行深度比较
    return !this.props.users.is(nextProps.users);
  }

  render() {
    const { users } = this.props;

    return (
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            Name: {user.get('name')}, Age: {user.get('age')}
          </li>
        ))}
      </ul>
    );
  }
}
```

### 懒加载组件

从工程方面考虑，webpack 存在代码拆分能力，可以为应用创建多个包，并在运行时动态加载，减少初始包的大小
而在 react中使用到了 Suspense 和l azy 组件实现代码拆分功能，基本使用如下:

```js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// 懒加载组件
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
```

### 服务端渲染（Server-side Rendering，SSR）

采用服务端渲染端方式，可以使用户更快的看到渲染完成的页面服务端渲染，需要起一个 node 服务，可以使用express、koa等，调用 React 的 renderToString 方法，将根组件渲染成字符串，再输出到响应中

```js
import { renderToString } from 'react-dom/server';
```

总结

常见的性能优化可以分为

- 代码层面
- 工程层面
- 框架机制层面

通过这个三个层面，我们可以对 React 项目进行优化，提高性能