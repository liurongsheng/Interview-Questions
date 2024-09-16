# 代码分割 code split

主要考虑的是 js 代码，并行加载，速度更快

## 根据入口文件进行代码分割

对入口的分割，可以借助 webpack 的 entry 属性，配置多入口，最终输出多 bundle 文件

很难指定入口，不太容易，通常都是单页应用的多

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 单入口，单页应用
  // entry: './src/js/index.js',
  entry: {
    // 多入口：有一个入口，最终输出就有一个bundle，多页应用
    index: "./src/js/index.js",
    test: "./src/js/test.js",
  },
  output: {
    // [name]：取文件名，这个 name 就是 entry 的 key
    filename: "js/[name].[contenthash:10].js",
    path: resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
  mode: "production",
};
```

## 抽取 node_modules 中代码单独打包

node_modules 的第三方库打成一个 chunk。结果至少两个文件，一个自己写的，一个第三方库的

```js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
},
```

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 单入口
  // entry: './src/js/index.js',
  entry: {
    index: "./src/js/index.js",
    test: "./src/js/test.js",
  },
  output: {
    // [name]：取文件名
    filename: "js/[name].[contenthash:10].js",
    path: resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
  ],
  /*
    1. 可以将node_modules中代码单独打包一个chunk最终输出
    2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk
  */
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  mode: "production",
};
```

## 指定单独打包某个文件

在抽取 node_modules 中代码单独打包配置的基础上，结合 import 动态导入语法

```js
/*
  通过js代码，让某个文件被单独打包成一个chunk
  import动态导入语法：能将某个文件单独打包，webpackChunkName: 'test' 指定打包的名字，没有配置的话，默认是自动生成的
*/
import(/* webpackChunkName: 'test' */ "./test")
  .then(({ mul, count }) => {
    // 文件加载成功~
    // eslint-disable-next-line
    console.log(mul(2, 5));
  })
  .catch(() => {
    // eslint-disable-next-line
    console.log("文件加载失败~");
  });
```
