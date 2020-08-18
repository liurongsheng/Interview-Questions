# 灵活的语言
1. 避免过多的全局变量，使用对象收编变量

这种方式会创建全局变量
```
function checkName () {
    console.log('验证邮箱')
}
function checkEmail () {
    console.log('验证姓名')
}
```

对象类在使用 new 关键字创建新的对象时，无法继承方法，只能复制一份代码再改造，不是真正意义上类的创建方式
```
let CheckObject = {
    checkName: function () {
        console.log('验证邮箱')
    },
    checkEmail: function () {
        console.log('验证姓名')
    }
}
调用方式：通过点语法来使用 CheckObject.checkName()
```

通过点语法来使用也可以通过点语法来创建的
```
let CheckObject = function () { }
CheckObject.checkName = function () {
    console.log('验证邮箱')
},
CheckObject.checkEmail = function () {
    console.log('验证姓名')
}
```

设置成一个常见的类，所有的方法放在函数内部，通过 this 来定义，每次通过 new 关键字创建新对象的时候，新创建的
对象都会对类的 this 上的属性进行复制，这些新创建的对象都会有自己的一套方法，会造成消耗
```
let CheckObject = function () {
    this.checkName = function () {
         console.log('验证邮箱')
    },
    this.checkEmail = function () {
         console.log('验证姓名')
    },
}
let check = new CheckObject()
check.checkEmail()
```

使用 prototype ，这样创建对象实例的时候，依赖 prototype 原型一次寻找，而找到的方法都是同一个，他们都是绑定在 CheckObject 对象类的原型上
```
let CheckObject = function () { }
CheckObject.prototype.checkName = function () {
     console.log('验证邮箱')
}
CheckObject.prototype.checkEmail = function () {
     console.log('验证姓名')
}
let check = new CheckObject()
check.checkName()
```

为了避免 prototype 写很多遍可以改个形式，但是这两种方式一定不能混用，如果混用后者为对象的原型赋值时会覆盖之前的赋值方法
```
let CheckObject = function () { }
CheckObject.prototype = {
    checkName: function () {
        console.log('验证邮箱')
    },
    checkEmail: function () {
        console.log('验证姓名')
    }
}
let check = new CheckObject()
check.checkName()
check.checkEmail()
```

发现这样的调用对象 check 需要书写多次，可以在声明的每一个方法末尾将当前对象放回，就可以实现链式调用
```
let CheckObject = function () { }
CheckObject.prototype = {
    checkName: function () {
        console.log('验证邮箱')
        return this
    },
    checkEmail: function () {
        console.log('验证姓名')
        return this
    }
}
let check = new CheckObject()
check.checkName().checkEmail()
```

对原生对象的拓展 （Function、Array、Object）
```
Function.prototype.checkName = function () {
   console.log('验证邮箱')
}
这样会污染原生对象 Function，可以抽象出一个统一添加方法的功能方法
Function.prototype.addMethod = function (name, fn) {
   this[name] = fn
   return this // 同样支持链式添加方法
}
let methods = function () {}
methods.addMethod('checkName', function(){
    console.log('验证邮箱')
    return this // 支持链式添加方法
}).addMethod('checkEmail', function(){
    console.log('验证姓名')
    return this // 支持链式添加方法
})
methods.checkName().checkEmail()
```

换一种使用方式，类式调用方式
```
Function.prototype.addMethod = function (name, fn) {
   this.prototype[name] = fn
   return this // 同样支持链式添加方法
}
let Methods = function () {}
Methods.addMethod('checkName', function(){
    console.log('验证姓名')
    return this // 支持链式添加方法
}).addMethod('checkEmail', function(){
    console.log('验证邮箱')
    return this // 支持链式添加方法
})
let m = new Methods()
m.checkName().checkEmail()
```

### 练习
需要实现链式调用
```
let CheckObject = function () {
    return {
        checkName: function () {
            console.log('验证姓名')
        },
        checkEmail: function () {
            console.log('验证邮箱')
        },
    }
}
let check = CheckObject()
check.checkName()
```
在声明的函数中 return this
```
let CheckObject = function () {
    return {
        checkName: function () {
            console.log('验证姓名')
            return this
        },
        checkEmail: function () {
            console.log('验证邮箱')
            return this
        },
    }
}
let check = CheckObject()
check.checkName().checkEmail()
```




