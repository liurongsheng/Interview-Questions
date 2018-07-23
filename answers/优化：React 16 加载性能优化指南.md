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

1. 一个体积很小、除了提供个 root 节点以外的没什么功能的html（大概 1-4 KB）
1. 一个体积很大的 js（50 - 1000 KB 不等）
1. 一个 css 文件（当然如果你把 css 打进 js 里了，也可能没有）

这样造成的直接后果就是，用户在 50 - 1000 KB 的 js 文件加载、执行完毕之前，页面是 完！全！空！白！的！。
也就是说，这个时候：
首屏体积（首次渲染需要加载的资源体积） = html + js + css

#### 1.1 在 root 节点中写一些东西

我们完全可以把首屏渲染的时间点提前，比如在你的 root 节点中写一点东西：
`<div class="root">Loading...</div>`

就是这么简单，就可以把你应用的首屏时间提前到 html、css 加载完毕

此时：
首屏体积 = html + css

当然一行没有样式的 "Loading..." 文本可能会让设计师想揍你一顿，为了避免被揍，我们可以在把 root 节点内的内容画得好看一些：
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
然后在模板中引用即可：
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

`prerender-spa-plugin` 是一个可以帮你在构建时就生成页面首屏 html 的一个 webpack 插件，原理大致如下：

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
即配合动态 import 缓存组件。接下来你会看到，css in js 的模式带来的好处远大于缺点。


### 2. 首屏 -> 首次内容渲染

这一段过程中，浏览器主要在做的事情就是加载、运行 JS 代码，所以如何提升 JS 代码的加载、运行性能，就成为了优化的关键。
几乎所有业务的 JS 代码，都可以大致划分成以下几个大块：

1. 基础框架，如 React、Vue 等，这些基础框架的代码是不变的，除非升级框架；
1. Polyfill，对于使用了 ES2015+ 语法的项目来说，为了兼容性，polyfill 是必要的存在；
1. 业务基础库，业务的一些通用的基础代码，不属于框架，但大部分业务都会使用到；
1. 业务代码，特点是具体业务自身的逻辑代码。

想要优化这个时间段的性能，也就是要优化上面四种资源的加载速度。

#### 2.1. 缓存基础框架
基础框架代码的特点就是必需且不变，是一种非常适合缓存的内容。
所以我们需要做的就是为基础框架代码设置一个尽量长的缓存时间，使用户的浏览器尽量通过缓存加载这些资源。

##### 附：HTTP 缓存资源小结
HTTP 为我们提供了很好几种缓存的解决方案，不妨总结一下：

1. expires

`expires: Thu, 16 May 2019 03:05:59 GMT`

在 http 头中设置一个过期时间，在这个过期时间之前，浏览器的请求都不会发出，而是自动从缓存中读取文件，
除非缓存被清空，或者强制刷新。缺陷在于，服务器时间和用户端时间可能存在不一致，
所以 HTTP/1.1 加入了 cache-control 头来改进这个问题。

2. cache-control

`cache-control: max-age=31536000`

设置过期的时间长度（秒），在这个时间范围内，浏览器请求都会直接读缓存。当 expires 和 cache-control 都存在时，cache-control 的优先级更高。

3. last-modified / if-modified-since

这是一组请求/相应头
响应头：
last-modified: Wed, 16 May 2018 02:57:16 GMT

请求头：
if-modified-since: Wed, 16 May 2018 05:55:38 GMT
服务器端返回资源时，如果头部带上了 last-modified，那么资源下次请求时就会把值加入到请求头 if-modified-since 中，服务器可以对比这个值，确定资源是否发生变化，如果没有发生变化，则返回 304。

4. etag / if-none-match

这也是一组请求/响应头

响应头：
etag: "D5FC8B85A045FF720547BC36FC872550"

请求头：
if-none-match: "D5FC8B85A045FF720547BC36FC872550"

原理类似，服务器端返回资源时，如果头部带上了 etag，那么资源下次请求时就会把值加入到请求头 if-none-match 中，服务器可以对比这个值，确定资源是否发生变化，如果没有发生变化，则返回 304。

**上面四种缓存的优先级：cache-control > expires > etag > last-modified**

#### 2.2. 使用动态 polyfill
Polyfill 的特点是非必需和不变，因为对于一台手机来说，需要哪些 polyfill 是固定的，当然也可能完全不需要 polyfill。

