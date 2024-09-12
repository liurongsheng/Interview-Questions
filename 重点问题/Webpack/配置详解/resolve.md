# resolve

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/[name].js",
    path: resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
  mode: "development",
  // 解析模块的规则
  resolve: {
    // 配置解析模块路径别名: 优点简写路径 缺点路径没有提示
    alias: {
      $css: resolve(__dirname, "src/css"),
    },
    // 配置省略文件路径的后缀名，名字不要取一样的，不然 index.js 和 index.css 会被优先识别为 index.js，或者这里不要 '.css'
    extensions: [".js", ".json", ".jsx", ".css"],
    // 告诉 webpack 解析模块是去找哪个目录，node_modules 内层找不到会往外层找，这里是指定 node_modules 所在路径
    modules: [resolve(__dirname, "../../node_modules"), "node_modules"],
  },
};
```
