# Socket.IO

socket.io 服务器和浏览器双向通信

构建 Socket.io 模块

1. 创建连接：const socket = io(地址)
2. 发送消息：socket.emit(消息type类型, 消息内容, 接收到消息的回调函数)
3. 监听消息：socket.on(事件type类型, 接收到消息的回调函数)

- 用 on 监听事件，接收服务器消息
- 用 emit 发送消息到服务器

步骤：
1. 安装依赖包 yarn add socket.io-client
2. 创建 src/socket/index.js 模块文件，编写模块内容
3. main.js 导入，导入后就会执行
4. vue.config.js 配置网络代理
5. 启动后台 server

socket/index.js
```
import io from 'socket.io-client'
const socket = io()

socket.on('connect', () => {
    console.log('服务器建立连接...')
})

export default socket
```

main.js
```
import '@/socket.index'
```


