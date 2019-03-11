# hybrid

## hybrid 是什么，为何要用 hybrid
hybrid 即“混合”，即前端和客户端的混合开发
需要前端开发人员和客户端开发人员配合完成
某些环节也可能涉及 server 端

hybrid 的存在价值：
- 可以快速迭代更新，无需审核。很关键(纯js代码，无需app审核)手机app类可以有系统权限，需要审核
- 体验流畅(和Native的体验基本一致)
- 减少开发和沟通成本，多端复用一套代码

webview：
是app中的一个组件(app可以有webview，也可以没有)
用于加载h页面，即一个小型的浏览器内核

file协议：打开本地文件，快，几十毫秒
http(s)协议：网络加载，慢，基本在1秒以上

使用Native：体验要求极致，变化不频繁(首页)
使用hybrid：体验要求高，变化频繁(新闻详情页)
使用h5：体验无要求，不常用(反馈页)

具体实现：
前端做好静态页面，将文件交给客户端
客户端拿到前端静态页面，以文件形式存储在app中
客户端在一个webview中
使用file协议加载静态页面

## hybrid 如何更新上线

要替换每个客户端的静态文件
只能客户端来做
客户端去 server下载最新的静态文件

1. 分版本，有版本号，如201903031010
2. 将静态文件压缩成zip包，上传到服务器
3. 客户端每次启动，都去服务器端检查版本号
4. 如果服务端版本号大于客户端，就去下载最新的 zip 包
5. 下载完之后解压包，然后将现有文件覆盖

要点1：服务端的版本和zip包维护
要点2：更新zip包之前，先对比版本号
要点3：zip下载解压和覆盖

## hybrid 和 H5 有何别
优点：
体验更好，跟Native体验基本一致
可快速迭代，无需app审核

缺点：
开发成本高，联调、测试、查Bug都比较麻烦
运维成本高，上一次线，有一套流程

适用场景
hybrid：产品的稳定功能，体验要求高，迭代频繁，适合产品型
h5：单次的运营活动，如红包或不常用功能，适合运营型

## JS 如何与客户端通信

微信 JS-SDK https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115

基本形式
- JS 访问客户端能力，传递参数和回调函数
- 客户端通过回调函数返回内容
```
webview[html、js、css] -- 参数 + callback --》 客户端能力

客户端能力 -- 执行 callback --》 webview[html、js、css]
```
不适用ajax，因为第一是因为跨域，第二是速度相当客户端来说慢，客户端还可以提前获取
客户端提前获取新闻内容，然后 JS 通讯拿到内容，再渲染

## schema 协议简介和使用
schema 协议定义前端和客户端通信的一个标准

weixin://dl/scan     扫一扫
weixin://dl/feedback 反馈
weixin://dl/moments  朋友圈
weixin://dl/settings    设置
weixin://dl/notifications    消息通知设置
weixin://dl/chat     聊天设置
```
var iframe = document.createElement('iframe');
iframe.style.display = 'none';
iframe.src = 'weixin://dl/scan'; // iframe 访问 schema
var body = document.body || document.getElementsByTagName('body')[0];
body.appendChild(iframe);
setTimeout(function(){
  body.removeChild(iframe);  // 销毁 iframe
  iframe = null;
});

window['_winxin_scan_callback'] = function(result){  // 这里是回调的函数
  alert(result)
}
...
iframe.src = 'weixin://dl/scan?k1=v1&k2=v2&callback=_weixin_sacn_callback';  // 这里使用带参数和回调的地址  
...
```

完整代码
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Schema协议</title>
</head>
<body>
<button id="btn">扫一扫</button>
<script type="text/javascript">
    window['invoke_scan_callback_'] = function(result){
        alert(result);
    }
    function invokeScan(){
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'weixin://dl/scan?k1=v1&k2=v2&callback=_invoke_scan_callback_';
        var body = document.body;
        body.appendChild(iframe);
        setTimeout(function(){
            bodu.removeChild(iframe);
            iframe = null;
        })
    }
    document.getElementById('btn').addEventListener('click', function(){
        invokeScan()
    })
