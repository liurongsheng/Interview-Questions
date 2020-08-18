# scrollTop
获取当前页面滚动条纵坐标的位置
- document.body.scrollTop
- document.documentElement.scrollTop

document.documentElement.scrollTop = 0 滚动到页面最上方
document.documentElement.scrollTop = 9999 滚动到页面最下方

获取当前页面滚动条横坐标的位置：
- document.body.scrollLeft
- document.documentElement.scrollLeft

## 浏览器支持
- IE6/7/8:
可以使用 document.documentElement.scrollTop
- IE9及以上:
可以使用 document.documentElement.scrollTop 或者 window.pageYOffset
- Safari:
可以使用 document.body.scrollTop 或者 window.pageYOffset
- Firefox:
可以使用 document.documentElement.scrollTop 或者 window.pageYOffset
- Chrome:
可以使用 document.documentElement.scrollTop

document.body.scrollTop
document.documentElement.scrollTop 两者有个特点，同时只会有一个值生效。

如果不考虑safari:
var sTop = document.body.scrollTop + document.documentElement.scrollTop

这两个值总会有一个恒为0，所以不用担心会对真正的scrollTop造成影响

var heightTop = document.documentElement.scrollTop || document.body.scrollTop;
console.log(heightTop);




