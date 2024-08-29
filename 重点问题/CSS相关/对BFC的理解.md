# 对 BFC 的理解

## BFC 是什么

BFC(Block Formatting Context)，即块级格式化上下文，它是页面中的一块渲染区域，并且有一套自己的渲染规则

BFC 的目的是形成一个相对于外界完全独立的空间，让内部的子元素不会影响到外部的元素

- 内部的盒子会在垂直方向上一个接一个的放置
- 对于同一个BFC的两个相邻的盒子的margin会发生重叠，与方向无关
- 每个元素的左外边距与包含的左边界相接触，从左到右，即使浮动元素也是如此
- BFC的区域不会与float的元素重叠
- 计算BFC的高度时，浮动元素也会参与计算
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然

## 触发条件

- 根元素，即 HTML 元素
- 浮动元素: float值为left 或 right
- overflow 不为 visible，为 auto、scroll、hidden
- display 为 inline-block、table-cell、table-caption、flex、inline-flex、grid、inline-grid
- position 为 absolute 或 fixed

## 应用场景

- 防止 margin 重叠 (塌陷)