</script>
</body>
</html>
```
## schema 使用的封装
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Schema协议</title>
</head>
<body>
<button id="btn1">扫一扫</button>
<button id="btn2">分享</button>

<script src="./invoke.js"></script>
<script type="text/javascript">
    // 封装版本
    document.getElementById('btn1').addEventListener('click', function(){
        window.invoke.scan({}, function(){});
    })
    document.getElementById('btn2').addEventListener('click', function(){
        window.invoke.share({
            title: 'xxx',
            content: 'yyy'
        }, function(result){
            if(result.errno === 0){
                alert('分享成功')
            }else{
                alert(result.message)
            }
        });
    })
</script>
<script type="text/javascript">
    // 单次实现
    window['invoke_scan_callback_'] = function(result){
        alert(result);
    }
    function invokeScan(){
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'weixin://dl/scan?k1=v1&k2=v2&callback=_invoke_scan_callback_';
        var body = document.body;
        body.appendChild(iframe);
        setTimeout(function(){
            bodu.removeChild(iframe);
            iframe = null;
        })
    }
    document.getElementById('btn1').addEventListener('click', function(){
        invokeScan()
    })
</script>
</body>
</html>
```
// invoke.js
```
(function(){
    function _invoke(action, data, callback){
        // 拼装 schema 协议
        var schema = 'myapp://utils/' + action;
        
        // 拼接参数
        schema += '?a=a';
        var key;
        for(key in data){
          if(data.hasOwnProperty(key)){
            schema += '&' + key + '=' + data[key]
          }
        }
        
        // 处理 callback
        var callbackName = '';
        if(typeof callback === 'string'){
          callbackName = callback;
        }else{
          callbackName = action + Date.now();
          window['callbackName'] = callback;
        }
        
        schema += '&callback=' + callbackName; 
        
        // 触发
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = schema;
        var body = document.body;
        body.appendChild(iframe);
        setTimeout(function(){
            bodu.removeChild(iframe);
            iframe = null;
        })
    }

    window.invoke = {
        share: function(data, callback){
            _invoke('share', data, callback)
        },
        login: function(data, callback){
            _invoke('login', data, callback)
        },
        scan: function(data, callback){
            _invoke('scan', data, callback)
        },
    }
})(window)
```


重要步骤：
```
window.invoke.share({title: 'xxx', content:'xxx'}, function(result){
  if(result){
    alert('分享成功');
  }else{
    alert(result.message)
  }
})

function _invoke(action, data, callback){
  var schema = 'myapp://utils';
  schema += '/' + action
  
  schema += '?a=a';
  var key;
  for(key in data){
    if(data.hasOwnProperty(key)){
      schema += '&' + key + '=' + data[key]
    }
  }
  
  var callbackName = '';
  if(typeof callback === 'string'){
    callbackName = callback;
  }else{
    callbackName = action + Date.now();
    window['callbackName'] = callback;
  }
  
  schema += '&callback=' + callbackName; 
}

function invokeShare(data, callback){  // 分享
  _invoke('share', data, callback)
}
function invokeLogin(data, callback){  // 登录
  _invoke('login', data, callback)
}
function invokeScan(data, callback){  // 打开扫一扫
  _invoke('scan', data, callback)
}

window.invoke = {  // 暴露给全局
  share: invokeShare,
  login: invokeLogin,
  scan: invokeScan
}
```

## 内置上线
内置上线的好处：速度快，安全

将以上封装的代码打包，叫做 invoke.js，内置到客户端
客户端每次启动 webview，都默认执行 invoke.js
本地加载，免去网络加载的时间，速度更快
本地加载，没有网络请求，外部看不到 schema 协议，会更安全
