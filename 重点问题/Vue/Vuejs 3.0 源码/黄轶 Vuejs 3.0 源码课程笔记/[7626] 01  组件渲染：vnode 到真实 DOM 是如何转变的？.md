<p data-nodeid="38546" class="">在 Vue.js 中，组件是一个非常重要的概念，整个应用的页面都是通过组件渲染来实现的，但是你知道当我们编写这些组件的时候，它的内部是如何工作的吗？从我们编写组件开始，到最终真实的 DOM 又是怎样的一个转变过程呢？这节课，我们将会学习 Vue.js 3.0 中的组件是如何渲染的，通过学习，你的这些问题将会迎刃而解。</p>
<p data-nodeid="38547">首先，组件是一个抽象的概念，它是对一棵 DOM 树的抽象，我们在页面中写一个组件节点：</p>
<pre class="lang-html" data-nodeid="38548"><code data-language="html"><span class="hljs-tag">&lt;<span class="hljs-name">hello-world</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">hello-world</span>&gt;</span>
</code></pre>
<p data-nodeid="38549">这段代码并不会在页面上渲染一个<code data-backticks="1" data-nodeid="38691">&lt;hello-world&gt;</code>标签，而它具体渲染成什么，取决于你怎么编写 HelloWorld 组件的模板。举个例子，HelloWorld 组件内部的模板定义是这样的：</p>
<pre class="lang-html" data-nodeid="38550"><code data-language="html"><span class="hljs-tag">&lt;<span class="hljs-name">template</span>&gt;</span>
  <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Hello World<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">template</span>&gt;</span>
