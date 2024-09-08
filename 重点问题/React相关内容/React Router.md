# React Router

## 实现原理

### 外部：基础原理

- Hash，依靠浏览器 hash 变化

- Path
  - HTML5 history API
    - pushState
    - replaceState
  - historyApiFallback，需要服务端完成

### 内部：实践方案

- history 库完成，为了兼容有两种方式
  - 内存路由 react-router-native
  - 浏览器路由 react-router-dom

## 工作方式

- 整体：设计模式
  - Monorepo
  - Context API 完成上下文通信

- 局部：关键模块
  - Context 容器，主要提供上下文消费容器
    - Router
    - MemoeryRouter，给内存路由使用
  - 直接消费者，提供路由匹配功能
    - Route
    - Redirect
    - Switch
  - 与平台关联的功能组件
    - Link，react-router-dom 的内容
    - NavLink，react-router-dom 的内容
    - DeepLinking，react-router-native 的内容

## 实践方案

- react-router 是没有UI层的
- react-router-dom = react-router + DOM UI
- react-router-native = react-router + Native UI

在 react-router-dom 中，提供的基础路由是 BrowserRouter 和 HashRouter

BrowserRouter 是 使用 history 库的 createBrowserHistory，实际上就是浏览器的 History API

HashRouter 是 使用 history 库的 createHashHistory
