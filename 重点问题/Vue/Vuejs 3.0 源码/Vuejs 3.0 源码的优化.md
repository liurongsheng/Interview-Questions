# Vuejs 3.x 的源码 对比 vuejs 2.x

- 源码优化

  - 使用 monorepo 模式维护
  - 使用 TypeScript 代替 FLow

源码的优化主要体现在使用 monorepo 和 TypeScript 管理和开发源码，这样做的目标是提升自身代码可维护性

- 性能优化

  - 源码体积优化
  - 数据劫持优化
  - 编译优化

## vue2.0 源码目录结构

```js
src
 - compiler  // 版本编译的相关代码
 - core // 与平台无关的通用运行时代码
 - platforms // 平台专有代码
 - server // 服务端渲染相关代码
 - sfc // .vue 文件解析相关代码
 - shared //共享工具代码
```

## vu3.0 源码目录结构，monorepo 模式

```js
- packages/
  - runtime-dom/
    - src/
      - index.ts // 核心功能实现
      - compiler.ts // 编译相关逻辑
      - renderer.ts // 渲染器实现
    - package.json // 包配置文件
    - README.md
  - runtime-core/
    - src/
      - index.ts // 基础核心功能实现
      - reactivity.ts // 响应式系统
    - package.json
    - README.md
  - compiler-dom/
    - src/
      - index.ts // DOM 特定编译器实现
    - package.json
    - README.md
  - compiler-sfc/
    - src/
      - index.ts // 单文件组件编译器实现
    - package.json
    - README.md
  - shared/
    - src/
      - utils.ts // 共享工具函数
    - package.json
    - README.md
- scripts/
  - build.js // 构建脚本
  - test.js // 测试脚本
- tools/
  - lint.js // 格式化和检查脚本
  - release.js // 发布脚本
- devtools/
  - extension/
    - src/
      - background.js // 浏览器插件后端逻辑
      - content.js // 插件前端逻辑
  - package.json
  - README.md
- examples/
  - basic/
    - index.html
  - advanced/
    - App.vue
- .github/
  - workflows/
    - ci.yml // CI 配置
- .eslintrc.js // ESLint 配置
- .prettierrc // Prettier 配置
- LICENSE
- README.md
- package.json // 根目录下的包配置文件
```

相对于 Vue.js 2.x的源码组织方式，monorepo 把这些模块拆分到不同的 package 中
每个 package 有各自的 API、类型定义和测试这样使得模块拆分更细化，职责划分更明确，模块之间的依赖关系也更加明确
开发人员也更容易阅读、理解和更改所有模块源码，提高代码的可维护性

## 从 FLow 到 TypeScript

Vue.js 1.x 版本的源码是没有用类型语言的

Flow 是 Facebook出品的 JavaScript 静态类型检查工具，它可以以非常小的成本对已有的JavaScript 代码迁入，非常灵活，这也是Vue.is2.0 当初选型它时一方面的考量

但是 Flow 对于一些复杂场景类型的检查，支持得并不好

Vue.js 3.0 抛弃 Flow 后，使用 TypeScript 重构了整个项目。 TypeScript提供了更好的类型检查，能支持复杂的类型推导；由于源码就使用 TypeScript 编写，也省去了单独维护 d.ts 文件的麻烦；就整个 TypeScript 的生态来看，TypeScript 团队也是越做越好，TypeScript 本身保持着一定频率的迭代和更新，支持的 feature 也越来越多

## 