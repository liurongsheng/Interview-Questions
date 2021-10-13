# vue

## 初识Vue：
```
1. 想让Vue工作，就必须创建一个Vue实例，且要传入一个配置对象；
2. root容器里的代码依然符合html规范，只不过混入了一些特殊的Vue语法；
3. root容器里的代码被称为【Vue模板】；
4. Vue实例和容器是一一对应的；
5. 真实开发中只有一个Vue实例，并且会配合着组件一起使用；
6. {{xxx}}中的xxx要写js表达式，且xxx可以自动读取到data中的所有属性；
7. 一旦data中的数据发生改变，那么页面中用到该数据的地方也会自动更新；
```

### 注意区分：js表达式 和 js代码(语句)
```
1.表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方：
(1). a
(2). a+b
(3). demo(1)
(4). x === y ? 'a' : 'b'

2.js代码(语句)
(1). if(){}
(2). for(){}
```

## 模板语法 			
Vue模板语法有2大类：
```
1. 插值语法：
功能：用于解析标签体内容。
写法：{{xxx}}，xxx是js表达式，且可以直接读取到data中的所有属性。

2. 指令语法：
功能：用于解析标签（包括：标签属性、标签体内容、绑定事件.....）。
举例：v-bind:href="xxx" 或  简写为 :href="xxx"，xxx同样要写js表达式，且可以直接读取到data中的所有属性。

备注：Vue中有很多的指令，且形式都是：v-????。
```

## 数据绑定
Vue中有2种数据绑定的方式：
```
1. 单向绑定(v-bind)：数据只能从data流向页面。
2. 双向绑定(v-model)：数据不仅能从data流向页面，还可以从页面流向data。

备注：
    1 .双向绑定一般都应用在表单类元素上（如：input、select等）
    2 .v-model:value 可以简写为 v-model，因为v-model默认收集的就是value值。
```

## el 和 data 的两种写法
el 与 data 的2种写法
```
1. el有2种写法
(1).new Vue时候配置el属性。
(2).先创建Vue实例，随后再通过vm.$mount('#root')指定el的值。

2. data有2种写法
(1).对象式
(2).函数式
如何选择：目前哪种写法都可以，以后学习到组件时，data必须使用函数式，否则会报错。

3. 一个重要的原则：
由Vue管理的函数，一定不要写箭头函数，一旦写了箭头函数，this就不再是Vue实例了，而是window。

对象式
/* data:{
    name:'测试'
} */

//data的第二种写法：函数式
data:function(){
    console.log('@@@',this) //此处的this是Vue实例对象
    return{
        name:'测试'
    }
}


data(){
    console.log('@@@',this) //此处的this是Vue实例对象
    return{
        name:'测试'
    }
}

// 错误例子，不能使用箭头函数
data:() => {
    console.log('@@@',this) //此处的this是Vue实例对象
    return{
        name:'测试'
    }
}
```

## MVVM 模型
Vue的设计受到了 MVVM 的启发。
```
MVVM模型
1. M：模型(Model) ：data中的数据
2. V：视图(View) ：模板代码
3. VM：视图模型(ViewModel)：Vue实例，因此在文档中经常会使用 vm(ViewModel的缩写)这个变量名表示 Vue 实例

观察发现：
  1. data中所有的属性，最后都出现在了 vm 身上。
  2. vm身上所有的属性 及 Vue 原型上所有属性，在 Vue 模板中都可以直接使用。
```

## 数据代理
Object.defineProperty() 可以控制属性枚举、修改、修改、get()、set()
```
let number = 18
let person = {
    name:'张三',
    sex:'男',
}

Object.defineProperty(person,'age',{
    // value:18,
    // enumerable:true, //控制属性是否可以枚举，默认值是false
    // writable:true, //控制属性是否可以被修改，默认值是false
    // configurable:true //控制属性是否可以被删除，默认值是false

    //当有人读取person的age属性时，get函数(getter)就会被调用，且返回值就是age的值
    // invoke property getter
    // 映射 属性 getter 就是get函数的整体简称
    
    get(){
        console.log('有人读取age属性了')
        return number
    },
    // 省略写法
    // get:function(){ 
    // }

    //当有人修改person的age属性时，set函数(setter)就会被调用，且会收到修改的具体值
    set(value){
        console.log('有人修改了age属性，且值是',value)
        number = value
    }
})
```