</code></pre>
<p data-nodeid="38551">可以看到，模板内部最终会在页面上渲染一个 div，内部包含一个 p 标签，用来显示 Hello World 文本。</p>
<p data-nodeid="38552">所以，从表现上来看，组件的模板决定了组件生成的 DOM 标签，而在 Vue.js 内部，一个组件想要真正的渲染生成 DOM，还需要经历“创建 vnode - 渲染 vnode - 生成 DOM” 这几个步骤：</p>
<p data-nodeid="38553"><img src="https://s0.lgstatic.com/i/image/M00/2D/FE/Ciqc1F8EO_OAOS86AABTGXEAHqA770.png" alt="1111.png" data-nodeid="38697"></p>
<p data-nodeid="38554">你可能会问，什么是 vnode，它和组件什么关系呢？先不要着急，我们在后面会详细说明。这里，你只需要记住它就是一个可以描述组件信息的 JavaScript 对象即可。</p>
<p data-nodeid="38555">接下来，我们就从应用程序的入口开始，逐步来看 Vue.js 3.0 中的组件是如何渲染的。</p>
<h3 data-nodeid="38556">应用程序初始化</h3>
<p data-nodeid="38557">一个组件可以通过“模板加对象描述”的方式创建，组件创建好以后是如何被调用并初始化的呢？因为整个组件树是由根组件开始渲染的，为了找到根组件的渲染入口，我们需要从应用程序的初始化过程开始分析。</p>
<p data-nodeid="38558">在这里，我分别给出了通过 Vue.js 2.x 和 Vue.js 3.0 来初始化应用的代码：</p>
<pre class="lang-java" data-nodeid="38559"><code data-language="java"><span class="hljs-comment">// 在 Vue.js 2.x 中，初始化一个应用的方式如下</span>
<span class="hljs-keyword">import</span> Vue from <span class="hljs-string">'vue'</span>
<span class="hljs-keyword">import</span> App from <span class="hljs-string">'./App'</span>
<span class="hljs-keyword">const</span> app = <span class="hljs-keyword">new</span> Vue({
  render: h =&gt; h(App)
})
app.$mount(<span class="hljs-string">'#app'</span>)
</code></pre>
<pre class="lang-java" data-nodeid="38560"><code data-language="java"><span class="hljs-comment">// 在 Vue.js 3.0 中，初始化一个应用的方式如下</span>
<span class="hljs-keyword">import</span> { createApp } from <span class="hljs-string">'vue'</span>
<span class="hljs-keyword">import</span> App from <span class="hljs-string">'./app'</span>
<span class="hljs-keyword">const</span> app = createApp(App)
app.mount(<span class="hljs-string">'#app'</span>)
</code></pre>
<p data-nodeid="38561">可以看到，Vue.js 3.0 初始化应用的方式和 Vue.js 2.x 差别并不大，本质上都是把 App 组件挂载到 id 为 app 的 DOM 节点上。</p>
<p data-nodeid="38562">但是，在 Vue.js 3.0 中还导入了一个 createApp，其实这是个入口函数，它是 Vue.js 对外暴露的一个函数，我们来看一下它的内部实现：</p>
<pre class="lang-java" data-nodeid="38563"><code data-language="java"><span class="hljs-keyword">const</span> createApp = ((...args) =&gt; {
  <span class="hljs-comment">// 创建 app 对象</span>
  <span class="hljs-keyword">const</span> app = ensureRenderer().createApp(...args)
  <span class="hljs-keyword">const</span> { mount } = app
  <span class="hljs-comment">// 重写 mount 方法</span>
  app.mount = (containerOrSelector) =&gt; {
    <span class="hljs-comment">// ...</span>
  }
  <span class="hljs-keyword">return</span> app
})
</code></pre>
<p data-nodeid="38564">从代码中可以看出 createApp 主要做了两件事情：创建 app 对象和重写 app.mount 方法。接下来，我们就具体来分析一下它们。</p>
<h4 data-nodeid="38565">1. 创建 app 对象</h4>
<p data-nodeid="38566">首先，我们使用 ensureRenderer().createApp() 来创建 app 对象 ：</p>
<pre class="lang-java" data-nodeid="38567"><code data-language="java"> <span class="hljs-keyword">const</span> app = ensureRenderer().createApp(...args)
</code></pre>
<p data-nodeid="38568">其中 ensureRenderer() 用来创建一个渲染器对象，它的内部代码是这样的：</p>
<pre class="lang-java" data-nodeid="38569"><code data-language="java"><span class="hljs-comment">// 渲染相关的一些配置，比如更新属性的方法，操作 DOM 的方法</span>
<span class="hljs-keyword">const</span> rendererOptions = {
  patchProp,
  ...nodeOps
}
let renderer
<span class="hljs-comment">// 延时创建渲染器，当用户只依赖响应式包的时候，可以通过 tree-shaking 移除核心渲染逻辑相关的代码</span>
<span class="hljs-function">function <span class="hljs-title">ensureRenderer</span><span class="hljs-params">()</span> </span>{
  <span class="hljs-keyword">return</span> renderer || (renderer = createRenderer(rendererOptions))
}
<span class="hljs-function">function <span class="hljs-title">createRenderer</span><span class="hljs-params">(options)</span> </span>{
  <span class="hljs-keyword">return</span> baseCreateRenderer(options)
}
<span class="hljs-function">function <span class="hljs-title">baseCreateRenderer</span><span class="hljs-params">(options)</span> </span>{
  <span class="hljs-function">function <span class="hljs-title">render</span><span class="hljs-params">(vnode, container)</span> </span>{
    <span class="hljs-comment">// 组件渲染的核心逻辑</span>
  }

  <span class="hljs-keyword">return</span> {
    render,
    createApp: createAppAPI(render)
  }
}
<span class="hljs-function">function <span class="hljs-title">createAppAPI</span><span class="hljs-params">(render)</span> </span>{
  <span class="hljs-comment">// createApp createApp 方法接受的两个参数：根组件的对象和 prop</span>
  <span class="hljs-keyword">return</span> <span class="hljs-function">function <span class="hljs-title">createApp</span><span class="hljs-params">(rootComponent, rootProps = <span class="hljs-keyword">null</span>)</span> </span>{
    <span class="hljs-keyword">const</span> app = {
      _component: rootComponent,
      _props: rootProps,
      mount(rootContainer) {
        <span class="hljs-comment">// 创建根组件的 vnode</span>
        <span class="hljs-keyword">const</span> vnode = createVNode(rootComponent, rootProps)
        <span class="hljs-comment">// 利用渲染器渲染 vnode</span>
        render(vnode, rootContainer)
        app._container = rootContainer
        <span class="hljs-keyword">return</span> vnode.component.proxy
      }
    }
    <span class="hljs-keyword">return</span> app
  }
}
</code></pre>
<p data-nodeid="38570">可以看到，这里先用 ensureRenderer() 来延时创建渲染器，这样做的好处是当用户只依赖响应式包的时候，就不会创建渲染器，因此可以通过 tree-shaking 的方式移除核心渲染逻辑相关的代码。</p>
<p data-nodeid="38571">这里涉及了渲染器的概念，它是为跨平台渲染做准备的，之后我会在自定义渲染器的相关内容中详细说明。在这里，你可以简单地把渲染器理解为包含平台渲染核心逻辑的 JavaScript 对象。</p>
<p data-nodeid="38572">我们结合上面的代码继续深入，在 Vue.js 3.0 内部通过 createRenderer 创建一个渲染器，这个渲染器内部会有一个 createApp 方法，它是执行 createAppAPI 方法返回的函数，接受了 rootComponent 和 rootProps 两个参数，我们在应用层面执行 createApp(App) 方法时，会把 App 组件对象作为根组件传递给 rootComponent。这样，createApp 内部就创建了一个 app 对象，它会提供 mount 方法，这个方法是用来挂载组件的。</p>
<p data-nodeid="38573">在整个 app 对象创建过程中，Vue.js 利用闭包和函数柯里化的技巧，很好地实现了参数保留。比如，在执行 app.mount 的时候，并不需要传入渲染器 render，这是因为在执行 createAppAPI 的时候渲染器 render 参数已经被保留下来了。</p>
<h4 data-nodeid="38574">2. 重写 app.mount 方法</h4>
<p data-nodeid="38575">接下来，是重写 app.mount 方法。</p>
<p data-nodeid="38576">根据前面的分析，我们知道 createApp 返回的 app 对象已经拥有了 mount 方法了，但在入口函数中，接下来的逻辑却是对 app.mount 方法的重写。先思考一下，为什么要重写这个方法，而不把相关逻辑放在 app 对象的 mount 方法内部来实现呢？</p>
<p data-nodeid="38577">这是因为 Vue.js 不仅仅是为 Web 平台服务，它的目标是支持跨平台渲染，而 createApp 函数内部的 app.mount 方法是一个标准的可跨平台的组件渲染流程：</p>
<pre class="lang-java" data-nodeid="38578"><code data-language="java">mount(rootContainer) {
  <span class="hljs-comment">// 创建根组件的 vnode</span>
  <span class="hljs-keyword">const</span> vnode = createVNode(rootComponent, rootProps)
  <span class="hljs-comment">// 利用渲染器渲染 vnode</span>
  render(vnode, rootContainer)
  app._container = rootContainer
  <span class="hljs-keyword">return</span> vnode.component.proxy
}
</code></pre>
<p data-nodeid="38579">标准的跨平台渲染流程是先创建 vnode，再渲染 vnode。此外参数 rootContainer 也可以是不同类型的值，比如，在 Web 平台它是一个 DOM 对象，而在其他平台（比如 Weex 和小程序）中可以是其他类型的值。所以这里面的代码不应该包含任何特定平台相关的逻辑，也就是说这些代码的执行逻辑都是与平台无关的。因此我们需要在外部重写这个方法，来完善 Web 平台下的渲染逻辑。</p>
<p data-nodeid="38580">接下来，我们再来看 app.mount 重写都做了哪些事情：</p>
<pre class="lang-java" data-nodeid="38581"><code data-language="java">app.mount = (containerOrSelector) =&gt; {
  <span class="hljs-comment">// 标准化容器</span>
  <span class="hljs-keyword">const</span> container = normalizeContainer(containerOrSelector)
  <span class="hljs-keyword">if</span> (!container)
    <span class="hljs-keyword">return</span>
  <span class="hljs-keyword">const</span> component = app._component
   <span class="hljs-comment">// 如组件对象没有定义 render 函数和 template 模板，则取容器的 innerHTML 作为组件模板内容</span>
  <span class="hljs-keyword">if</span> (!isFunction(component) &amp;&amp; !component.render &amp;&amp; !component.template) {
    component.template = container.innerHTML
  }
  <span class="hljs-comment">// 挂载前清空容器内容</span>
  container.innerHTML = <span class="hljs-string">''</span>
  <span class="hljs-comment">// 真正的挂载</span>
  <span class="hljs-keyword">return</span> mount(container)
}
</code></pre>
<p data-nodeid="38582">首先是通过 normalizeContainer 标准化容器（这里可以传字符串选择器或者 DOM 对象，但如果是字符串选择器，就需要把它转成 DOM 对象，作为最终挂载的容器），然后做一个 if 判断，如果组件对象没有定义 render 函数和 template 模板，则取容器的 innerHTML 作为组件模板内容；接着在挂载前清空容器内容，最终再调用 app.mount 的方法走标准的组件渲染流程。</p>
<p data-nodeid="38583">在这里，重写的逻辑都是和 Web 平台相关的，所以要放在外部实现。此外，这么做的目的是既能让用户在使用 API 时可以更加灵活，也兼容了 Vue.js 2.x 的写法，比如 app.mount 的第一个参数就同时支持选择器字符串和 DOM 对象两种类型。</p>
<p data-nodeid="38584">从 app.mount 开始，才算真正进入组件渲染流程，那么接下来，我们就重点看一下核心渲染流程做的两件事情：创建 vnode 和渲染 vnode。</p>
<h3 data-nodeid="38585">核心渲染流程：创建 vnode 和渲染 vnode</h3>
<h4 data-nodeid="38586">1. 创建 vnode</h4>
<p data-nodeid="38587">首先，是创建 vnode 的过程。</p>
<p data-nodeid="38588">vnode 本质上是用来描述 DOM 的 JavaScript 对象，它在 Vue.js 中可以描述不同类型的节点，比如普通元素节点、组件节点等。</p>
<p data-nodeid="38589">什么是<strong data-nodeid="38741">普通元素节点</strong>呢？举个例子，在 HTML 中我们使用 <code data-backticks="1" data-nodeid="38739">&lt;button&gt;</code> 标签来写一个按钮：</p>
<pre class="lang-js" data-nodeid="38590"><code data-language="js">&lt;button <span class="hljs-class"><span class="hljs-keyword">class</span></span>=<span class="hljs-string">"btn"</span> style=<span class="hljs-string">"width:100px;height:50px"</span>&gt;click me&lt;/button&gt;
</code></pre>
<p data-nodeid="38591">我们可以用 vnode 这样表示<code data-backticks="1" data-nodeid="38743">&lt;button&gt;</code>标签：</p>
<pre class="lang-java" data-nodeid="38592"><code data-language="java"><span class="hljs-keyword">const</span> vnode = {
  type: <span class="hljs-string">'button'</span>,
  props: { 
    <span class="hljs-string">'class'</span>: <span class="hljs-string">'btn'</span>,
    style: {
      width: <span class="hljs-string">'100px'</span>,
      height: <span class="hljs-string">'50px'</span>
    }
  },
  children: <span class="hljs-string">'click me'</span>
}
</code></pre>
<p data-nodeid="38593">其中，type 属性表示 DOM 的标签类型，props 属性表示 DOM 的一些附加信息，比如 style 、class 等，children 属性表示 DOM 的子节点，它也可以是一个 vnode 数组，只不过 vnode 可以用字符串表示简单的文本 。</p>
<p data-nodeid="38594">什么是<strong data-nodeid="38751">组件节点</strong>呢？其实， vnode 除了可以像上面那样用于描述一个真实的 DOM，也可以用来描述组件。</p>
<p data-nodeid="38595">我们先在模板中引入一个组件标签 <code data-backticks="1" data-nodeid="38753"> &lt;custom-component&gt;</code>：</p>
<pre class="lang-js" data-nodeid="38596"><code data-language="js">&lt;custom-component msg=<span class="hljs-string">"test"</span>&gt;&lt;/custom-component&gt;
</code></pre>
<p data-nodeid="38597">我们可以用 vnode 这样表示 <code data-backticks="1" data-nodeid="38756">&lt;custom-component&gt;</code> 组件标签：</p>
<pre class="lang-java" data-nodeid="38598"><code data-language="java"><span class="hljs-keyword">const</span> CustomComponent = {
  <span class="hljs-comment">// 在这里定义组件对象</span>
}
<span class="hljs-keyword">const</span> vnode = {
  type: CustomComponent,
  props: { 
    msg: <span class="hljs-string">'test'</span>
  }
}
</code></pre>
<p data-nodeid="38599">组件 vnode 其实是<strong data-nodeid="38765">对抽象事物的描述</strong>，这是因为我们并不会在页面上真正渲染一个 <code data-backticks="1" data-nodeid="38763">&lt;custom-component&gt;</code> 标签，而是渲染组件内部定义的 HTML 标签。</p>
<p data-nodeid="38600">除了上两种 vnode 类型外，还有纯文本 vnode、注释 vnode 等等，但鉴于我们的主线只需要研究组件 vnode 和普通元素 vnode，所以我在这里就不赘述了。</p>
<p data-nodeid="38601">另外，Vue.js 3.0 内部还针对 vnode 的 type，做了更详尽的分类，包括 Suspense、Teleport 等，且把 vnode 的类型信息做了编码，以便在后面的 patch 阶段，可以根据不同的类型执行相应的处理逻辑：</p>
<pre class="lang-java" data-nodeid="38602"><code data-language="java"><span class="hljs-keyword">const</span> shapeFlag = isString(type)
  ? <span class="hljs-number">1</span> <span class="hljs-comment">/* ELEMENT */</span>
  : isSuspense(type)
    ? <span class="hljs-number">128</span> <span class="hljs-comment">/* SUSPENSE */</span>
    : isTeleport(type)
      ? <span class="hljs-number">64</span> <span class="hljs-comment">/* TELEPORT */</span>
      : isObject(type)
        ? <span class="hljs-number">4</span> <span class="hljs-comment">/* STATEFUL_COMPONENT */</span>
        : isFunction(type)
          ? <span class="hljs-number">2</span> <span class="hljs-comment">/* FUNCTIONAL_COMPONENT */</span>
          : <span class="hljs-number">0</span>
