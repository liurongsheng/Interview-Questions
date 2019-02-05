# 知识点：px em rem

## px 

一个 px 相当于1个像素

## em

em 是相对长度单位，既然是相对的，必然有一个参考物。一般浏览器默认为16px

1. em 相对参考物为父元素的 font-size
2. em 具有继承的特点
3. 当没有设置 ont-size 时，浏览器会有一个默认的 em 设置。一般浏览器默认的 em 为 16px

缺陷：因为依赖父元素的尺寸，会带来布局上的不确定性 

## rem

em 是相对长度单位，相对参考物为 根元素html，相对参考固定不变，所以比较好计算

当没有设置 font-size 时，浏览器会有一个默认的 rem 为 16px 这点和 em 是一致的

缺陷：不是所有浏览器都支持 rem 属性 IE8 不支持，IE9 部分支持

兼容写法
```
.rem p {
    font-size: 16px;
    font-size: 1rem; // 如果不支持 rem，则使用 px
}
```
```
html {
    font-size：62.5%
}
```
font-size：62.5%  1rem = 10px   10/16*100%  
font-size: 100%   1rem = 16px   16/16*100%

把传统的 px 项目转为 rem项目，只需要设置 根html 为 font-size：62.5%，把样式中 px 的值全部除 10 转为 rem