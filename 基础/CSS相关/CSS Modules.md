# CSS Modules

[示例](https://github.com/ruanyf/css-modules-demos.git)

## 局部作用域

CSS 的规则都是全局的，任何一个组件的样式规则，都对整个页面有效

产生局部作用域的唯一方法，就是使用一个独一无二的 class 的名字，不会与其他选择器重名。这就是 CSS Modules 的做法

```css
.title {
  color: red;
}
```

```js
import React from "react";
import style from "./App.css";

export default () => {
  return <h1 className={style.title}>Hello World</h1>;
};
```

## 全局作用域

CSS Modules 允许使用:global(.className)的语法，声明一个全局规则。凡是这样声明的 class，都不会被编译成哈希字符串

```css
.title {
  color: red;
}

:global(.title) {
  color: green;
}
```

App.js 使用普通的 class 的写法，就会引用全局 class。

```js
import React from "react";
import styles from "./App.css";

export default () => {
  return <h1 className="title">Hello World</h1>;
};
```

## 定制哈希类名

css-loader 默认的哈希算法是[hash:base64]，这会将.title 编译成.\_3zyde4l1yATCOkgn-DBWEL 这样的字符串

webpack.config.js 里面可以定制哈希字符串的格式

```js
module: {
  loaders: [
    // ...
    {
      test: /\.css$/,
      loader:
        "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]",
    },
  ];
}
```

.title 被编译成了demo03-components-App---title---XSDrm

## Class 的组合

在 CSS Modules 中，一个选择器可以继承另一个选择器的规则，这成为组合 composition

```css
 .className {
   background-color: blue;
 }
 
 .title {
   composes: className;
   color: red;
 }
```

```js
import React from 'react';
import style from './App.css';

export default () => {
  return (
    <h1 className={style.title}>
      Hello World
    </h1>
  );
};
```

## 输入其他模块

another.css

```css
.className {
  background-color: blue;
}
```

App.css可以继承 another.css 里面的规则

```css
.title {
  composes: className from './another.css';
  color: red;
}
```

## 输入变量

CSS Modules 支持使用变量，不过需要安装 PostCSS 和 postcss-modules-values

`npm install --save postcss-loader postcss-modules-values`

把postcss-loader加入webpack.config.js
