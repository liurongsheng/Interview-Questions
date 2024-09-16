# PWA

PWA：渐进式网络开发应用程序(离线可访问)

`workbox --> workbox-webpack-plugin`

可以让网页像应用一样可以离线访问，淘宝已经在使用 PWA 技术

在 Network 中设置 Offline，可以模拟离线环境，可以用来测试

因为兼容性问题，普及还需要时间

## 关键配置

webpack 配置 plugins

```js
plugins: [
  new WorkboxWebpackPlugin.GenerateSW({
    /*
      1. 帮助serviceworker快速启动
      2. 删除旧的 serviceworker

      生成一个 serviceworker 配置文件~
    */
    clientsClaim: true,
    skipWaiting: true,
  }),
];
```

入口文件中的配置，sw 代码必须运行在服务器才会生效

```js
/*
  1. eslint不认识 window、navigator全局变量
    解决：需要修改package.json中eslintConfig配置
      "env": {
        "browser": true // 支持浏览器端全局变量
      }
   2. sw代码必须运行在服务器上
      --> nodejs
      -->
        npm i serve -g
        serve -s build 启动服务器，将build目录下所有资源作为静态资源暴露出去
*/
// 注册serviceWorker
// 处理兼容性问题
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => {
        console.log("sw注册成功了~");
      })
      .catch(() => {
        console.log("sw注册失败了~");
      });
  });
}
```

package.json 中配置 env.browser 可以识别 浏览器的全局变量

```js
"eslintConfig": {
  "extends": "airbnb-base",
  "env": {
    "browser": true
  }
},
```

## 具体配置

```js
const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = "production";

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  "css-loader",
  {
    // 还需要在package.json中定义browserslist
    loader: "postcss-loader",
    options: {
      ident: "postcss",
      plugins: () => [require("postcss-preset-env")()],
    },
  },
];

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/built.[contenthash:10].js",
    path: resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        // 在package.json中eslintConfig --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: "pre",
        loader: "eslint-loader",
        options: {
          fix: true,
        },
      },
      {
        // 以下loader只会匹配一个
        // 注意：不能有两个配置处理同一种类型文件
        oneOf: [
          {
            test: /\.css$/,
            use: [...commonCssLoader],
          },
          {
            test: /\.less$/,
            use: [...commonCssLoader, "less-loader"],
          },
          /*
            正常来讲，一个文件只能被一个loader处理
            当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
              先执行eslint 在执行babel
          */
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: { version: 3 },
                    targets: {
                      chrome: "60",
                      firefox: "50",
                    },
                  },
                ],
              ],
              // 开启babel缓存
              // 第二次构建时，会读取之前的缓存
              cacheDirectory: true,
            },
          },
          {
            test: /\.(jpg|png|gif)/,
            loader: "url-loader",
            options: {
              limit: 8 * 1024,
              name: "[hash:10].[ext]",
              outputPath: "imgs",
              esModule: false,
            },
          },
          {
            test: /\.html$/,
            loader: "html-loader",
          },
          {
            exclude: /\.(js|css|less|html|jpg|png|gif)/,
            loader: "file-loader",
            options: {
              outputPath: "media",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/built.[contenthash:10].css",
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new WorkboxWebpackPlugin.GenerateSW({
      /*
        1. 帮助serviceworker快速启动
        2. 删除旧的 serviceworker

        生成一个 serviceworker 配置文件~
      */
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  mode: "production",
  devtool: "source-map",
};
```
