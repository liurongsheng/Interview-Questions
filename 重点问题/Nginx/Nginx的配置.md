# Nginx 的配置

`start nginx`
`nginx -s reload`

## 静态资源 WEB 服务

## 代理服务

正向代理 和 反向代理的区别在于代理的对象不一样

- 正向代理代理的对象是客户端

```s
客户端1                      服务端1
客户端2  <--> 代理 || <-->   服务端2
客户端3                      服务端3
```

- 反向代理代理的对象是服务端

```s
客户端1                       服务端1
客户端2  <--> || 代理  <-->   服务端2
客户端3                       服务端3
```

## 负载均衡调度器

- proxy_pass // 设置全部转发
- upstream // 配置服务器列表

upstream.conf

```s
upstream server_list {
    ip_hash;  # 使用客户端IP地址的哈希值来决定请求分发的目标

    server localhost:8080 weight=2;  # 第一个服务器权重较高;
    server localhost:8081 backup; # 当其他服务器都不可用时，才使用备份服务器
}

server {
    listen       80;
    server_name  localhost;

    # 路由所有请求到后端服务器
    location / {
        echo 'hello nginx';
        proxy_pass http://server_list;
        index index.html index.htm;
    }
}
```

### upstream 的常用配置

- weight: 权重值，数值越大，被选中的概率越高
- max_fails: 在一定时间内允许的最大失败次数，默认为 1
- fail_timeout: 在发生 max_fails 次失败之后，暂停该服务器的时间长度
- down: 标记服务器为不可用，不会被选中
- backup: 当其他服务器都不可用时，才使用备份服务器
