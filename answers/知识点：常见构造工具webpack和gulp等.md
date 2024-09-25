# Npm Script 、 Grunt 、Gulp 和 Webpack

> 面试题：webpcak 和 gulp 有什么不同

webpack 和 Gulp 之间的关系是十分暧昧的，却也经常被人误解，以为它俩是竞争关系，其实不然。

Gulp 是一个任务管理工具，让简单的任务更清晰，让复杂的任务易于掌控；
而 webpack 的理念是，一切皆为模块，每个模块在打包的时候都会经过一个叫做 loader 的东西，
它具备非常强大的精细化管理能力，主要解决的是依赖分析问题。

## Npm Script

Npm Script 是一个任务执行者。
Npm 是在安装 Node.js 时附带的包管理器，Npm Script 则是 Npm 内置的一个功能，
允许在 package.json 文件里面使用 scripts 字段定义任务：

```json
{
  "scripts": {
    "dev": "node dev.js",
    "pub": "node build.js"
  }
}
```

里面的 scripts 字段是一个对象，每个属性对应一段 Shell 脚本，以上代码定义了两个任务 dev 和 pub。
其底层实现原理是通过调用 Shell 去运行脚本命令，例如执行 npm run pub 命令等同于执行命令 node build.js。

Npm Script 的优点是内置，无须安装其他依赖。
其缺点是功能太简单，虽然提供了 pre 和 post 两个钩子，但不能方便地管理多个任务之间的依赖。

## Grunt

Grunt 和 Npm Script 类似，也是一个任务执行者。
Grunt 有大量现成的插件封装了常见的任务，也能管理任务之间的依赖关系，
自动化执行依赖的任务，每个任务的具体执行代码和依赖关系写在配置文件 Gruntfile.js 里，
例如：

```js
module.exports = function (grunt) {
  // 所有插件的配置信息
  grunt.initConfig({
    // uglify 插件的配置信息
    uglify: {
      app_task: {
        files: {
          "build/app.min.js": ["lib/index.js", "lib/test.js"],
        },
      },
    },
    // watch 插件的配置信息
    watch: {
      another: {
        files: ["lib/*.js"],
      },
    },
  });

  // 告诉 grunt 我们将使用这些插件
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // 告诉grunt当我们在终端中启动 grunt 时需要执行哪些任务
  grunt.registerTask("dev", ["uglify", "watch"]);
};
```

在项目根目录下执行命令 grunt dev 就会启动 JavaScript 文件压缩和自动刷新功能。

Grunt 的优点是：

1. 灵活，它只负责执行你定义的任务；
1. 大量的可复用插件封装好了常见的构建任务。
1. Grunt 的缺点是集成度不高，要写很多配置后才可以用，无法做到开箱即用。

Grunt 相当于进化版的 Npm Script，它的诞生其实是为了弥补 Npm Script 的不足。

## Gulp

Gulp 是一个基于流的自动化构建工具。 除了可以管理和执行任务，还支持监听文件、读写文件。
Gulp 被设计得非常简单，只通过下面 5 种个方法就可以胜任几乎所有构建场景：

1. 通过 gulp.task 注册一个任务；
1. 通过 gulp.run 执行任务；
1. 通过 gulp.watch 监听文件变化；
1. 通过 gulp.src 读取文件；
1. 通过 gulp.dest 写文件。

Gulp 的最大特点是引入了流的概念，同时提供了一系列常用的插件去处理流，流可以在插件之间传递，大致使用如下：

```js
// 引入 Gulp
var gulp = require("gulp");
// 引入插件
var jshint = require("gulp-jshint");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

// 编译 SCSS 任务
gulp.task("sass", function () {
  // 读取文件通过管道喂给插件
  gulp
    .src("./scss/*.scss")
    // SCSS 插件把 scss 文件编译成 CSS 文件
    .pipe(sass())
    // 输出文件
    .pipe(gulp.dest("./css"));
});

// 合并压缩 JS
gulp.task("scripts", function () {
  gulp
    .src("./js/*.js")
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./dist"));
});

// 监听文件变化
gulp.task("watch", function () {
  // 当 scss 文件被编辑时执行 SCSS 任务
  gulp.watch("./scss/*.scss", ["sass"]);
  gulp.watch("./js/*.js", ["scripts"]);
});
```

Gulp 的优点是好用又不失灵活，既可以单独完成构建也可以和其它工具搭配使用。
其缺点是和 Grunt 类似，集成度不高，要写很多配置后才可以用，无法做到开箱即用。

可以将 Gulp 看作 Grunt 的加强版。相对于 Grunt，Gulp 增加了监听文件、读写文件、流式处理的功能。

## Webpack

Webpack 是一个打包模块化 JavaScript 的工具，在 Webpack 里一切文件皆模块，
通过 Loader 转换文件，通过 Plugin 注入钩子，最后输出由多个模块组合成的文件。
Webpack 专注于构建模块化项目。

> Webpack 概念很多，但搞清楚 entry，output 和 loader 三个关键点，基本上就可以解决简单的问题了。

<img src="/img/webpack首页图.jpg" title="webpack首页图" />

一切文件：JavaScript、CSS、SCSS、图片、模板，在 Webpack 眼中都是一个个模块，
这样的好处是能清晰的描述出各个模块之间的依赖关系，以方便 Webpack 对模块进行组合和打包。
经过 Webpack 的处理，最终会输出浏览器能使用的静态资源。

Webpack 具有很大的灵活性，能配置如何处理文件，大致使用如下：

```js
module.exports = {
  // 所有模块的入口，Webpack 从入口开始递归解析出所有依赖的模块
  entry: "./app.js",
  output: {
    // 把入口所依赖的所有模块打包成一个文件 bundle.js 输出
    filename: "bundle.js",
  },
};
```

Webpack 的优点是：

1. 专注于处理模块化的项目，能做到开箱即用一步到位；
1. 通过 Plugin 扩展，完整好用又不失灵活；
1. 使用场景不仅限于 Web 开发；
1. 社区庞大活跃，经常引入紧跟时代发展的新特性，能为大多数场景找到已有的开源扩展；
1. 良好的开发体验。

Webpack 的缺点是只能用于采用模块化开发的项目。
