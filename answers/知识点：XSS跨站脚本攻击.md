# XSS跨站脚本攻击

Cross Site Scripting(跨站脚本攻击)，它与SQL注入攻击类似，SQL注入攻击中以SQL语句作为用户输入，从而达到查询/修改/删除数据的目的，
而在xss攻击中，攻击者在网站上注入恶意的客户端代码，通过恶意脚本对客户端网页进行篡改，从而在用户浏览网页时，
对用户浏览器进行控制或者获取用户隐私数据的一种攻击方式。

攻击者对客户端网页注入的恶意脚本一般包括 JavaScript，有时也会包含 HTML 和 Flash。
有很多种方式进行 XSS 攻击，但它们的共同点为：
将一些隐私数据像 cookie、session 发送给攻击者，将受害者重定向到一个由攻击者控制的网站，在受害者的机器上进行一些恶意操作。

xss攻击可以分成两种类型：

    存储型XSS(持久型)
    反射型XSS(非持久型)
    基于DOM的XSS
---

* 存储型XSS

数据库中存有的存在XSS攻击的数据，返回给客户端。若数据未经过任何转义。被浏览器渲染。就可能导致XSS攻击；

比较常见的一个场景是攻击者在社区或论坛上写下一篇包含恶意 JavaScript 代码的文章或评论，文章或评论发表后，
所有访问该文章或评论的用户，都会在他们的浏览器中执行这段恶意的 JavaScript 代码。

举一个示例。

先准备一个输入页面：
```
<input type="text" id="input">
<button id="btn">Submit</button>   

<script>
    const input = document.getElementById('input');
    const btn = document.getElementById('btn');

    let val;
     
    input.addEventListener('change', (e) => {
        val = e.target.value;
    }, false);

    btn.addEventListener('click', (e) => {
        fetch('http://localhost:8001/save', {
            method: 'POST',
            body: val
        });
    }, false);
</script>
```     
启动一个 Node 服务监听 save 请求。为了简化，用一个变量来保存用户的输入：
```
const http = require('http');

let userInput = '';

function handleReequest(req, res) {
    const method = req.method;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    if (method === 'POST' && req.url === '/save') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            if (body) {
                userInput = body;
            }
            res.end();
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
        res.write(userInput);
        res.end();
    }
}

const server = new http.Server();
server.listen(8001, '127.0.0.1');

server.on('request', handleReequest);
```

当用户点击提交按钮将输入信息提交到服务端时，服务端通过 userInput 变量保存了输入内容。
当用户通过 http://localhost:8001/${id} 访问时，服务端会返回与 id 对应的内容(本示例简化了处理)。
如果用户输入了恶意脚本内容，则其他用户访问该内容时，恶意脚本就会在浏览器端执行：


* 反射型XSS

将用户输入的存在XSS攻击的数据，发送给后台，后台并未对数据进行存储，也未经过任何过滤，直接返回给客户端。被浏览器渲染。就可能导致XSS攻击；

这种攻击方式往往需要攻击者诱使用户点击一个恶意链接，或者提交一个表单，或者进入一个恶意网站时，注入脚本进入被攻击者的网站。

恶意链接的地址指向了 localhost:8001/?q=111&p=222。然后，我再启一个简单的 Node 服务处理恶意链接的请求：
```
const http = require('http');
function handleReequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
    res.write('<script>alert("反射型 XSS 攻击")</script>');
    res.end();
}

const server = new http.Server();
server.listen(8001, '127.0.0.1');
server.on('request', handleReequest);
```
当用户点击恶意链接时，页面跳转到攻击者预先准备的页面，会发现在攻击者的页面执行了 js 脚本：

这样就产生了反射型 XSS 攻击。攻击者可以注入任意的恶意脚本进行攻击，可能注入恶作剧脚本，或者注入能获取用户隐私数据(如cookie)的脚本，这取决于攻击者的目的。


* 基于DOM的XSS

基于 DOM 的 XSS 攻击是指通过恶意脚本修改页面的 DOM 结构，是纯粹发生在客户端的攻击。
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
    

### XSS攻击的预防

#### HttpOnly 防止劫取 Cookie
HttpOnly 最早由微软提出，至今已经成为一个标准。浏览器将禁止页面的Javascript 访问带有 HttpOnly 属性的Cookie。

上文有说到，攻击者可以通过注入恶意脚本获取用户的 Cookie 信息。
通常 Cookie 中都包含了用户的登录凭证信息，攻击者在获取到 Cookie 之后，则可以发起 Cookie 劫持攻击。
所以，严格来说，HttpOnly 并非阻止 XSS 攻击，而是能阻止 XSS 攻击后的 Cookie 劫持攻击。


#### 从输入到输出都需要过滤、转义。

##### 输入检查

不要相信用户的任何输入。 对于用户的任何输入要进行检查、过滤和转义。建立可信任的字符和 HTML 标签白名单，对于不在白名单之列的字符或者标签进行过滤或编码。

在 XSS 防御中，输入检查一般是检查用户输入的数据中是否包含 <，> 等特殊字符，如果存在，则对特殊字符进行过滤或编码，这种方式也称为 XSS Filter。

而在一些前端框架中，都会有一份 decodingMap， 用于对用户输入所包含的特殊字符或标签进行编码或过滤，如 <，>，script，防止 XSS 攻击：
```
// vuejs 中的 decodingMap
// 在 vuejs 中，如果输入带 script 标签的内容，会直接过滤掉
const decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
}
```
##### 输出检查

用户的输入会存在问题，服务端的输出也会存在问题。一般来说，除富文本的输出外，在变量输出到 HTML 页面时，可以使用编码或转义的方式来防御 XSS 攻击。
例如利用 sanitize-html 对输出内容进行有规则的过滤之后再输出到页面中。


过滤关键字
[推荐使用](http://jsxss.com/zh/index.html)

### 如何挖掘

Fuzzing（模糊测试）是挖掘漏洞最常用的手段之一，不止是XSS，应该可以说Fuzzing可以用于大部分类型的漏洞挖掘。通俗可以把这种方式理解为不断尝试的过程。

<img src="/img/xss挖掘流程图.jpg" title="xss挖掘流程图" />

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