数据代理：通过一个对象代理对另一个对象中属性的操作（读/写）
```
<script type="text/javascript" >
    let obj = {x:100}
    let obj2 = {y:200}

    Object.defineProperty(obj2,'x',{
        get(){
            return obj.x
        },
        set(value){
            obj.x = value
        }
    })
</script>
```

Vue中的数据代理
```
1.Vue中的数据代理：
    通过vm对象来代理data对象中属性的操作（读/写），验证 getter 和 setter
         
2.Vue中数据代理的好处：
    更加方便的操作data中的数据

3.基本原理：
    通过Object.defineProperty()把data对象中所有属性添加到vm上。
    为每一个添加到vm上的属性，都指定一个getter/setter。
    在getter/setter内部去操作（读/写）data中对应的属性。
    
<script type="text/javascript">
// 验证 getter 只要修改 data 中的数据，就可以验证
// 验证 setter
    let data = {
        name:'测试',
        address:'测试地址'
    }
    const vm = new Vue({
        el:'#root',
        data
    })
    
    vm._data === options.data === data
</script>
```

## 事件处理
### 事件的基本使用：
```
1. 使用v-on:xxx 或 @xxx 绑定事件，其中xxx是事件名；
2. 事件的回调需要配置在methods对象中，最终会在vm上；
3. methods中配置的函数，不要用箭头函数！否则this就不是vm了；
4. methods中配置的函数，都是被Vue所管理的函数，this的指向是vm 或 组件实例对象；
5. @click="demo" 和 @click="demo($event)" 效果一致，但后者可以传参；
```

@wheel 鼠标滚轮触发
@scroll 滚动条触发

### Vue中的事件修饰符

// 阻止事件冒泡
<button @click.stop="showInfo">点我提示信息</button>

// 修饰符可以连续写，阻止默认事件和事件冒泡
<button @click.prevent.stop="showInfo">点我提示信息</button>

```
1. prevent：阻止默认事件（常用）；
2. stop：阻止事件冒泡（常用）；
3. once：事件只触发一次（常用）；
4. capture：使用事件的捕获模式；事件分为捕获和冒泡两个阶段
5. self：只有event.target是当前操作的元素时才触发事件；
6. passive：事件的默认行为立即执行，无需等待事件回调执行完毕；比如鼠标滚轮滚动的时候处理，优先响应，移动端用的比较多

使用事件的捕获模式，正常是先2后1，捕获模式后先1后2
<div class="box1" @click.capture="showMsg(1)">
    div1
    <div class="box2" @click="showMsg(2)">
        div2
    </div>
</div>

只有event.target是当前操作的元素时才触发事件；
<div class="demo1" @click.self="showInfo">
    <button @click="showInfo">点我提示信息</button>
</div>
```

### 键盘事件
```
1. Vue中常用的按键别名(9个)：
回车 => enter
删除 => delete (捕获“删除”和“退格”键)
退出 => esc
空格 => space
换行 => tab (特殊，必须配合keydown去使用)
上 => up
下 => down
左 => left
右 => right

<input type="text" placeholder="按下回车提示输入" @keydown.enter="showInfo">

2. Vue未提供别名的按键，可以使用按键原始的key值去绑定，但注意要转为kebab-case（短横线命名）

大小写切换 @keyup.caps-lock

3. 系统修饰键（用法特殊）：ctrl、alt、shift、meta(win键)
(1).配合keyup使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。
(2).配合keydown使用：正常触发事件。

@keydown.ctrl.a 只有按住ctrl下再按住a才触发

4. 也可以使用keyCode去指定具体的按键（不推荐）
@keyup.13 这种特性已经从Web的标准中删除了，因为不同键盘键码不统一

5. Vue.config.keyCodes.自定义键名 = 键码，可以去定制按键别名 也不推荐
```

## 计算属性
Vue 重新解析模板中遇到插值语法里面写方法，一定会被重新调用

