# Social Ad Platform

基于 `NestJS + MySQL + Vue3/Vite + HBuilder/uni-app` 的社交广告平台起步工程。

## 目录

- `server/`：NestJS 后端服务，包含用户、动态、评论、点赞、图片上传、公告、广告位、广告套餐、广告订单、广告审核和支付回调骨架。
- `admin/`：Vue3 + Vite 管理后台起步页面。
- `miniapp/`：uni-app 小程序端起步页面。
- `docs/`：项目实现清单和开发文档。


## 零依赖本地预览

如果你只是想先打开页面看看效果，可以直接运行：

```bash
npm run preview:local
```

然后访问：

```text
http://localhost:3000
```

该模式不需要 `npm install`，也不需要 MySQL，会启动一个 Node.js 内置 HTTP 服务并提供模拟 API。它适合快速验收页面流程；正式开发仍请使用下面的 NestJS、Vue3 和 uni-app 启动方式。

## 快速开始

```bash
npm install
cp server/.env.example server/.env
npm run dev:server
npm run dev:admin
npm run dev:miniapp
```

> 后端默认连接 MySQL，请先按 `server/.env.example` 创建数据库配置。
