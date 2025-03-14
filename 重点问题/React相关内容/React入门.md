# React

什么是库：小而巧是库，只提供了特定的 API，可以很容易得从一个库切换到另外的库
什么是框架：大而全的是框架，框架提供了一整套的解决方案。在项目中想切换到另外的框架是比较困难的

## 组件化

- 什么是模块化：从代码的角度来进行分析的，把一些可复用的代码，抽离为单个的模块，便于项目的维护和开发
- 什么是组件化：是从 UI 界面的角度进行分析的，把一些可复用的 UI 元素，抽离为单个的组件，便于项目的维护和开发

组件的好处：随着项目规模的增大，手里的组件越来越多，很方便就能把现有的组件拼接为一个完整的页面

Vue

- template 结构
- script 行为
- style 样式

template + script + style 组合成一个组件

React 有组件化思想，一切基于 JS 实现组件化思想

## React 的核心概念

### 虚拟 DOM （Virtual Document Object Model），文档对象模型

DOM 的概念：浏览器中的概念，用 JS 对象的形式来表示页面上的元素，并提供了操作 DOM 对象的 API

Node 中就没有 DOM

虚拟 DOM 的概念：是框架中的概念，程序员用 JS 对象来模拟页面上的 DOM 和 DOM 嵌套。目的是为了页面中，DOM 元素的高效更新

### Diff 算法，比较新旧页面的差别

tree diff：新旧两棵 DOM 树，逐层对比的过程。逐层对比完毕，则所有需要按需更新的元素，必然能够找到

component diff：在 tree diff 中，每一层组件级别的对比，如果对比前后，组件的类型相同，则暂时认为此组件不需要被更新。如果组件类型不同，则需要移除旧组件，创建新组件，并追加到页面上

element diff：在进行 component diff 的时候，如果两个组件类型相同，则需要进行元素级别的对比

## 生态

[awesome-react](https://github.com/enaqx/awesome-react)

[awesome-vue](https://github.com/vuejs/awesome-vue)

[React 入门与实战](https://edu.aliyun.com/course/314217/?spm=a2cwt.28190922.J_8130813160.4.26f271279wlO8i)

[Vue.js 入门与实战](https://edu.aliyun.com/course/314226/?spm=a2cwt.28120015.314217.61.5b7c3005adC0G2)

[阿里云文档与社区](https://edu.aliyun.com/explore/?spm=a2cwt.28120015.314217.2.5b7c3005zo9cC7)
