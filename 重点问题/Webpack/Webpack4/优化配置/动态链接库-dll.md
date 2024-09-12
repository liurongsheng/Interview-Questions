# 动态链接库 dll

有类似 externals 的功能，排除指定的包。

externals 彻底不打包，需要使用 cdn 引入

dll 需要打包一次第三方库，后续就不需要重复打包

正常情况下 node_modules 中所有的包都会被打成一个 chunks

当项目依赖很多的时候，这个 chunks 会很大，所以对第三方的库单独打包，然后引入，这样打包速度会快很多

## 实际使用

`webpack --config webpack.dll.js` // 先打包 dll 文件
`webpack` // 正常使用，加载dll文件，这样打包速度会快很多

## webpack.config.js

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "built.js",
    path: resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // 告诉webpack哪些库不参与打包，同时使用时的名称也得变~
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, "dll/manifest.json"),
    }),
    // 将某个文件打包输出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, "dll/jquery.js"),
    }),
  ],
  mode: "production",
};
```

## webpack.dll.js

```js
/*
  使用dll技术，对某些库（第三方库：jquery、react、vue...）进行单独打包
    当你运行 webpack 时，默认查找 webpack.config.js 配置文件
    需求：需要运行 webpack.dll.js 文件
      --> webpack --config webpack.dll.js
*/

const { resolve } = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    // 最终打包生成的[name] --> jquery
    // ['jquery'] --> 要打包的库是jquery
    // 后续可以第三方的库都放在 entry 里面
    jquery: ["jquery"],
  },
  output: {
    filename: "[name].js", // 这里的name就是在entry里面的key
    path: resolve(__dirname, "dll"),
    library: "[name]_[hash]", // 打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包生成一个 manifest.json --> 提供和jquery映射
    new webpack.DllPlugin({
      name: "[name]_[hash]", // 映射库的暴露的内容名称
      path: resolve(__dirname, "dll/manifest.json"), // 输出文件路径
    }),
  ],
  mode: "production",
};
```
