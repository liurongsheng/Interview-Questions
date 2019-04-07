# 利用ES6的Proxy数据劫持实现双向绑定

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>利用ES6的Proxy数据劫持实现双向绑定</title>
  <script>
    const obj = {}

    const newObj = new Proxy(obj, {
      get: function (target, key, receiver) {
        return Reflect.get(target, key, receiver)
      },
      set: function (target, key, value, receiver) {
        if (key === 'value') {
          document.querySelector('#value').innerHTML = value
          document.querySelector('input').value = value
        }
        return Reflect.set(target, key, value, receiver)
      }
    })

    function onKeyUp(event) {
      newObj.value = event.target.value
    }
  </script>
</head>

<body>
  <p>
    输入的值是：<span id="value"></span>
  </p>
  <input type="text" onkeyup="onKeyUp(event)">
</body>
</html>
```
