# 知识点：HTTP协议类

## HTTP协议的主要特点
1. 简单快速
每个资源URI都是固定的，统一资源符是固定的，要访问某个资源只要访问对应的URI就可以

2. 灵活
每个HTTP协议的头部有不同的数据类型，通过一个HTTP协议可以完成不同数据类型的数据传输，所以HTTP是比较灵活的

3. 无连接(必答)
连接一次就会断掉，不会保持连接

4. 无状态(必答)
客户端和服务端可以认为是两种身份，客户端需要向服务端请求资源，HTTP协议帮你建立连接，帮你中间传输，任务完成断开连接。
下一次客服端再次连接，服务端是无法判断第二次客户端连接身份的。服务端不会记住状态的。

只有通过其他的手段比如session的方式，本质不是HTTP协议实现的

## HTTP报文的组成部分
HTTP报文包含两个部分：请求报文和响应报文
请求报文
 - 请求行
   - HTTP方法
   - 页面地址
   - http协议以及版本
 - 请求头
   - key-value值形式，告诉服务需要什么内容，要注意什么类型
 - 空行
   - 告诉服务器下一部分不是请求头部分，要用请求头来解析
 - 请求体 
 
响应报文
 - 状态行
 - 响应头
 - 空行
 - 响应体

## HTTP方法
- GET 获取资源
- POST 传输资源
- PUT 更新资源
- DELETE 删除资源
- HEAD 获取报文首部

## POST和GET的区别
- GET在浏览器回退时是无害的，而POST会再次提交请求(重点)
- GET产生的url地址可以被收藏，而POST不可以
- GET请求会被浏览器自动缓存，而POST不会，除非手动设置(重点)
- GET请求只能进行url编码，而POST支持多种编码方式
- GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留(重点)
- GET请求在url中传送的参数是有长度限制的(一般2kb，不同浏览器不同大小)，而POST没有限制(重点)
- 对参数的数据类型，GET只接受ASCII字符，而POST没有限制
- GET比POST更不安全，因为参数直接暴露在url上，所以不能用来传输敏感信息
- GET参数通过url传递，POST放在Request body中(重点)

## HTTP状态码
- 1xx:指示信息 - 表示请求已被接收，继续处理
- 2xx:成功 - 表示请求已被成功接收
- 3xx:重定向 - 要完成请求必须进行更进一步的操作
- 4xx:客户端错误 - 请求有语法错误或请求无法实现
- 5xx:服务端错误 - 服务端未能实现合法的请求

- 200 OK 客户端请求成功
- 206 Partial COntent 客户发送了一个带有Range头的GET请求，服务器完成了它，请求一个很大的视频文件或者音频文件时会出现这种
- 301 Moved Permanently 所请求的页面已经转移至新的url  永久重定向
- 302 Found 所请求的页面已经临时转移至新的url          临时重定向
- 304 Not Modified 客户端有缓存的文档并发出了一个条件性的请求，服务器告诉客户，原来缓冲的文档还可以继续使用

- 400 Bad Request 客户端请求有语法错误，不能被服务器所理解
- 401 Unauthorized 请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用
- 403 Forbidden 对被请求页面的访问被禁止
- 404 Not Found 请求资源不存在

- 500 Internal Server Error 服务器发生不可预期的错误
- 503 Server Unavaiable 请求未完成，服务器临时过载或当机，一段时间后可能恢复

## 什么是持久连接

HTTP协议采用“请求-应答”模式，当使用普通模式，即非 Keep-Alive 模式时，每个请求/应答，客户端和服务器都要新建一个连接，
完成之后立即断开连接，这个就是HTTP协议面向无连接的特点

当使用 Keep-Alive 模式(又称持久连接/连接重用)，Keep-Alive 功能是客户端到服务端的连接持续有效，当出现对服务器的后继请求时
Keep-Alive 功能避免了建立或者重新建立连接

HTTP协议支持持久连接，**HTTP协议版本1.1的时候才支持持久连接，1.0版本不支持持久连接**

## 什么是管线化
在使用持久连接的情况下，某个连接上的消息的传递类似于
请求1 =》 响应1 =》 请求2 =》 响应2 =》 请求3 =》 响应3

管线化的传输某个连接上的消息变成类似这样
请求1 =》 请求2 =》 请求3 =》 响应1 =》 响应2 =》 响应3
请求打包发送，响应打包发回(原理重点)

管线化机制通过持久连接完成，仅HTTP/1.1支持此技术(重点)
只有GET和HEAD请求可以进行管线化，而POST则有所限制(重点)
初次创建连接时不应启动管线化机制，因为对方(服务器)不一定支持HTTP/1.1版本的协议(重点)
管线化不会影响响应到来的顺序，响应返回的顺序并未改变

HTTP/1.1要求服务器端支持管线化，但并不要求服务端也对响应进行管线化处理，只是要求对管线化的请求不失败即可
开启管线化很可能并不会带来很大幅度的性能提升，而且很多服务器端和代理程序对管线化的支持并不好，
现代浏览器chrome和火狐默认并未开启管线化支持