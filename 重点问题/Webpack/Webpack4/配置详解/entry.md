# entry

entry: 入口起点

1. string --> './src/index.js'
   单入口
   打包形成一个 chunk。 输出一个 bundle 文件。
   此时 chunk 的名称默认是 main

2. array --> ['./src/index.js', './src/add.js']
   多入口
   所有入口文件最终只会形成一个 chunk, 输出出去只有一个 bundle 文件，此时 chunk 的名称默认是 main
   --> 只有在 HMR 功能中让 html 热更新生效，这种配置方式一般不用，基本也是在开发环境使用

3. object
   多入口
   有几个入口文件就形成几个 chunk，输出几个 bundle 文件
   此时 chunk 的名称是 key

   --> 特殊用法，在 dll 的时候用 `react: ['react', 'react-dom', 'react-router-dom']` 输出成一个 chunk 文件

```js
  {
    // 所有入口文件最终只会形成一个chunk, 输出出去只有一个bundle文件。
    index: ['./src/index.js', './src/count.js'],
    // 形成一个chunk，输出一个bundle文件。
    add: './src/add.js',
    react: ['react', 'react-dom', 'react-router-dom']
  }
```

## 具体配置

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: ["./src/index.js", "./src/count.js"],
    add: "./src/add.js",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "build"),
  },
  plugins: [new HtmlWebpackPlugin()],
  mode: "development",
};
```