</code></pre>
<p data-nodeid="38603"><strong data-nodeid="38771">知道什么是 vnode 后，你可能会好奇，那么 vnode 有什么优势呢？为什么一定要设计 vnode 这样的数据结构呢？</strong></p>
<p data-nodeid="38604">首先是<strong data-nodeid="38777">抽象</strong>，引入 vnode，可以把渲染过程抽象化，从而使得组件的抽象能力也得到提升。</p>
<p data-nodeid="38605">其次是<strong data-nodeid="38783">跨平台</strong>，因为 patch vnode 的过程不同平台可以有自己的实现，基于 vnode 再做服务端渲染、Weex 平台、小程序平台的渲染都变得容易了很多。</p>
<p data-nodeid="38606">不过这里要特别注意，使用 vnode 并不意味着不用操作 DOM 了，很多同学会误以为 vnode 的性能一定比手动操作原生 DOM 好，这个其实是不一定的。</p>
<p data-nodeid="38607">因为，首先这种基于 vnode 实现的 MVVM 框架，在每次 render to vnode 的过程中，渲染组件会有一定的 JavaScript 耗时，特别是大组件，比如一个 1000 * 10 的 Table 组件，render to vnode 的过程会遍历 1000 * 10 次去创建内部 cell vnode，整个耗时就会变得比较长，加上 patch vnode 的过程也会有一定的耗时，当我们去更新组件的时候，用户会感觉到明显的卡顿。虽然 diff 算法在减少 DOM 操作方面足够优秀，但最终还是免不了操作 DOM，所以说性能并不是 vnode 的优势。</p>
<p data-nodeid="38608"><strong data-nodeid="38793">那么，Vue.js 内部是如何创建这些 vnode 的呢？</strong></p>
<p data-nodeid="38609">回顾 app.mount 函数的实现，内部是通过 createVNode 函数创建了根组件的 vnode ：</p>
<pre class="lang-java" data-nodeid="38610"><code data-language="java"> <span class="hljs-keyword">const</span> vnode = createVNode(rootComponent, rootProps)
</code></pre>
<p data-nodeid="38611">我们来看一下 createVNode 函数的大致实现：</p>
<pre class="lang-java" data-nodeid="38612"><code data-language="java"><span class="hljs-function">function <span class="hljs-title">createVNode</span><span class="hljs-params">(type, props = <span class="hljs-keyword">null</span>
,children = <span class="hljs-keyword">null</span>)</span> </span>{
  <span class="hljs-keyword">if</span> (props) {
    <span class="hljs-comment">// 处理 props 相关逻辑，标准化 class 和 style</span>
  }
  <span class="hljs-comment">// 对 vnode 类型信息编码</span>
  <span class="hljs-keyword">const</span> shapeFlag = isString(type)
    ? <span class="hljs-number">1</span> <span class="hljs-comment">/* ELEMENT */</span>
    : isSuspense(type)
      ? <span class="hljs-number">128</span> <span class="hljs-comment">/* SUSPENSE */</span>
      : isTeleport(type)
        ? <span class="hljs-number">64</span> <span class="hljs-comment">/* TELEPORT */</span>
        : isObject(type)
          ? <span class="hljs-number">4</span> <span class="hljs-comment">/* STATEFUL_COMPONENT */</span>
          : isFunction(type)
            ? <span class="hljs-number">2</span> <span class="hljs-comment">/* FUNCTIONAL_COMPONENT */</span>
            : <span class="hljs-number">0</span>
  <span class="hljs-keyword">const</span> vnode = {
    type,
    props,
    shapeFlag,
    <span class="hljs-comment">// 一些其他属性</span>
  }
  <span class="hljs-comment">// 标准化子节点，把不同数据类型的 children 转成数组或者文本类型</span>
  normalizeChildren(vnode, children)
  <span class="hljs-keyword">return</span> vnode
}
</code></pre>
<p data-nodeid="38613">通过上述代码可以看到，其实 createVNode 做的事情很简单，就是：对 props 做标准化处理、对 vnode 的类型信息编码、创建 vnode 对象，标准化子节点 children 。</p>
<p data-nodeid="38614">我们现在拥有了这个 vnode 对象，接下来要做的事情就是把它渲染到页面中去。</p>
<h4 data-nodeid="38615">2. 渲染 vnode</h4>
<p data-nodeid="38616">接下来，是渲染 vnode 的过程。</p>
<p data-nodeid="38617">回顾 app.mount 函数的实现，内部通过执行这段代码去渲染创建好的 vnode：</p>
<pre class="lang-java" data-nodeid="38618"><code data-language="java">render(vnode, rootContainer)
<span class="hljs-keyword">const</span> render = (vnode, container) =&gt; {
  <span class="hljs-keyword">if</span> (vnode == <span class="hljs-keyword">null</span>) {
    <span class="hljs-comment">// 销毁组件</span>
    <span class="hljs-keyword">if</span> (container._vnode) {
      unmount(container._vnode, <span class="hljs-keyword">null</span>, <span class="hljs-keyword">null</span>, <span class="hljs-keyword">true</span>)
    }
  } <span class="hljs-keyword">else</span> {
    <span class="hljs-comment">// 创建或者更新组件</span>
    patch(container._vnode || <span class="hljs-keyword">null</span>, vnode, container)
  }
  <span class="hljs-comment">// 缓存 vnode 节点，表示已经渲染</span>
  container._vnode = vnode
}
</code></pre>
<p data-nodeid="38619">这个渲染函数 render 的实现很简单，如果它的第一个参数 vnode 为空，则执行销毁组件的逻辑，否则执行创建或者更新组件的逻辑。</p>
<p data-nodeid="38620">接下来我们接着看一下上面渲染 vnode 的代码中涉及的 patch 函数的实现：</p>
<pre class="lang-java" data-nodeid="38621"><code data-language="java"><span class="hljs-keyword">const</span> patch = (n1, n2, container, anchor = <span class="hljs-keyword">null</span>, parentComponent = <span class="hljs-keyword">null</span>, parentSuspense = <span class="hljs-keyword">null</span>, isSVG = <span class="hljs-keyword">false</span>, optimized = <span class="hljs-keyword">false</span>) =&gt; {
  <span class="hljs-comment">// 如果存在新旧节点, 且新旧节点类型不同，则销毁旧节点</span>
  <span class="hljs-keyword">if</span> (n1 &amp;&amp; !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1)
    unmount(n1, parentComponent, parentSuspense, <span class="hljs-keyword">true</span>)
    n1 = <span class="hljs-keyword">null</span>
  }
  <span class="hljs-keyword">const</span> { type, shapeFlag } = <span class="hljs-function">n2
  <span class="hljs-title">switch</span> <span class="hljs-params">(type)</span> </span>{
    <span class="hljs-keyword">case</span> Text:
      <span class="hljs-comment">// 处理文本节点</span>
      <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">case</span> Comment:
      <span class="hljs-comment">// 处理注释节点</span>
      <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">case</span> Static:
      <span class="hljs-comment">// 处理静态节点</span>
      <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">case</span> Fragment:
      <span class="hljs-comment">// 处理 Fragment 元素</span>
      <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">default</span>:
      <span class="hljs-keyword">if</span> (shapeFlag &amp; <span class="hljs-number">1</span> <span class="hljs-comment">/* ELEMENT */</span>) {
        <span class="hljs-comment">// 处理普通 DOM 元素</span>
        processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      }
      <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (shapeFlag &amp; <span class="hljs-number">6</span> <span class="hljs-comment">/* COMPONENT */</span>) {
        <span class="hljs-comment">// 处理组件</span>
        processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      }
      <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (shapeFlag &amp; <span class="hljs-number">64</span> <span class="hljs-comment">/* TELEPORT */</span>) {
        <span class="hljs-comment">// 处理 TELEPORT</span>
      }
      <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (shapeFlag &amp; <span class="hljs-number">128</span> <span class="hljs-comment">/* SUSPENSE */</span>) {
        <span class="hljs-comment">// 处理 SUSPENSE</span>
      }
  }
}
</code></pre>
<p data-nodeid="38622">patch 本意是打补丁的意思，这个函数有两个功能，一个是根据 vnode 挂载 DOM，一个是根据新旧 vnode 更新 DOM。对于初次渲染，我们这里只分析创建过程，更新过程在后面的章节分析。</p>
<p data-nodeid="38623">在创建的过程中，patch 函数接受多个参数，这里我们目前只重点关注前三个：</p>
<ol data-nodeid="38624">
<li data-nodeid="38625">
<p data-nodeid="38626">第一个参数 <strong data-nodeid="38812">n1 表示旧的 vnode</strong>，当 n1 为 null 的时候，表示是一次挂载的过程；</p>
</li>
<li data-nodeid="38627">
<p data-nodeid="38628">第二个参数 <strong data-nodeid="38818">n2 表示新的 vnode 节点</strong>，后续会根据这个 vnode 类型执行不同的处理逻辑；</p>
</li>
<li data-nodeid="38629">
<p data-nodeid="38630">第三个参数 <strong data-nodeid="38824">container 表示 DOM 容器</strong>，也就是 vnode 渲染生成 DOM 后，会挂载到 container 下面。</p>
</li>
</ol>
<p data-nodeid="38631">对于渲染的节点，我们这里重点关注两种类型节点的渲染逻辑：对组件的处理和对普通 DOM 元素的处理。</p>
<p data-nodeid="38632"><strong data-nodeid="38830">先来看对组件的处理</strong>。由于初始化渲染的是 App 组件，它是一个组件 vnode，所以我们来看一下组件的处理逻辑是怎样的。首先是用来处理组件的 processComponent 函数的实现：</p>
<pre class="lang-java" data-nodeid="38633"><code data-language="java"><span class="hljs-keyword">const</span> processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) =&gt; {
  <span class="hljs-keyword">if</span> (n1 == <span class="hljs-keyword">null</span>) {
   <span class="hljs-comment">// 挂载组件</span>
   mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
  }
  <span class="hljs-keyword">else</span> {
    <span class="hljs-comment">// 更新组件</span>
    updateComponent(n1, n2, parentComponent, optimized)
  }
}
</code></pre>
<p data-nodeid="38634">该函数的逻辑很简单，如果 n1 为 null，则执行挂载组件的逻辑，否则执行更新组件的逻辑。</p>
<p data-nodeid="38635">我们接着来看挂载组件的 mountComponent 函数的实现：</p>
<pre class="lang-java" data-nodeid="38636"><code data-language="java"><span class="hljs-keyword">const</span> mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) =&gt; {
  <span class="hljs-comment">// 创建组件实例</span>
  <span class="hljs-keyword">const</span> instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense))
  <span class="hljs-comment">// 设置组件实例</span>
  setupComponent(instance)
  <span class="hljs-comment">// 设置并运行带副作用的渲染函数</span>
  setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized)
}
</code></pre>
<p data-nodeid="38637">可以看到，挂载组件函数 mountComponent 主要做三件事情：创建组件实例、设置组件实例、设置并运行带副作用的渲染函数。</p>
<p data-nodeid="38638">首先是创建组件实例，Vue.js 3.0 虽然不像 Vue.js 2.x 那样通过类的方式去实例化组件，但内部也通过对象的方式去创建了当前渲染的组件实例。</p>
<p data-nodeid="38639">其次设置组件实例，instance 保留了很多组件相关的数据，维护了组件的上下文，包括对 props、插槽，以及其他实例的属性的初始化处理。</p>
<p data-nodeid="38640">创建和设置组件实例这两个流程我们这里不展开讲，会在后面的章节详细分析。</p>
<p data-nodeid="38641">最后是运行带副作用的渲染函数 setupRenderEffect，我们重点来看一下这个函数的实现：</p>
<pre class="lang-java" data-nodeid="38642"><code data-language="java"><span class="hljs-keyword">const</span> setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) =&gt; {
  <span class="hljs-comment">// 创建响应式的副作用渲染函数</span>
  instance.update = effect(<span class="hljs-function">function <span class="hljs-title">componentEffect</span><span class="hljs-params">()</span> </span>{
    <span class="hljs-keyword">if</span> (!instance.isMounted) {
      <span class="hljs-comment">// 渲染组件生成子树 vnode</span>
      <span class="hljs-keyword">const</span> subTree = (instance.subTree = renderComponentRoot(instance))
      <span class="hljs-comment">// 把子树 vnode 挂载到 container 中</span>
      patch(<span class="hljs-keyword">null</span>, subTree, container, anchor, instance, parentSuspense, isSVG)
      <span class="hljs-comment">// 保留渲染生成的子树根 DOM 节点</span>
      initialVNode.el = subTree.el
      instance.isMounted = <span class="hljs-keyword">true</span>
    }
    <span class="hljs-keyword">else</span> {
      <span class="hljs-comment">// 更新组件</span>
    }
  }, prodEffectOptions)
}
</code></pre>
<p data-nodeid="38643">该函数利用响应式库的 effect 函数创建了一个副作用渲染函数 componentEffect （effect 的实现我们后面讲响应式章节会具体说）。<strong data-nodeid="38843">副作用</strong>，这里你可以简单地理解为，当组件的数据发生变化时，effect 函数包裹的内部渲染函数 componentEffect 会重新执行一遍，从而达到重新渲染组件的目的。</p>
<p data-nodeid="38644">渲染函数内部也会判断这是一次初始渲染还是组件更新。这里我们只分析初始渲染流程。</p>
<p data-nodeid="38645"><strong data-nodeid="38848">初始渲染主要做两件事情：渲染组件生成 subTree、把 subTree 挂载到 container 中。</strong></p>
<p data-nodeid="38646">首先，是渲染组件生成 subTree，它也是一个 vnode 对象。这里要注意别把 subTree 和 initialVNode 弄混了（其实在 Vue.js 3.0 中，根据命名我们已经能很好地区分它们了，而在 Vue.js 2.x 中它们分别命名为 _vnode 和 $vnode）。我来举个例子说明，在父组件 App 中里引入了 Hello 组件：</p>
<pre class="lang-js" data-nodeid="38647"><code data-language="js">&lt;template&gt;
  <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"app"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>This is an app.<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">hello</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">hello</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
