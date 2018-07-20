# 从输入URL到页面加载发生了什么

## 总体来说分为以下几个过程:

1. DNS解析

1. TCP连接

1. 发送HTTP请求

1. 服务器处理请求并返回HTTP报文

1. 浏览器解析渲染页面

1. 连接结束

---

从浏览器接收url到开启网络请求线程
多进程的浏览器
多线程的浏览器内核
解析URL
网络请求都是单独的线程


开启网络线程到发出一个完整的http请求
DNS查询得到IP
tcp/ip请求
五层因特网协议栈


从服务器接收到请求到对应后台接收到请求
负载均衡
后台的处理


后台和前台的http交互
http报文结构
场景头部
cookie以及优化
gzip压缩
长连接与短连接
http2.0
http缓存
https
跨域，web安全，


单独拎出来的缓存问题，http的缓存
强缓存与弱缓存
缓存头部简述
头部的区别


解析页面流程
流程简述
HTML解析，构建DOM
生成CSS规则
构建渲染树
渲染
简单层与复合层
Chrome中的调试
资源外链的下载
loaded和domcontentloaded


CSS的可视化格式模型
包含块（Containing Block）
控制框（Controlling Box）
BFC（Block Formatting Context）
IFC（Inline Formatting Context）
其它


JS引擎解析过程
JS的解释阶段
JS的预处理阶段
JS的执行阶段
回收机制
