# XSS跨站脚本攻击

Cross Site Scripting(跨站脚本攻击)，它与SQL注入攻击类似，SQL注入攻击中以SQL语句作为用户输入，从而达到查询/修改/删除数据的目的，
而在xss攻击中，通过插入恶意脚本，实现对用户游览器的控制。

xss攻击可以分成两种类型：

    存储型XSS
    反射型XSS
    DOM-XSS
---

* 存储型XSS

数据库中存有的存在XSS攻击的数据，返回给客户端。若数据未经过任何转义。被浏览器渲染。就可能导致XSS攻击；


* 反射型XSS

将用户输入的存在XSS攻击的数据，发送给后台，后台并未对数据进行存储，也未经过任何过滤，直接返回给客户端。被浏览器渲染。就可能导致XSS攻击；

* DOM-XSS

纯粹发生在客户端的XSS攻击
```html
Select your language:
<select>
    <script> 
        document.write("<OPTION value=1>"+
            document.location.href.substring(document.location.href.indexOf("default=")+8)+"</OPTION>");  
        document.write("<OPTION value=2>English</OPTION>");    
    </script>
</select> 
```
用户点击了如下连接：
    http://www.some.site/page.html?default=<script>alert(document.cookie)</script>
后台对URL参数未做任何过滤处理，返回给客户端，前端直接从url上获取参数。

打开网址的浏览器是低版本浏览器，常见ie8以下

满足以上三者，就会导致URL上的js代码执行:alert(document.cookie)，但是攻击者可以利用这个，做你无法想象的事情。
在现代浏览器中，已经做了xss过滤，一旦检测到xss,会提示报错如下:

    The XSS Auditor refused to execute a script in 
    'file:///C:/Users/summerhxji/Desktop/taobao/xss.html?default=%3Cscript%3Ealert(document.cookie)%3C/script%3E' 
    because its source code was found within the request. The auditor was enabled as the server did not send an 'X-XSS-Protection' header.
    (anonymous) @ xss.html?default=<script>alert(document.cookie)</script>
    

### XSS预防

从输入到输出都需要过滤、转义。

过滤关键字
[推荐使用](http://jsxss.com/zh/index.html)

### 如何挖掘

Fuzzing（模糊测试）是挖掘漏洞最常用的手段之一，不止是XSS，应该可以说Fuzzing可以用于大部分类型的漏洞挖掘。通俗可以把这种方式理解为不断尝试的过程。

<img src="img/xss挖掘流程图.jpg" title="xss挖掘流程图" />

比较关键的几个点在于：

* 检测输入点
* 潜在注入点检测
* 生成Payload
* Payload攻击验证

检测输入点其实就是寻找数据入口，比如说GET/POST数据，或者Header头部里的UA/Referer/Cookie，再或者URL路径等等，这些都可以成为输入入口，
转换为比较形象点的说法，比如看到一个搜索框，你可能会在搜索框里提交关键词进行搜索，那么这里可能就发生了一个GET或者POST请求，这里其实就是一个输入点。

其次是潜在注入点检测，潜在注入的检测是判断输入点是否可以成功把数据注入到页面内容，对于提交数据内容但是不输出到页面的输入点是没有必要进行Fuzzing的，
因为即使可以提交攻击代码，也不会产生XSS；

在潜在注入点的检测通常使用的是一个随机字符串，比如随机6位数字，再判断这6位数字是否返回输出在页面，
以此来进行判断。为什么不直接使用Payload进行判断呢？因为Payload里包含了攻击代码，通常很多应用都有防火墙或者过滤机制，
Payload中的关键词会被拦截导致提交失败或者不会返回输出在页面，但这种情况不代表不能XSS，因为有可能只是Payload不够好，
没有绕过过滤或者其他安全机制，所以采用无害的随机数字字符就可以避免这种情况产生，先验证可注入，再调整Payload去绕过过滤；
而随机的目的在于不希望固定字符成为XSS防御黑名单里的关键词。

常见情况：

登录和注册是大部分网站的必备功能，而不知道大家有没有注意到一个细节，当你在未登录状态下访问一些需要需要登录态的页面，
比如个人中心，他会自动跳转到登录或者注册页面要求你登录，然后这个时候的登录URL其实会带有一个跳转URL，这是为了方便你
登录后直接跳转到你原来访问的页面，是一个比较好的用户体验的设计。

在使用这样的功能的时候，我直接手上尝试，直接把跳转的URL修改为我的博客链接，然后再登录，发现可以直接跳转到我的博客，
于是我再尝试了javascript%3Aalert(0)，发现JS代码可以直接执行并弹了个框。这个功能的设计其实原来是进行站内的跳转，
但是由于功能设计上的缺陷，没有对跳转的URL进行判断或者判断有问题，于是可以导致直接跳转到其他网站或者产生XSS。
当然，不止是登录，注册功能也存在同样问题。
