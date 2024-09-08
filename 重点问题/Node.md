# Node

node 是 js 在后端的一个运行时环境

## 什么是express koa

express，koa 是基于 node 的框架，能够快速构建 web 应用

## 交互方式

- 短链接 ajax  axios

    后端不能主动发消息
    前端不断轮询，性能较差
    前端发请求，后端才能回请求

- 长链接 websocket

    全双工，前端和后端建立连接后，一直维持连接
    需要有心跳机制维护链接

## 导出模块方式

- es6 export import
- node module.exports
- require 把业务 框架模块化 最大化复用
