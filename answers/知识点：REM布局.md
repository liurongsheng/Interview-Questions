# REM布局

### em

首先，在介绍 rem 之前，我们先看看 em。
    
    em是相对长度单位。相对于当前对象内文本的字体尺寸。
    如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。(引自CSS2.0手册)
    
通俗的讲就是： 1em，就是这个元素上的 font-size 的值，如果元素本身没有设置 font-size ，
就按照他的父级的 font-size 计算（其实本身的font-size继承了父级的font-size），我们看看代码：

```html
<style type="text/css">
    .box{font-size:20px; border:1px solid red; overflow:hidden;}
    .box>.con{width:10em; height:10em; background:#000; color:#fff;}
    .box>.con_1{float:left;}
    .box>.con_2{float:right; font-size:30px;}
</style>
<div class="box">
    <div class="con con_1">con1:我没有font-size</div>
    <div class="con con_2">con2:我有font-size</div>
</div>
```
在 con1 中，因为本身没有 font-size ，所以 10em=10(父级的font-size:20px)=200px* ，宽高为 200px 。
在 con2 中，因为本身有 font-size ，所以 10em=10(父级的font-size:30px)=300px* ，宽高为 300px 。
如果用em布局会存在一个问题，进行任何元素设置，都需要知道他父元素的大小，
在我们多次使用时，就会带来无法预知的错误风险

## rem

现在来看看rem

在W3C官网上是这样描述 rem 的—— “font size of the root element (根元素的字体大小)” ，

也就是说，rem 是相对于根元素<html>的，还是用上面的例子：
```html
<style type="text/css">
    .box{font-size:20px; border:1px solid red; overflow:hidden;}
    .box>.con{width:10rem; height:10rem; background:#000; color:#fff;}
    .box>.con_1{float:left;}
    .box>.con_2{float:right; font-size:30px;}
</style>
<div class="box">
    <div class="con con_1">con1:我没有font-size</div>
    <div class="con con_2">con2:我有font-size</div>
</div>
```
因为网页<html>的默认字体大小是 16px，所以 1rem=16px ，10rem=160px ，所以 con1 跟 con2 的宽高为 160px


