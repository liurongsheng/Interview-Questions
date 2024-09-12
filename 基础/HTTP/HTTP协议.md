# HTTP协议

- 版本
  http1.0 rfc-1945
  http1.1 rfc-2616  持久连接
  https   rfc-2818  安全，ssl
  http2.0 rfc-7540  强制加密、头压缩、多路复用、服务端推送

- 消息结构
  header——头：信息——32K
    content-type
    cache-control
    set-cookie
    cookies

  body——体：数据——2G

- 请求方法（method）
  get   获取数据，请求数据夹在url里
    aaa.com/query/a?a=12&b=44
    数据量小

  post  发送数据，请求数据夹在body
    数据量大    2G

  head  服务器仅仅返回头就行

  put   发送文件

  delete  删除

  patch   修改数据

  options 发送参数

  ...自定义

  RESTful风格

- body 常用格式
  urlencoded        a=12&b=55&c=99      适合少量数据
  multipart                             适合上传文件
  application/json  json
  application/octet-stream              二进制数据
    下载/上传二进制文件