计算属性：
```
1. 定义：要用的属性不存在，要通过已有属性计算得来。
2. 原理：底层借助了Objcet.defineproperty方法提供的getter和setter。
3. get函数什么时候执行？
(1).初次读取时会执行一次。
(2).当依赖的数据发生改变时会被再次调用。
4. 优势：与methods实现相比，内部有缓存机制（复用），效率更高，调试方便。
5. 备注：
  1.计算属性最终会出现在vm上，直接读取使用即可。
  2.如果计算属性要被修改，那必须写set函数去响应修改，且set中要引起计算时依赖的数据发生改变。
  
<div id="root">
    全名：<span>{{fullName}}</span>
</div>

const vm = new Vue({
    el:'#root',
    data:{
        firstName:'张',
        lastName:'三',
    },
    computed:{
        //完整写法，一般情况只是用来展示
        fullName:{
            //get有什么作用？当有人读取fullName时，get就会被调用，且返回值就作为fullName的值
            //get什么时候调用？1.初次读取fullName时。2.所依赖的数据发生变化时。
            get(){
                // console.log(this) //此处的this是vm
                return this.firstName + '-' + this.lastName
            },
            //set什么时候调用? 当fullName被修改时。
            set(value){
                const arr = value.split('-')
                this.firstName = arr[0]
                this.lastName = arr[1]
            }
        }
        //简写，调用的时候注意不是函数的形式。只考虑读不考虑写的时候才考虑简写 
        fullName(){
            console.log('get被调用了')
            return this.firstName + '-' + this.lastName
        }
}
})
```
## 监视属性
绑定事件的时候：@xxx="yyy" yyy 可以写一些简单的语句

<button @click="isHot = !isHot">切换天气</button>

监视属性watch：
```
1.当被监视的属性变化时, 回调函数自动调用, 进行相关操作
2.监视的属性必须存在，才能进行监视！！支持计算属性的监视
3.监视的两种写法：
(1).new Vue时传入watch配置
(2).通过vm.$watch监视

const vm = new Vue({
    el:'#root',
    data:{
        isHot:true,
    },
    computed:{
        info(){
            return this.isHot ? '炎热' : '凉爽'
        }
    },
    /* watch:{
        isHot:{
            immediate:true, //初始化时让handler调用一下
            //handler什么时候调用？当isHot发生改变时。
            handler(newValue,oldValue){
                console.log('isHot被修改了',newValue,oldValue)
            }
        }
    } */
})

vm.$watch('isHot',{
    immediate:true, //初始化时让handler调用一下
    //handler什么时候调用？当isHot发生改变时。
    handler(newValue,oldValue){
        console.log('isHot被修改了',newValue,oldValue)
    }
})
```
### 深度监视

当有异步调用的时候(比如延时1秒返回)，计算属性无法满足需求，需要使用监视属性

深度监视：
```
(1).Vue中的watch默认不监测对象内部值的改变（一层）。
(2).配置deep:true可以监测对象内部值改变（多层）。
备注：
(1).Vue自身可以监测对象内部值的改变，但Vue提供的watch默认不可以！
(2).使用watch时根据数据的具体结构，决定是否采用深度监视。

watch:{
    //监视多级结构中某个属性的变化
    'numbers.a':{
        handler(){
            console.log('a被改变了')
        }
    }
    //监视多级结构中所有属性的变化
    numbers:{
        deep:true,
        handler(){
            console.log('numbers改变了')
        }
    }
}
```
深度检测简写
```
watch:{
    //正常写法
    isHot:{
        // immediate:true, //初始化时让handler调用一下
        // deep:true,//深度监视
        handler(newValue,oldValue){
            console.log('isHot被修改了',newValue,oldValue)
        }
    },
    //简写
    isHot(newValue,oldValue){
        console.log('isHot被修改了',newValue,oldValue,this)
    }
}

//正常写法
vm.$watch('isHot',{
    immediate:true, //初始化时让handler调用一下
    deep:true,//深度监视
    handler(newValue,oldValue){
        console.log('isHot被修改了',newValue,oldValue)
    }
})
//简写
vm.$watch('isHot', function(newValue,oldValue){
    console.log('isHot被修改了',newValue,oldValue)
})
```

## computed 和 watch 之间的区别
```
1. computed能完成的功能，watch都可以完成。
2. watch能完成的功能，computed不一定能完成，例如：watch可以进行异步操作。

两个重要的小原则：
1. 所被Vue管理的函数，最好写成普通函数，这样 this 的指向才是 vm 或 组件实例对象。
2. 所有不被Vue所管理的函数（定时器的回调函数、ajax的回调函数等、Promise的回调函数），最好写成箭头函数，
    这样this的指向才是vm 或 组件实例对象。
```

