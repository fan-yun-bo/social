# 生产化部署说明

本文档描述当前项目的第一版 Docker 化部署方式，适合在测试服务器或单机生产环境上验证完整链路。

## 1. 前置要求

- Docker 24+
- Docker Compose v2+
- 已开放后端端口 `3000` 和后台端口 `8080`，或按 `.env` 自定义端口。

## 2. 配置环境变量

```bash
cp .env.production.example .env
```

至少需要修改：

- `MYSQL_ROOT_PASSWORD`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `PUBLIC_BASE_URL`

## 3. 构建并启动

```bash
docker compose up -d --build
```

启动后访问：

- 后端健康检查：`http://localhost:3000/api/health`
- 后端就绪检查：`http://localhost:3000/api/health/readiness`
- Swagger 接口文档：`http://localhost:3000/api/docs`
- 管理后台：`http://localhost:8080`

## 4. 查看日志

```bash
docker compose logs -f server
docker compose logs -f admin
docker compose logs -f mysql
```

## 5. 停止服务

```bash
docker compose down
```

如需清空数据库和上传文件卷：

```bash
docker compose down -v
```

## 6. 当前上线状态

当前代码已经具备单机 Docker 部署骨架，但正式上线前仍建议继续完成：

- 微信小程序真实登录与手机号授权。
- 微信支付真实商户配置与回调验签。
- 图片对象存储，例如阿里云 OSS 或腾讯云 COS。
- 内容审核、举报、敏感词过滤和用户协议/隐私政策。
- 管理后台完整 CRUD 页面。
- 数据库迁移替代 `synchronize`。
- HTTPS、域名、日志采集和备份策略。
