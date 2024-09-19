# 对 BFC、IFC 的理解

视觉格式化模型

## BFC 是什么

BFC(Block Formatting Context)，即块级格式化上下文，它是页面中的一块渲染区域，并且有一套自己的渲染规则

BFC 的目的是形成一个相对于外界完全独立的空间，让内部的子元素不会影响到外部的元素

- 内部的盒子会在垂直方向上一个接一个的放置
- 对于同一个 BFC 的两个相邻的盒子的 margin 会发生重叠，与方向无关
- 每个元素的左外边距与包含的左边界相接触，从左到右，即使浮动元素也是如此
- BFC 的区域不会与 float 的元素重叠
- 计算 BFC 的高度时，浮动元素也会参与计算
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然

### 触发条件

- 根元素，即 HTML 元素
- 浮动元素: float 值为 left 或 right
- overflow 不为 visible，为 auto、scroll、hidden
- display 为 inline-block、table-cell、table-caption、flex、inline-flex、grid、inline-grid
- position 为 absolute 或 fixed

### 应用场景

- 防止 margin 重叠 (塌陷)

同一个 BFC 的两个相邻的盒子的 margin 会发生重叠，可以在一个盒子的外层包裹一层容器，并触发这个容器生成一个
BFC，这样两个相邻的盒子就不会发生重叠了

- 清除浮动

在 BFC 计算高度时，浮动元素也会参与计算，所以清除浮动就可以通过给一个 BFC 设置高度来解决

## IFC 是什么

IFC(Inline Formatting Context)，即行内格式化上下文，比 BFC 要复杂不少

- 空白折叠两个行级盒子或者行块盒连续排布的时候将多个连续的空白字符（如换行、空格、Tab 等）折叠成一个空格
- 文字的基线

打包后会压缩，就会没有间隙导致，生产环境和开发环境不一致

## 注意事项

inline-block 受 BFC、IFC 影响，很难控制

IFC 中的空白折叠