现在为了浏览器的兼容性，我们常常引入各种 polyfill，但是在构建时静态地引入 polyfill 存在一些问题，比如对于机型和浏览器版本比较新的用户来说，
他们完全不需要 polyfill，引入 polyfill 对于这部分用户来说是多余的，从而造成体积变大和性能损失。

比如 React 16 的代码中依赖了 ES6 的 Map/Set 对象，使用时需要你自己加入 polyfill，但目前几个完备的 Map/Set 的 polyfill 体积都比较大，打包进来会增大很多体积。
还比如 Promise 对象，实际上根据 caniuse.com 的数据，移动端上，中国接近 94% 的用户浏览器，都是原生支持 Promise 的，
并不需要 polyfill。但实际上我们打包时还是会打包 Promise 的 polyfill，也就是说，我们为了 6% 的用户兼容性，增大了 94% 用户的加载体积。

所以这里的解决方法就是，去掉构建中静态的 polyfill，换而使用 polyfill.io 这样的动态 polyfill 服务，保证只有在需要时，才会引入 polyfill。
具体的使用方法非常简单，只需要外链一个 js：

`<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>`

当然这样是加载全部的 polyfill，实际上你可能并不需要这么多，比如你只需要 Map/Set 的话：

`<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Map,Set"></script>`

动态 polyfill 的原理
如果你用最新的 Chrome 浏览器访问这个链接的话：`cdn.polyfill.io/v2/polyfill.min.js`，你会发现内容几乎是空的：

如果打开控制台，模拟 iOS 的 Safari，再访问一次，你会发现里面就出现了一些 polyfill（URL 对象的 polyfill）：

这就是 polyfill.io 的原理，它会根据你的浏览器 UA 头，判断你是否支持某些特性，从而返回给你一个合适的 polyfill。
对于最新的 Chrome 浏览器来说，不需要任何 polyfill，所以返回的内容为空。对于 iOS Safari 来说，需要 URL 对象的 polyfill，所以返回了对应的资源。