&lt;/template&gt;
</code></pre>
<p data-nodeid="38648">在 Hello 组件中是 <code data-backticks="1" data-nodeid="38853">&lt;div&gt;</code> 标签包裹着一个 <code data-backticks="1" data-nodeid="38855">&lt;p&gt;</code> 标签：</p>
<pre class="lang-js" data-nodeid="38649"><code data-language="js">&lt;template&gt;
  <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"hello"</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>Hello, Vue 3.0!<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
&lt;/template&gt;
</code></pre>
<p data-nodeid="38650">在 App 组件中， <code data-backticks="1" data-nodeid="38858">&lt;hello&gt;</code> 节点渲染生成的 vnode ，对应的就是 Hello 组件的 initialVNode ，为了好记，你也可以把它称作“组件 vnode”。而 Hello 组件内部整个 DOM 节点对应的 vnode 就是执行 renderComponentRoot 渲染生成对应的 subTree，我们可以把它称作“子树 vnode”。</p>
<p data-nodeid="38651">我们知道每个组件都会有对应的 render 函数，即使你写 template，也会编译成 render 函数，而 renderComponentRoot 函数就是去执行 render 函数创建整个组件树内部的 vnode，把这个 vnode 再经过内部一层标准化，就得到了该函数的返回结果：子树 vnode。</p>
<p data-nodeid="38652">渲染生成子树 vnode 后，接下来就是继续调用 patch 函数把子树 vnode 挂载到 container 中了。</p>
<p data-nodeid="38653">那么我们又再次回到了 patch 函数，会继续对这个子树 vnode 类型进行判断，对于上述例子，App 组件的根节点是 <code data-backticks="1" data-nodeid="38863">&lt;div&gt;</code> 标签，那么对应的子树 vnode 也是一个普通元素 vnode，那么我们<strong data-nodeid="38868">接下来看对普通 DOM 元素的处理流程。</strong></p>
<p data-nodeid="38654">首先我们来看一下处理普通 DOM元素的 processElement 函数的实现：</p>
<pre class="lang-java" data-nodeid="38655"><code data-language="java"><span class="hljs-keyword">const</span> processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) =&gt; {
  isSVG = isSVG || n2.type === <span class="hljs-string">'svg'</span>
  <span class="hljs-keyword">if</span> (n1 == <span class="hljs-keyword">null</span>) {
    <span class="hljs-comment">//挂载元素节点</span>
    mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
  }
  <span class="hljs-keyword">else</span> {
    <span class="hljs-comment">//更新元素节点</span>
    patchElement(n1, n2, parentComponent, parentSuspense, isSVG, optimized)
  }
}
</code></pre>
<p data-nodeid="38656">该函数的逻辑很简单，如果 n1 为 null，走挂载元素节点的逻辑，否则走更新元素节点逻辑。</p>
<p data-nodeid="38657">我们接着来看挂载元素的 mountElement 函数的实现：</p>
<pre class="lang-java" data-nodeid="38658"><code data-language="java"><span class="hljs-keyword">const</span> mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) =&gt; {
  let el
  <span class="hljs-keyword">const</span> { type, props, shapeFlag } = vnode
  <span class="hljs-comment">// 创建 DOM 元素节点</span>
  el = vnode.el = hostCreateElement(vnode.type, isSVG, props &amp;&amp; props.is)
  <span class="hljs-keyword">if</span> (props) {
    <span class="hljs-comment">// 处理 props，比如 class、style、event 等属性</span>
    <span class="hljs-keyword">for</span> (<span class="hljs-keyword">const</span> key in props) {
      <span class="hljs-keyword">if</span> (!isReservedProp(key)) {
        hostPatchProp(el, key, <span class="hljs-keyword">null</span>, props[key], isSVG)
      }
    }
  }
  <span class="hljs-keyword">if</span> (shapeFlag &amp; <span class="hljs-number">8</span> <span class="hljs-comment">/* TEXT_CHILDREN */</span>) {
    <span class="hljs-comment">// 处理子节点是纯文本的情况</span>
    hostSetElementText(el, vnode.children)
  }
  <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (shapeFlag &amp; <span class="hljs-number">16</span> <span class="hljs-comment">/* ARRAY_CHILDREN */</span>) {
    <span class="hljs-comment">// 处理子节点是数组的情况</span>
    mountChildren(vnode.children, el, <span class="hljs-keyword">null</span>, parentComponent, parentSuspense, isSVG &amp;&amp; type !== <span class="hljs-string">'foreignObject'</span>, optimized || !!vnode.dynamicChildren)
  }
  <span class="hljs-comment">// 把创建的 DOM 元素节点挂载到 container 上</span>
  hostInsert(el, container, anchor)
}
</code></pre>
<p data-nodeid="38659">可以看到，挂载元素函数主要做四件事：创建 DOM 元素节点、处理 props、处理 children、挂载 DOM 元素到 container 上。</p>
<p data-nodeid="38660">首先是创建 DOM 元素节点，通过 hostCreateElement 方法创建，这是一个平台相关的方法，我们来看一下它在 Web 环境下的定义：</p>
<pre class="lang-java" data-nodeid="38661"><code data-language="java"><span class="hljs-function">function <span class="hljs-title">createElement</span><span class="hljs-params">(tag, isSVG, is)</span> </span>{
  isSVG ? document.createElementNS(svgNS, tag)
    : document.createElement(tag, is ? { is } : undefined)
}
</code></pre>
<p data-nodeid="38662">它调用了底层的 DOM API document.createElement 创建元素，所以本质上 Vue.js 强调不去操作 DOM ，只是希望用户不直接碰触 DOM，它并没有什么神奇的魔法，底层还是会操作 DOM。</p>
<p data-nodeid="38663">另外，如果是其他平台比如 Weex，hostCreateElement 方法就不再是操作 DOM ，而是平台相关的 API 了，这些平台相关的方法是在创建渲染器阶段作为参数传入的。</p>
<p data-nodeid="38664">创建完 DOM 节点后，接下来要做的是判断如果有 props 的话，给这个 DOM 节点添加相关的 class、style、event 等属性，并做相关的处理，这些逻辑都是在 hostPatchProp 函数内部做的，这里就不展开讲了。</p>
<p data-nodeid="38665">接下来是对子节点的处理，我们知道 DOM 是一棵树，vnode 同样也是一棵树，并且它和 DOM 结构是一一映射的。</p>
<p data-nodeid="38666">如果子节点是纯文本，则执行 hostSetElementText 方法，它在 Web 环境下通过设置 DOM 元素的 textContent 属性设置文本：</p>
<pre class="lang-java" data-nodeid="38667"><code data-language="java"><span class="hljs-function">function <span class="hljs-title">setElementText</span><span class="hljs-params">(el, text)</span> </span>{
  el.textContent = text
}
</code></pre>
<p data-nodeid="38668">如果子节点是数组，则执行 mountChildren 方法：</p>
<pre class="lang-java" data-nodeid="38669"><code data-language="java"><span class="hljs-keyword">const</span> mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, optimized, start = <span class="hljs-number">0</span>) =&gt; {
  <span class="hljs-keyword">for</span> (let i = start; i &lt; children.length; i++) {
    <span class="hljs-comment">// 预处理 child</span>
    <span class="hljs-keyword">const</span> child = (children[i] = optimized
      ? cloneIfMounted(children[i])
      : normalizeVNode(children[i]))
    <span class="hljs-comment">// 递归 patch 挂载 child</span>
    patch(<span class="hljs-keyword">null</span>, child, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
  }
}
</code></pre>
<p data-nodeid="38670">子节点的挂载逻辑同样很简单，遍历 children 获取到每一个 child，然后递归执行 patch 方法挂载每一个 child 。注意，这里有对 child 做预处理的情况（后面编译优化的章节会详细分析）。</p>
<p data-nodeid="38671">可以看到，mountChildren 函数的第二个参数是 container，而我们调用 mountChildren 方法传入的第二个参数是在 mountElement 时创建的 DOM 节点，这就很好地建立了父子关系。</p>
<p data-nodeid="38672">另外，通过递归 patch 这种深度优先遍历树的方式，我们就可以构造完整的 DOM 树，完成组件的渲染。</p>
<p data-nodeid="38673">处理完所有子节点后，最后通过 hostInsert 方法把创建的 DOM 元素节点挂载到 container 上，它在 Web 环境下这样定义：</p>
<pre class="lang-java" data-nodeid="38674"><code data-language="java"><span class="hljs-function">function <span class="hljs-title">insert</span><span class="hljs-params">(child, parent, anchor)</span> </span>{
  <span class="hljs-keyword">if</span> (anchor) {
    parent.insertBefore(child, anchor)
  }
  <span class="hljs-keyword">else</span> {
    parent.appendChild(child)
  }
}
</code></pre>
<p data-nodeid="38675">这里会做一个 if 判断，如果有参考元素 anchor，就执行 parent.insertBefore ，否则执行 parent.appendChild 来把 child 添加到 parent 下，完成节点的挂载。</p>
<p data-nodeid="38676">因为 insert 的执行是在处理子节点后，所以挂载的顺序是先子节点，后父节点，最终挂载到最外层的容器上。</p>
<blockquote data-nodeid="38677">
<p data-nodeid="38678"><strong data-nodeid="38891">知识延伸：嵌套组件</strong><br>
细心的你可能会发现，在 mountChildren 的时候递归执行的是 patch 函数，而不是 mountElement 函数，这是因为子节点可能有其他类型的 vnode，比如组件 vnode。</p>
<p data-nodeid="38679">在真实开发场景中，嵌套组件场景是再正常不过的了，前面我们举的 App 和 Hello 组件的例子就是嵌套组件的场景。组件 vnode 主要维护着组件的定义对象，组件上的各种 props，而组件本身是一个抽象节点，它自身的渲染其实是通过执行组件定义的 render 函数渲染生成的子树 vnode 来完成，然后再 patch 。通过这种递归的方式，无论组件的嵌套层级多深，都可以完成整个组件树的渲染。</p>
</blockquote>
<h3 data-nodeid="38680">总结</h3>
<p data-nodeid="41875" class="">OK，到这里我们这一节的学习也要结束啦，这节课我们主要分析了组件的渲染流程，从入口开始，一层层分析组件渲染。</p>





<p data-nodeid="38682">你可能发现了，文中提到的很多技术点我会放在后面的章节去讲，这样做是为了让我们不跑题，重点放在理解组件的渲染流程上。下节课我将会带你具体分析一下组件的更新过程。</p>
<p data-nodeid="38683">这里，我用一张图来带你更加直观地感受下整个组件渲染流程：</p>
<p data-nodeid="38684"><img src="https://s0.lgstatic.com/i/image/M00/2E/0A/CgqCHl8EPLKAF8u5AAJHdNl56bM640.png" alt="122.png" data-nodeid="38899"></p>
<p data-nodeid="38685">最后，给你留一道思考题目，我们平时开发页面就是把页面拆成一个个组件，那么组件的拆分粒度是越细越好吗？为什么呢？欢迎你在留言区与我分享。</p>
<blockquote data-nodeid="38686">
<p data-nodeid="38687" class=""><strong data-nodeid="38914">本节课的相关代码在源代码中的位置如下：</strong><br>
packages/runtime-dom/src/index.ts<br>
packages/runtime-core/src/apiCreateApp.ts<br>
packages/runtime-core/src/vnode.ts<br>
packages/runtime-core/src/renderer.ts<br>
packages/runtime-dom/src/nodeOps.ts</p>
</blockquote>

---

### 精选评论


