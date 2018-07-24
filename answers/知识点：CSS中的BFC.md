 # CSS中重要的BFC
 
前言：

块格式化上下文（Block Formatting Context，BFC） 

[MDN上的解释](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)：
是Web页面的可视化CSS渲染的一部分，是布局过程中生成块级盒子的区域，也是浮动元素与其他元素的交互限定区域。

它是一个独立的渲染区域，只有Block-level box参与，它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

注意：一个BFC的范围包含创建该上下文元素的所有子元素，但不包括创建了新BFC的子元素的内部元素。
这从另一方角度说明，一个元素不能同时存在于两个BFC中。因为如果一个元素能够同时处于两个BFC中，
那么就意味着这个元素能与两个BFC中的元素发生作用，就违反了BFC的隔离作用。


BFC布局规则：
1. 内部的Box会在垂直方向，一个接一个地放置。
1. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
1. 每个元素的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
1. BFC的区域不会与float box重叠。
1. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
1. 计算BFC的高度时，浮动元素也参与计算

## Box: CSS布局的基本单位
Box 是 CSS 布局的对象和基本单位，直观点来说，就是一个页面是由很多个 Box 组成的。
元素的类型和 display 属性，决定了这个 Box 的类型。
不同类型的 Box，会参与不同的 Formatting Context（一个决定如何渲染文档的容器），
因此Box内的元素会以不同的方式渲染。让我们看看有哪些盒子：
 
1. block-level box:display 
属性为 block, list-item, table 的元素，会生成 block-level box。
并且参与 block fomatting context；

1. inline-level box:display 
属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box。
并且参与 inline formatting context；

1. run-in box: css3 中才有
 
## Formatting context
Formatting context 是 W3C CSS2.1 规范中的一个概念。
它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。
最常见的 Formatting context 有 Block fomatting context (简称BFC)和 Inline formatting context (简称IFC)。
 
CSS2.1 中只有 BFC 和 IFC, CSS3 中还增加了 GFC 和 FFC。

## 哪些元素会生成BFC?
1. 根元素，即HTML标签
1. 浮动元素：float值为left、right
1. overflow值不为 visible，为 auto、scroll、hidden
1. display值为 inline-block、table-cell、table-caption、table、inline-table、flex、inline-flex、grid、inline-grid
1. 定位元素：position值为 absolute、fixed

注意 display:table也可以生成BFC的原因在于Table会默认生成一个匿名的table-cell，是这个匿名的table-cell生成了BFC。

```
//MSDN版本
1. 根元素或包含根元素的元素
1. 浮动元素（元素的 float 不是 none）
1. 绝对定位元素（元素的 position 为 absolute 或 fixed）
1. 行内块元素（元素的 display 为 inline-block）
1. 表格单元格（元素的 display为 table-cell，HTML表格单元格默认为该值）
1. 表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）
1. 匿名表格单元格元素（元素的 display为 table、table-row、 table-row-group、table-header-group、
   table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）
1. overflow 值不为 visible 的块元素
1. display 值为 flow-root 的元素
1. contain 值为 layout、content或 strict 的元素
1. 弹性元素（display为 flex 或 inline-flex元素的直接子元素）
1. 网格元素（display为 grid 或 inline-grid 元素的直接子元素）
1. 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
1. column-span 为 all 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。
```

## 三种文档流的定位方案
 
 常规流(Normal flow)
 ```
 在常规流中，盒一个接着一个排列;
 在块级格式化上下文里面， 它们竖着排列；
 在行内格式化上下文里面， 它们横着排列;
 当position为static或relative，并且float为none时会触发常规流；
 对于静态定位(static positioning)，position: static，盒的位置是常规流布局里的位置；
 对于相对定位(relative positioning)，position: relative，盒偏移位置由top、bottom、left、right属性定义。即使有偏移，仍然保留原有的位置，其它常规流不能占用这个位置。
 ```
 浮动(Floats)
 ```
 左浮动元素尽量靠左、靠上，右浮动同理
 这导致常规流环绕在它的周边，除非设置 clear 属性
 浮动元素不会影响块级元素的布局
 但浮动元素会影响行内元素的布局，让其围绕在自己周围，撑大父级元素，从而间接影响块级元素布局
 最高点不会超过当前行的最高点、它前面的浮动元素的最高点
 不超过它的包含块，除非元素本身已经比包含块更宽
 行内元素出现在左浮动元素的右边和右浮动元素的左边，左浮动元素的左边和右浮动元素的右边是不会摆放浮动元素的
 ```
 绝对定位(Absolute positioning)
 ```
 绝对定位方案，盒从常规流中被移除，不影响常规流的布局；
 它的定位相对于它的包含块，相关CSS属性：top、bottom、left、right；
 如果元素的属性position为absolute或fixed，它是绝对定位元素；
 对于position: absolute，元素定位将相对于上级元素中最近的一个relative、fixed、absolute，如果没有则相对于body；
 ```