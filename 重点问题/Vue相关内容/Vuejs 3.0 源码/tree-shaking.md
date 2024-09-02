# tree-shaking

tree-shaking 的原理是：利用 ES6 的模块语法，让 webpack 打包工具在打包时，只把用到的代码提取出来，从而减少项目体积。

## 具体原理

依赖 ES2015 模块语法的静态结构（即 import 和 export），通过编译阶段的静态分析，找到没有引入的模块并打上标记

一个 math 模块定义了 2 个方法 square(x) 和 cube(x) ：

```js
export function square(x) {
  return x * x
}
export function cube(x) {
  return x * x * x
}
```

我们在这个模块外面只引入了 cube 方法：

```js
import { cube } from './math.js'
// do something with cube

最终 math 模块会被 webpack 打包生成如下代码：
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
  'use strict';
  /* unused harmony export square */
  /* harmony export (immutable) */ __webpack_exports__['a'] = cube;
  function square(x) {
    return x * x;
  }
  function cube(x) {
    return x * x * x;
  }
});
```

可以看到，未被引入的 square 模块被标记了， 然后压缩阶段会利用例如 uglify-js、terser 等压缩工具真正地删除这些没有用到的代码。
也就是说，利用 tree-shaking 技术，如果你在项目中没有引入 Transition、KeepAlive 等组件，那么它们对应的代码就不会打包，这样也就间接达到了减少项目引入的 Vue.js 包体积的目的

## 数据劫持优化

Vue.js 区别于 React 的一大特色是它的数据是响应式的，这个特性从 Vue.js 1.x 版本就一直伴随着

DOM 是数据的一种映射，数据发生变化后可以自动更新 DOM，用户只需要专注于数据的修改，没有其余的心智负担。

Vue.js 内部，想实现这个功能是要付出一定代价的，那就是必须劫持数据的访问和更新。其实这点很好理解，当数据改变后，

为了自动更新 DOM，那么就必须劫持数据的更新，也就是说当数据发生改变后能自动执行一些代码去更新 DOM，

那么问题来了，Vue.js 怎么知道更新哪一片 DOM 呢？因为在渲染 DOM 的时候访问了数据，我们可以对它进行访问劫持，这样就在内部建立了依赖关系，也就知道数据对应的 DOM 是什么了。

以上只是大体的思路，具体实现要比这更复杂，内部还依赖了一个 watcher 的数据结构做依赖管理

Vue.js 1.x 和 Vue.js 2.x 内部都是通过 Object.defineProperty 这个 API 去劫持数据的 getter 和 setter，具体是这样的：

```js
Object.defineProperty(data, 'a',{
  get(){
    // track
  },
  set(){
    // trigger
  }
})
```

但这个 API 有一些缺陷，它必须预先知道要拦截的 key 是什么，所以它并不能检测对象属性的添加和删除。尽管 Vue.js 为了解决这个问题提供了 $set 和 $delete 实例方法，但是对于用户来说，还是增加了一定的心智负担。

另外 Object.defineProperty 的方式还有一个问题，举个例子，比如这个嵌套层级比较深的对象：

```js
export default {
  data: {
    a: {
      b: {
        c: {
          d: 1
        }
      }
    }
  }
}
```

由于 Vue.js 无法判断你在运行时到底会访问到哪个属性，所以对于这样一个嵌套层级较深的对象，如果要劫持它内部深层次的对象变化，就需要递归遍历这个对象，执行 Object.defineProperty 把每一层对象数据都变成响应式的。毫无疑问，如果我们定义的响应式数据过于复杂，这就会有相当大的性能负担。

为了解决上述 2 个问题，Vue.js 3.0 使用了 Proxy API 做数据劫持，它的内部是这样的：

```js
observed = new Proxy(data, {
  get() {
    // track
  },
  set() {
    // trigger
  }
})
```

由于它劫持的是整个对象，那么自然对于对象的属性的增加和删除都能检测到。

但要注意的是，Proxy API 并不能监听到内部深层次的对象变化，因此 Vue.js 3.0 的处理方式是在 getter 中去递归响应式，这样的好处是真正访问到的内部对象才会变成响应式，而不是无脑递归，这样无疑也在很大程度上提升了性能

## 编译优化

通过数据劫持和依赖收集，Vue.js 2.x 的数据更新并触发重新渲染的粒度是组件级

Vue.js 3.0 做到了，它通过编译阶段对静态模板的分析，编译生成了 Block tree。Block tree 是一个将模版基于动态节点指令切割的嵌套区块，每个区块内部的节点结构是固定的，而且每个区块只需要以一个 Array 来追踪自身包含的动态节点。借助 Block tree，Vue.js 将 vnode 更新性能由与模版整体大小相关提升为与动态内容的数量相关，这是一个非常大的性能突破