## 绑定样式

1. class样式
 ```
写法:class="xxx" xxx可以是字符串、对象、数组。
    字符串写法适用于：类名不确定，要动态获取。
    对象写法适用于：要绑定多个样式，个数不确定，名字也不确定。
    数组写法适用于：要绑定多个样式，个数确定，名字也确定，但不确定用不用。
```
2. style样式
```
:style="{fontSize: xxx}"其中xxx是动态值。
:style="[a,b]"其中a、b是样式对象。
```

```
<div id="root">
    <!-- 绑定class样式--字符串写法，适用于：样式的类名不确定，需要动态指定 -->
    <div class="basic" :class="mood" @click="changeMood">{{name}}</div> <br/><br/>

    <!-- 绑定class样式--数组写法，适用于：要绑定的样式个数不确定、名字也不确定 -->
    <div class="basic" :class="classArr">{{name}}</div> <br/><br/>

    <!-- 绑定class样式--对象写法，适用于：要绑定的样式个数确定、名字也确定，但要动态决定用不用 -->
    <div class="basic" :class="classObj">{{name}}</div> <br/><br/>

    <!-- 绑定style样式--对象写法 -->
    <div class="basic" :style="styleObj">{{name}}</div> <br/><br/>
    <!-- 绑定style样式--数组写法 -->
    <div class="basic" :style="styleArr">{{name}}</div>
</div>


const vm = new Vue({
    el:'#root',
    data:{
        mood:'normal',
        classArr:['atguigu1','atguigu2','atguigu3'],
        classObj:{
            atguigu1:false,
            atguigu2:false,
        },
        styleObj:{
            fontSize: '40px',
            color:'red',
        },
        styleArr:[
            {
                fontSize: '40px',
                color:'blue',
            },
            {
                backgroundColor:'gray'
            }
        ]
    },
})
```

## 条件渲染
```
1. v-if
    写法：
        (1).v-if="表达式" 
        (2).v-else-if="表达式"
        (3).v-else="表达式"
    适用于：切换频率较低的场景。
    特点：不展示的DOM元素直接被移除。
    注意：v-if可以和:v-else-if、v-else一起使用，但要求结构不能被“打断”。

2. v-show
    写法：v-show="表达式"
    适用于：切换频率较高的场景。
    特点：不展示的DOM元素未被移除，仅仅是使用样式隐藏掉
    
3. 备注：使用v-if的时，元素可能无法获取到，而使用v-show一定可以获取到。
```

## 列表渲染
### v-for指令:
```
1. 用于展示列表数据
2. 语法：v-for="(item, index) in xxx" :key="yyy"
3. 可遍历：数组、对象、字符串（用的很少）、指定次数（用的很少）
```
### key的作用 原理
react、vue中的key有什么作用？
```
1. 虚拟DOM中key的作用：
  key是虚拟DOM对象的标识，当数据发生变化时，Vue会根据【新数据】生成【新的虚拟DOM】, 
  随后Vue进行【新虚拟DOM】与【旧虚拟DOM】的差异比较，比较规则如下：
                
2.对比规则：
  (1).旧虚拟DOM中找到了与新虚拟DOM相同的key：
    ①.若虚拟DOM中内容没变, 直接使用之前的真实DOM！
    ②.若虚拟DOM中内容变了, 则生成新的真实DOM，随后替换掉页面中之前的真实DOM。
  (2).旧虚拟DOM中未找到与新虚拟DOM相同的key创建新的真实DOM，随后渲染到到页面。
                        
3. 用index作为key可能会引发的问题：
   1. 若对数据进行：逆序添加、逆序删除等破坏顺序操作:
     会产生没有必要的真实DOM更新 ==> 界面效果没问题, 但效率低。

   2. 如果结构中还包含输入类的DOM：
     会产生错误DOM更新 ==> 界面有问题。

4. 开发中如何选择key?:
   1.最好使用每条数据的唯一标识作为key, 比如id、手机号、身份证号、学号等唯一值。 
   2.如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，仅用于渲染列表用于展示，使用index作为key是没有问题的。
```

