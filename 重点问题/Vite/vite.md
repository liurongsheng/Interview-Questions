# vite

[awesome-vite](https://github.com/vitejs/awesome-vite#plugins)

## esbuild

[esbuild 官方文档](https://esbuild.github.io/)

## 创建

- 旧版本方式 `npm init @vitejs/app`
- `npm init vite` // 官方已经不再推荐使用 `@vitejs/create-app` 来创建 Vite 项目，而是建议使

用 `npm init vite` 命令

- Vue 3 单文件组件支持：`@vitejs/plugin-vue`
- Vue 3 JSX 支持：`@vitejs/plugin-vue-jsx`
- Vue 2.7 支持：`vitejs/vite-plugin-vue2`
- Vue <2.7 的支持：`underfin/vite-plugin-vue2`

## 配置 env

- .env.development
- .env.production
- .env

具体配置需要以 `VITE_` 开头，一定得下划线做连接符

VITE_config = 'development'

调用方式 `import.meta.env`
