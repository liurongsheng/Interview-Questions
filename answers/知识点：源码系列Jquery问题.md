# 知识点：Jquery系列问题

1. 核心架构
2. 事件委托怎么实现
3. 插件机制是什么
4. 兼容性(近两三年已经不那么重要了)


## 插件机制

[知识点：原型链类](/answers/知识点：原型链类.md)

init.prototype = jQuery.fn;

通过 $.fn 拓展插件，实现如下：

```
<p>jquert test 1</p>
<p>jquert test 2</p>
<p>jquert test 3</p>

<div id = "div1">
    <p>jquert test in div</p>
</div>

<script type="type/javascript" src="./jquery-3.2.1.js"></script>
<script type="type/javascript">
    // 插件拓展
    $.fn.getNodeName = function(){
        alert(this[0].nodeName)
    }
</script>
<script type="type/javascript">
    // 验证
    var $p = $('p')
    $p.getNodeName()
    var $div1 = $('div1')
    $div1.getNodeName()
</script>
```
### 插件拓展到什么地方去了？

插件拓展到了 $.fn ，并不是拓展到了构造函数的原型

### 为什么要使用 $ 来进行插件拓展

原因：我们的构造函数并没有开放出来，我们开放出来的只有 $ ,只把这个 $ 函数开放到全局环境中，所以只能通过 $ 函数进行拓展。

好处：我们可以统一规范构造函数的拓展方法