# CSS3

## CSS3 有哪些新增的属性？

[参考手册](http://caibaojian.com/css3/)

### 增强的选择器

- 伪类：如 :hover, :active, :focus 等
- 伪元素：如 ::before, ::after，允许在元素前后插入内容
- 增加了更多的状态选择器，如 :nth-child(n) 和 :not(selector)

### 盒子模型改进

box-sizing：定义了元素的尺寸计算方式，可以是 content-box 或 border-box

### 边框效果和背景

三个边框属性

- border-radius 创建圆角边框
- border-image 使用图片来绘制边框
- box-shadow 为元素添加阴影

背景

- background-size 用来调整背景图片的大小，主要用于设定图片本身
- background-clip 用于确定背景画区，从什么地方开始
- background-origin 用于确定背景的位置，通常与 background-position 联合使用
- background-break 来控制背景怎样在这些不同的盒子中显示

### 文本效果

- word-wrap 控制长单词或 URL 的换行
- text-overflow 当文本溢出时显示省略号或其他字符
- text-shadow 文本添加阴影
- text-decoration 支持对文字的更深层次的渲染

### 动画和过渡

- transition 可以在当元素从一种样式变换为另一种样式时为元素添加效果
- transform 用来向元素应用各种 2D 和 3D 转换，允许我们对元素进行旋转、缩放、移动或倾斜等操作
- animation 让 CSS 拥有了可以制作动画的功能

### 渐变效果

- linear-gradient() 线性渐变
- radial-gradient() 径向渐变

### 多列布局

- column-count, column-gap, column-rule：用于创建多列布局

### 响应式设计支持

- media queries 根据不同的屏幕尺寸应用不同的样式规则

### 网络字体

- @font-face 允许网站使用任何字体，只要字体文件可用

### 其他新属性

- rgba 定义带有透明度的颜色
- hanging-punctuation 控制标点字符的位置
