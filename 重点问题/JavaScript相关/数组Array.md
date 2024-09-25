# 数组

## ES6 数组去重可以用哪些方法

- Set 结合拓展运算符，用 Set 自动去除重复元素，再通过扩展操作符将其转换回数组
- Array.from 结合 Set，Array.from()方法将 Set 转换为数组
- reduce 结合 includes，初始化累加器为一个数组，用 includes 判断当前值，如果不存在就加入数组，最后放回累加器结果
- filter 结合 indexOf，用 indexOf 检查当前元素在原数组中第一次出现的位置是否与当前遍历的位置相同，如果不同则表示该元素在此之前已经出现过了，可以实现去重

Set 内部使用 === 来判断是否相等，类似'1'和 1 会两个都保存，NaN 和 NaN 只会保存一个

```js
const array = [1, 2, 2, 3, "3", 4, NaN, NaN];
const uniqueArray = [...new Set(array)];
console.log(uniqueArray); // [ 1, 2, 3, '3', 4, NaN ]
```

```js
const array = [1, 2, 2, 3, 4, 4, 5];
const uniqueArray = Array.from(new Set(array));
console.log(uniqueArray); // [1, 2, 3, 4, 5]
```

```js
// reduce 方法的第一个参数是一个回调函数，第二个参数是一个初始值，初始值设为一个空数组 []
// 回调函数接收两个参数：acc（累加器）和 current（当前值）
// 使用 includes 方法检查当前值是否已经存在于累加器数组中
// 如果当前值不存在于累加器数组中，则将其添加到累加器数组中
// 返回累加器结果，每次迭代后，都将修改后的累加器数组返回给 reduce 方法
const array = [1, 2, 2, 3, 4, 4, 5];
const uniqueArray = array.reduce((acc, current) => {
  if (!acc.includes(current)) {
    acc.push(current);
  }
  return acc;
}, []);
console.log(uniqueArray); // [1, 2, 3, 4, 5]
```

```js
const array = [1, 2, 2, 3, 4, 4, 5];
const uniqueArray = array.filter(
  (item, index, arr) => arr.indexOf(item) === index
);
console.log(uniqueArray); // [1, 2, 3, 4, 5]
```

## 如何判断一个变量是对象还是数组

判断数组

typeof 来判断对象和数组，因为这两种类型都会返回"object"，所以使用 typeof 无法区分

```js
console.log(Array.isArray({})); // false
console.log(Array.isArray([])); // true

console.log(Object.prototype.toString.call({})); // [object Object]
console.log(Object.prototype.toString.call([])); // [object Array]
```

```js
function isArrayOrObject(variable) {
  if (Array.isArray(variable)) {
    return "Array";
  } else if (typeof variable === "object" && variable !== null) {
    return "Object";
  } else {
    return "其他类型";
  }
}

console.log(isArrayOrObject([1, 2, 3])); // Array
console.log(isArrayOrObject({ a: 1 })); // Object
```

```js
function isArrayOrObject(object) {
  return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1]; // 正则一
  return Object.prototype.toString.call(object).slice(8, -1); // 正则二
}

console.log(isArrayOrObject([1, 2, 3])); // Array
console.log(isArrayOrObject({ a: 1 })); // Object
```

## split()、join()的区别？

split() 是将字符分割成一个数组，join() 将数组转为一个字符串

### pop()、push()、unshift()、shift()的作用？

- pop() 删除数组最后一个元素，并返回这个元素
- push() 向数组的末尾添加一个或多个元素，并返回数组新的长度
- unshift() 方法可向数组的开头添加一个或更多元素，并返回数组新的长度
- shift() 删除数组第一个元素，并返回这个元素
