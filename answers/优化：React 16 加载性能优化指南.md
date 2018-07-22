# React 16 加载性能优化指南

基于 React 16 和 Webpack 4.0

## 页面加载过程

<img src="/img/app页面加载流程.jpg" title="app页面加载流程">

1. 用户打开页面，这个时候页面是完全空白的；
1. 然后 html 和引用的 css 加载完毕，浏览器进行首次渲染，我们把首次渲染需要加载的资源体积称为 “首屏体积”；
1. 然后 react、react-dom、业务代码加载完毕，应用第一次渲染，或者说首次内容渲染；
1. 然后应用的代码开始执行，拉取数据、进行动态import、响应事件等等，完毕后页面进入可交互状态；
1. 接下来 lazyload 的图片等多媒体内容开始逐渐加载完毕；
1. 然后直到页面的其它资源（如错误上报组件、打点上报组件等）加载完毕，整个页面的加载就结束了。

### 1. 打开页面 -> 首屏

写过 React 或者任何 SPA 的你，一定知道目前几乎所有流行的前端框架（React、Vue、Angular），它们的应用启动方式都是极其类似的：

html 中提供一个 root 节点

`<div id="root"></div>`

把应用挂载到这个节点上
```
ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
```
复制代码这样的模式，使用 webpack 打包之后，一般就是三个文件：

1. 一个体积很小、除了提供个 root 节点以外的没什么卵用的html（大概 1-4 KB）
1. 一个体积很大的 js（50 - 1000 KB 不等）
1. 一个 css 文件（当然如果你把 css 打进 js 里了，也可能没有）

这样造成的直接后果就是，用户在 50 - 1000 KB 的 js 文件加载、执行完毕之前，页面是 完！全！空！白！的！。
也就是说，这个时候：
首屏体积（首次渲染需要加载的资源体积） = html + js + css

#### 1.1 在 root 节点中写一些东西
我们完全可以把首屏渲染的时间点提前，比如在你的 root 节点中写一点东西：
`<div class="root">Loading...</div>`
复制代码就是这么简单，就可以把你应用的首屏时间提前到 html、css 加载完毕
此时：
首屏体积 = html + css
复制代码当然一行没有样式的 "Loading..." 文本可能会让设计师想揍你一顿，为了避免被揍，我们可以在把 root 节点内的内容画得好看一些：
```
<div id="root">
    <!-- 这里画一个 SVG -->
</div>
```

#### 1.2 使用 html-webpack-plugin 自动插入 loading
实际业务中肯定是有很多很多页面的，每个页面都要我们手动地复制粘贴这么一个 loading 态显然太不优雅了，
这时我们可以考虑使用 html-webpack-plugin 来帮助我们自动插入 loading。
```
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

// 读取写好的 loading 态的 html 和 css
var loading = {
    html: fs.readFileSync(path.join(__dirname, './loading.html')),
    css: '<style>' + fs.readFileSync(path.join(__dirname, './loading.css')) + '</style>'
}

var webpackConfig = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'xxxx.html',
      template: 'template.html',
      loading: loading
    })
  ]
};
```
复制代码然后在模板中引用即可：
```
<!DOCTYPE html>
<html lang="en">
    <head>
        <%= htmlWebpackPlugin.options.loading.css %>
    </head>

    <body>
        <div id="root">
            <%= htmlWebpackPlugin.options.loading.html %>
        </div>
    </body>
</html>
```

#### 1.3. 使用 prerender-spa-plugin 渲染首屏
在一些比较大型的项目中，Loading 可能本身就是一个 React/Vue 组件，在不做服务器端渲染的情况下，
想把一个已经组件化的 Loading 直接写入 html 文件中会很复杂，不过依然有解决办法。

prerender-spa-plugin 是一个可以帮你在构建时就生成页面首屏 html 的一个 webpack 插件，原理大致如下：

指定 dist 目录和要渲染的路径
插件在 dist 目录中开启一个静态服务器，并且使用无头浏览器（puppeteer）访问对应的路径，执行 JS，抓取对应路径的 html。
把抓到的内容写入 html，这样即使没有做服务器端渲染，也能达到跟服务器端渲染几乎相同的作用（不考虑动态数据的话）


```
plugins: [
  new PrerenderSpaPlugin(
    path.join(__dirname, 'dist'),
    [ '/', '/products/1', '/products/2', '/products/3']
  )
]
```

#### 1.4. 除掉外链 css

截止到目前，我们的首屏体积 = html + css，依然有优化的空间，那就是把外链的 css 去掉，让浏览器在加载完 html 时，即可渲染首屏。

实际上，webpack 默认就是没有外链 css 的，你什么都不需要做就可以了。当然如果你的项目之前配置了 extract-text-webpack-plugin 或者 
mini-css-extract-plugin 来生成独立的 css 文件，直接去掉即可。有人可能要质疑，把 css 打入 js 包里，会丢失浏览器很多缓存的好处
（比如你只改了 js 代码，导致构建出的 js 内容变化，但连带 css 都要一起重新加载一次），这样做真的值得吗？

确实这么做会让 css 无法缓存，但实际上对于现在成熟的前端应用来说，缓存不应该在 js/css 这个维度上区分，而是应该按照“组件”区分，
即配合动态 import 缓存组件。接下来你会看到，css in js 的模式带来的好处远大于这么一丁点缺点。