## 数据监视
Vue监视数据的原理：
```
1. vue会监视data中所有层次的数据。

2. 如何监测对象中的数据？
通过setter实现监视，且要在new Vue时就传入要监测的数据。
(1).对象中后追加的属性，Vue默认不做响应式处理
(2).如需给后添加的属性做响应式，请使用如下API：

Vue.set(target，propertyName/index，value) 或 vm.$set(target，propertyName/index，value)

3. 如何监测数组中的数据？
通过包裹数组更新元素的方法实现，本质就是做了两件事：
(1).调用原生对应的方法对数组进行更新。
(2).重新解析模板，进而更新页面。

4. 在Vue修改数组中的某个元素一定要用如下方法：
    1.使用这些API:push()、pop()、shift()、unshift()、splice()、sort()、reverse()
    2.Vue.set() 或 vm.$set()

特别注意：Vue.set() 和 vm.$set() 不能给vm 或 vm的根数据对象 添加属性！！！
```

## 收集表单数据
```
若：<input type="text"/>，则v-model收集的是value值，用户输入的就是value值。
若：<input type="radio"/>，则v-model收集的是value值，且要给标签配置value值。
若：<input type="checkbox"/>
  1.没有配置input的value属性，那么收集的就是checked（勾选 or 未勾选，是布尔值）
  2.配置input的value属性:
    (1)v-model的初始值是非数组，那么收集的就是checked（勾选 or 未勾选，是布尔值）
    (2)v-model的初始值是数组，那么收集的的就是value组成的数组

备注：v-model的三个修饰符：
lazy：失去焦点再收集数据
number：输入字符串转为有效的数字
trim：输入首尾空格过滤
```

## 过滤器
```
定义：对要显示的数据进行特定格式化后再显示（适用于一些简单逻辑的处理）。
语法：
  1. 注册过滤器：Vue.filter(name,callback) 或 new Vue{filters:{}}
  2. 使用过滤器：{{ xxx | 过滤器名}}  或  v-bind:属性 = "xxx | 过滤器名"

备注：
 1. 过滤器也可以接收额外参数、多个过滤器也可以串联
 2. 并没有改变原本的数据, 是产生新的对应的数据
```

## 内置指令
```
我们学过的指令：
    v-bind	: 单向绑定解析表达式, 可简写为 :xxx
    v-model	: 双向数据绑定
    v-for  	: 遍历数组/对象/字符串
    v-on   	: 绑定事件监听, 可简写为@
    v-if 	 	: 条件渲染（动态控制节点是否存存在）
    v-else 	: 条件渲染（动态控制节点是否存存在）
    v-show 	: 条件渲染 (动态控制节点是否展示)

v-text指令：
    1.作用：向其所在的节点中渲染文本内容。
    2.与插值语法的区别：v-text会替换掉节点中的内容，{{xx}}则不会。

v-html指令：
1. 作用：向指定节点中渲染包含html结构的内容。
2. 与插值语法的区别：
  (1).v-html会替换掉节点中所有的内容，{{xx}}则不会。
  (2).v-html可以识别html结构。
3. 严重注意：v-html有安全性问题！！！！
  (1).在网站上动态渲染任意HTML是非常危险的，容易导致XSS攻击。
  (2).一定要在可信的内容上使用v-html，永不要用在用户提交的内容上！
  
v-cloak指令（没有值）：
1. 本质是一个特殊属性，Vue实例创建完毕并接管容器后，会删掉v-cloak属性。
2. 使用css配合v-cloak可以解决网速慢时页面展示出{{xxx}}的问题。

v-once指令：
1.v-once所在节点在初次动态渲染后，就视为静态内容了。
2.以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能。

v-pre指令：
1. 跳过其所在节点的编译过程。
2. 可利用它跳过：没有使用指令语法、没有使用插值语法的节点，会加快编译。
```

## 生命周期：
1. 又名：生命周期回调函数、生命周期函数、生命周期钩子。
2. 是什么：Vue在关键时刻帮我们调用的一些特殊名称的函数。
3. 生命周期函数的名字不可更改，但函数的具体内容是程序员根据需求编写的。
4. 生命周期函数中的this指向是vm 或 组件实例对象。
