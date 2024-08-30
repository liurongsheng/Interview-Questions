# Nextjs

Next.js 是一个用于构建现代化 Web 应用程序的框架，它基于 React 构建，并提供了许多开箱即用的功能来简化开发流程。

[Nextjs cli](https://www.nextjs.cn/docs/api-reference/create-next-app)

为了解决 react 单页应用的问题

- 用户侧必须要有 JS 环境
- 首屏加载慢
- 安全问题
- 不利于SEO

将渲染后移，将原本在浏览器中执行的渲染动作（这里的渲染指的是需要展示数据渲染成DOM），将 DOM 渲染成页面是浏览器需要做的事情
支持在页面级的 静态生成 (SSG) 和 服务器端渲染 (SSR)

## 主要版本

```js
2016.10 1.0.0
2018.9  7.0.0 webpack4
2019.2  8.0.0 serverless
2020.3  9.3   gloable sass, css module
2021.6  11.0  webpack5
2021.10 12.0  rust (rust编译器，编译速度快) AVIF
```

## 特性

- 服务端渲染 (SSR): Next.js 提供了简单的服务端渲染支持，这有助于提高首屏加载速度和搜索引擎优化（SEO）
- 静态网站生成 (SSG): 除了动态渲染，Next.js 还允许你生成完全静态化的网站，这些网站在构建时生成 HTML 文件，非常适合博客或者内容不需要频繁更新的站点
- 多种渲染模式: 包括客户端渲染 (CSR) 和服务端渲染 (SSR)，以及混合模式，让开发者可以根据实际需求选择最适合的渲染方式
- 自动路由: 通过文件系统定义路由，每个文件对应一个 URL 路径，简化了路由配置
- 热模块替换 (HMR): 开发过程中，当修改代码时，可以实时看到变化，无需刷新页面
- 集成开发环境: 内置了诸如 Webpack、Babel 和 Express 等工具，使得开发者能够快速搭建起一个完整的开发环境
- 优化工具: 包含了对代码分割、懒加载等功能的支持，帮助开发者提升应用的性能
- 国际化支持: 支持多语言应用，使得开发者可以轻松地为不同地区和语言的用户提供内容
- API 路由: 允许开发者直接在 Next.js 项目中编写 API，而不需要额外设置后端服务
- Next.js 适合那些希望利用 React 的强大功能，同时又希望减少设置时间和复杂性的开发者。它被广泛应用于构建高性能的企业级网站、电子商务平台、博客等各类 Web 应用

## SWC 编译器之所以比 Babel 快的原因

- Rust vs JavaScript: SWC 是用 Rust 语言编写的，而 Babel 是用 JavaScript 编写的

  Rust 作为一种系统级编程语言，具有更高的执行效率和更好的内存管理能力。相比之下，JavaScript 在 Node.js 环境下运行时，受制于 V8 引擎的性能限制，比如垃圾回收机制（GC）带来的暂停，以及单线程模型的限制

- 编译过程的优化:

    AST 处理: SWC 在编译过程中不需将抽象语法树（Abstract Syntax Tree, AST）透传给多个插件，而是直接在内存中进行转换，减少了多次遍历 AST 的开销。而 Babel 需要将 AST 传递给每一个插件，这增加了编译时间和内存消耗

    并行处理: SWC 支持多核 CPU 并行处理，可以在多线程环境中更好地利用计算资源。Babel 主要是单线程的，虽然有 babel-loader 等工具可以利用多核处理器，但其核心编译过程仍然是单线程的

- 编译后的代码执行效率:
    WebAssembly 支持: SWC 可以将 JavaScript 代码编译为 WebAssembly，后者是一种二进制格式，执行速度更快。而 Babel 输出的是 JavaScript 代码，没有利用 WebAssembly 的优势

## Nextjs 常用命令

1. `npx create-next-app`: 创建一个新的 Next.js 项目
2. `npm run dev`: 启动 Next.js 项目的开发服务器，默认端口为 3000
3. `npm run build`: 构建 Next.js 项目，生成用于生产环境的静态资源
4. `npm run start`: 启动 Next.js 项目的预览服务器，用于查看构建后的项目
5. `npm run lint`: 执行代码检查，确保代码符合规范
6. `npm run test`: 执行测试用例，确保代码的质量
7. `npm run format`: 格式化代码，确保代码风格一致
8. `npm run deploy`: 部署 Next.js 项目到指定的托管平台，如 Netlify、Vercel 等

## Nextjs 常用配置

1. `pages`: 项目的页面目录，默认为 `pages` 目录，包含所有页面文件
2. `public`: 项目的静态资源目录，默认为 `public` 目录，包含所有静态资源文件，如图片、字体等
3. `components`: 项目的组件目录，默认为 `components` 目录，包含所有组件文件
4. `styles`: 项目的样式目录，默认为 `styles` 目录，包含所有样式文件，如 CSS、Sass、Less 等
5. `next.config.js`: 项目的配置文件，用于配置 Next.js 的各种功能，如路由、环境变量、插件等

## Nextjs 常用插件

1. `next-transpile-modules`: 用于在 Next.js 项目中导入第三方库，如 React Native 或其他需要编译的库
2. `next-compose-plugins`: 用于组合多个 Next.js 插件，简化插件的配置和安装
3. `next-optimized-images`: 用于优化 Next.js 项目中的图片，如压缩、优化等，以提高加载速度和性能
4. `next-pwa`: 用于添加 PWA 功能，如离线缓存、推送通知等，以提高用户体验和用户留存率

## Nextjs 常用库

1. `react`: React 是一个用于构建用户界面的 JavaScript 库，它提供了一种声明式的方式来描述用户界面，并使用虚拟 DOM 来提高性能
2. `next`: Next.js 是一个用于构建现代 Web 应用程序的框架，它基于 React 构建，并提供了许多开箱即用的功能来简化开发流程
3. `axios`: Axios 是一个基于 Promise 的 HTTP 客户端，用于在浏览器和 Node.js 中发送 HTTP 请求，简化了 HTTP 请求的配置和发送
4. `react-dom`: ReactDOM 是 React 的一个核心库，用于在浏览器中渲染 React 元素，它提供了一些用于操作 DOM 的方法，如 `render()`、`hydrate()` 等