#### 2.3.  使用 SplitChunksPlugin 自动拆分业务基础库
Webpack 4 抛弃了原有的 [CommonChunksPlugin](https://webpack.js.org/plugins/commons-chunk-plugin)，换成了更为先进的 [SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin)，用于提取公用代码。

它们的区别就在于，CommonChunksPlugin 会找到多数模块中都共有的东西，并且把它提取出来（common.js），也就意味着如果你加载了 common.js，那么里面可能会存在一些当前模块不需要的东西。
而 SplitChunksPlugin 采用了完全不同的 heuristics 方法，它会根据模块之间的依赖关系，自动打包出很多很多（而不是单个）通用模块，可以保证加载进来的代码一定是会被依赖到的。
下面是一个简单的例子，假设我们有 4 个 chunk，分别依赖了以下模块：

chunk
依赖模块
```
chunk-a
react, react-dom, componentA, utils

chunk-b
react, react-dom, componentB, utils

chunk-c
angular, componentC, utils

chunk-d
angular, componentD, utils
```
如果是以前的 CommonChunksPlugin，那么默认配置会把它们打包成下面这样：

包名
包含的模块
```
common
utils

chunk-a
react, react-dom, componentA

chunk-b
react, react-dom, componentB

chunk-c
angular, componentC

chunk-d
angular, componentD
```
显然在这里，react、react-dom、angular 这些公用的模块没有被抽出成为独立的包，存在进一步优化的空间。
现在，新的 SplitChunksPlugin 会把它们打包成以下几个包：

包名
包含的模块
```
chunk-a~chunk-b~chunk-c~chunk-d
utils

chunk-a~chunk-b
react, react-dom

chunk-c~chunk-d
angular

chunk-a
componentA

chunk-b
componentB

chunk-c
componentC

chunk-d
componentD
```
这就保证了所有公用的模块，都会被抽出成为独立的包，几乎完全避免了多页应用中，重复加载相同模块的问题。
具体如何配置 SplitChunksPlugin，请参考 [webpack 官方文档](https://webpack.js.org/plugins/split-chunks-plugin/#src/components/Sidebar/Sidebar.jsx)。

注：目前使用 SplitChunksPlugin 存在的坑

虽然 webpack 4.0 提供的 SplitChunksPlugin 非常好用，但截止到写这篇文章的时候（2018年5月），依然存在一个坑，
那就是 html-webpack-plugin 还不完全支持 SplitChunksPlugin，生成的公用模块包还无法自动注入到 html 中。

可以参考下面的 issue 或者 PR：

How to inject webpack 4 splited chunks. · Issue #882
allow to specify regexp as included or excluded chunks by mike1808 · Pull Request #881


#### 2.4. 正确使用 Tree Shaking 减少业务代码体积

Tree Shaking 这已经是一个很久很久以前就存在的 webpack 特性了，老生常谈，但事实上不是所有的人（特别是对 webpack 不了解的人）
都正确地使用了它，所以我今天要在这里啰嗦地再写一遍。
例如，我们有下面这样一个使用了 ES Module 标准的模块：
```
// math.js
export function square(x) {
  return x * x
}

export function cube(x) {
  return x * x * x
}
```
然后你在另一个模块中引用了它：
```
// index.js
import { cube } from './math'
cube(123)
```
经过 webpack 打包之后，math.js 会变成下面这样：
```
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export square */
/* harmony export (immutable) */ __webpack_exports__["a"] = cube;
function square(x) {
  return x * x;
}

function cube(x) {
  return x * x * x;
}
```
注意这里 square 函数依然存在，但多了一行 magic comment：unused harmony export square
随后的压缩代码的 uglifyJS 就会识别到这行 magic comment，并且把 square 函数丢弃。
但是一定要注意！！！ webpack 2.0 开始原生支持 ES Module，也就是说不需要 babel 把 ES Module 转换成曾经的 commonjs 模块了，想用上 Tree Shaking，请务必关闭 babel 默认的模块转义：
```
{
  "presets": [
    ["env", {
      "modules": false
      }
    }]
  ]
}
```
另外，Webpack 4.0 开始，Tree Shaking 对于那些无副作用的模块也会生效了。
如果你的一个模块在 package.json 中说明了这个模块没有副作用（也就是说执行其中的代码不会对环境有任何影响，例如只是声明了一些函数和常量）：
```
{
  "name": "your-module",
  "sideEffects": false
}
```
那么在引入这个模块，却没有使用它时，webpack 会自动把它 Tree Shaking 丢掉：
```
import yourModule from 'your-module'
// 下面没有用到 yourModule
```
这一点对于 lodash、underscore 这样的工具库来说尤其重要，开启了这个特性之后，你现在可以无心理负担地这样写了：
```
import { capitalize } from 'lodash-es';
document.write(capitalize('yo'));
```

### 3. 首次内容渲染 -> 可交互

这一段过程中，浏览器主要在做的事情就是加载及初始化各项组件

#### 3.1. Code Splitting

大多数打包器（比如 webpack、rollup、browserify）的作用就是把你的页面代码打包成一个很大的 “bundle”，所有的代码都会在这个 bundle 中。

但是，随着应用的复杂度日益提高，bundle 的体积也会越来越大，加载 bundle 的时间也会变长，这就对加载过程中的用户体验造成了很大的负面影响。

为了避免打出过大的 bundle，我们要做的就是切分代码，也就是 Code Splitting，目前几乎所有的打包器都原生支持这个特性。

Code Splitting 可以帮你“懒加载”代码，以提高用户的加载体验，如果你没办法直接减少应用的体积，那么不妨尝试把应用从单个 bundle 拆分成单个 bundle + 多份动态代码的形式。

比如我们可以把下面这种形式：
```
import { add } from './math';
console.log(add(16, 26));
```
改写成动态 import 的形式，让首次加载时不去加载 math 模块，从而减少首次加载资源的体积。
```
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```
React Loadable 是一个专门用于动态 import 的 React 高阶组件，你可以把任何组件改写为支持动态 import 的形式。
```
import Loadable from 'react-loadable';
import Loading from './loading-component';

const LoadableComponent = Loadable({
  loader: () => import('./my-component'),
  loading: Loading,
});

export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}
```
上面的代码在首次加载时，会先展示一个 loading-component，然后动态加载 my-component 的代码，组件代码加载完毕之后，便会替换掉 loading-component。

下面是一个具体的例子：

<img src="/img/首次页面渲染示例.png" title="首次页面渲染示例">

以这个用户主页为例，起码有三处组件是不需要首次加载的，而是使用动态加载：标题栏、Tab 栏、列表。
首次加载实际上只需要加载中心区域的用户头像、昵称、ID即可。切分之后，首屏 js 体积从 40KB 缩减到了 20KB.

#### 3.2 编译到 ES2015+ ，提升代码运行效率

相关文章：[《Deploying ES2015+ Code in Production Today》](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)
如今大多数项目的做法都是，编写 ES2015+ 标准的代码，然后在构建时编译到 ES5 标准运行。

比如一段非常简洁的 class 语法：
```
class Foo extends Bar {
    constructor(x) {
        super()
        this.x = x;
    }
}
```
复制代码会被编译成这样：
```
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Foo = function (_Bar) {
  _inherits(Foo, _Bar);

  function Foo(x) {
    _classCallCheck(this, Foo);

    var _this = _possibleConstructorReturn(this, (Foo.__proto__ || Object.getPrototypeOf(Foo)).call(this));

    _this.x = x;
    return _this;
  }

  return Foo;
}(Bar);
```
但实际上，大部分现代浏览器已经原生支持 class 语法，比如 iOS Safari 从 2015 年的 iOS 9.0 开始就支持了，根据 caniuse 的数据，
目前移动端上 90% 用户的浏览器都是原生支持 class 语法的：

其它 ES2015 的特性也是同样的情况。

也就是说，在当下 2018 年，对于大部分用户而言，我们根本不需要把代码编译到 ES5，不仅体积大，而且运行速度慢。
我们需要做的，就是把代码编译到 ES2015+，然后为少数使用老旧浏览器的用户保留一个 ES5 标准的备胎即可。

具体的解决方法就是 <script type="module"> 标签。
支持 <script type="module"> 的浏览器，必然支持下面的特性：
```
async/await
Promise
Class
箭头函数、Map/Set、fetch 等等...
```
而不支持 <script type="module"> 的老旧浏览器，会因为无法识别这个标签，而不去加载 ES2015+ 的代码。
另外老旧的浏览器同样无法识别 nomodule 熟悉，会自动忽略它，从而加载 ES5 标准的代码。

简单地归纳为下图：
<img src="/img/支持ES-Module区分新老浏览器.png" title="支持ES-Module区分新老浏览器">

根据这篇文章，打包后的体积和运行效率都得到了显著提高。

### 4. 可交互 -> 内容加载完毕

这个阶段就很简单了，主要是各种多媒体内容的加载
#### 4.1 LazyLoad

懒加载其实没什么好说的，目前也有一些比较成熟的组件了，自己实现一个也不是特别难：
```
react-lazyload
react-lazy-load
```
当然你也可以实现像 Medium 的那种加载体验（好像知乎已经是这样了），即先加载一张低像素的模糊图片，然后等真实图片加载完毕之后，再替换掉。
实际上目前几乎所有 lazyload 组件都不外乎以下两种原理：
```
监听 window 对象或者父级对象的 scroll 事件，触发 load；
使用 Intersection Observer API 来获取元素的可见性。
```
#### 4.2 placeholder
我们在加载文本、图片的时候，经常出现“闪屏”的情况，比如图片或者文字还没有加载完毕，此时页面上对应的位置还是完全空着的，然后加载完毕，内容会突然撑开页面，导致“闪屏”的出现，造成不好的体验。
为了避免这种突然撑开的情况，我们要做的就是提前设置占位元素，也就是 placeholder：

已经有一些现成的第三方组件可以用了：
```
react-placeholder
react-hold
```
另外还可以参考 Facebook 的这篇文章：[《How the Facebook content placeholder works》](https://cloudcannon.com/deconstructions/2014/11/15/facebook-content-placeholder-deconstruction.html)


### 5. 总结

这篇文章里，我们一共提到了下面这些优化加载的点：

1. 在 HTML 内实现 Loading 态或者骨架屏；
1. 去掉外联 css；
1. 缓存基础框架；
1. 使用动态 polyfill；
1. 使用 SplitChunksPlugin 拆分公共代码；
1. 正确地使用 Webpack 4.0 的 Tree Shaking；
1. 使用动态 import，切分页面代码，减小首屏 JS 体积；
1. 编译到 ES2015+，提高代码运行效率，减小体积；
1. 使用 lazyload 和 placeholder 提升加载体验。

[作者:腾讯IVWEB团队](https://juejin.im/post/5b506ae0e51d45191a0d4ec9?utm_source=gold_browser_extension)