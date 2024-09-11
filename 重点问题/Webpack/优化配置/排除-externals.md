# 排除 externals

防止将某一些包打包的 bundle 中，比如 jQuery，lodash 使用 CDN 的方式

```js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  mode: "production",
  externals: {
    // 拒绝jQuery被打包进来
    jquery: "jQuery",
  },
};
```

需要外部引用的库，在 html 文件中通过 script 标签引入即可

```js
<body>
  <h1 id="title">CDN加载</h1>
  <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
</body>
```
