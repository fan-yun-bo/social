# 接口说明与备注

本文档列出第一版核心 API、用途、鉴权要求、请求参数备注和上线注意事项。正式接口以 Swagger 文档为准，启动后可访问 `/api/docs`。

## 1. 认证接口

### POST /api/auth/wx-login

用途：小程序微信登录。

鉴权：不需要。

请求体：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| code | 是 | 微信登录 code。当前开发态使用模拟 openid，正式上线需调用微信接口换取 openid。 |
| nickname | 否 | 用户昵称。 |
| avatar | 否 | 用户头像。 |

返回：JWT token 和用户信息。

备注：

- 正式上线必须接入微信 `jscode2session`。
- 首次登录时创建用户，再次登录时更新最近登录时间。

### POST /api/auth/wx-phone

用途：小程序手机号授权后入库。

鉴权：用户 JWT。

请求体：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| code | 是 | 微信手机号授权 code。 |
| phone | 否 | 开发态可传手机号，正式上线不应信任前端明文手机号。 |

备注：

- 正式上线应通过微信接口换取手机号。
- 手机号入库后设置 `phone_verified = true`。

## 2. 用户接口

### GET /api/user/profile

用途：获取当前登录用户资料。

鉴权：用户 JWT。

备注：用于小程序“我的”页面初始化。

### PATCH /api/user/profile

用途：更新当前用户昵称、头像。

鉴权：用户 JWT。

备注：手机号不建议通过该接口直接修改，应走手机号授权或验证码绑定流程。

## 3. 上传接口

### POST /api/upload/image

用途：上传单张图片。

鉴权：用户 JWT。

Content-Type：`multipart/form-data`

参数：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| file | 是 | 图片文件。 |
| scene | 否 | 使用场景：post、avatar、ad、announcement。 |

备注：

- 第一版本地保存，正式上线建议接对象存储。
- 需要限制文件大小、后缀、MIME 类型。

### POST /api/upload/images

用途：上传多张图片。

鉴权：用户 JWT。

备注：动态发布最多建议 9 张图。

## 4. 动态接口

### GET /api/posts

用途：获取动态信息流。

鉴权：不强制，登录后可扩展返回 `isLiked`。

查询参数：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| page | 否 | 页码，默认 1。 |
| pageSize | 否 | 每页数量，默认 10。 |

备注：

- 排序规则：置顶优先，然后按发布时间倒序。
- 只返回正常状态动态。

### POST /api/posts

用途：发布动态。

鉴权：用户 JWT。

请求体：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| content | 否 | 动态文字内容。 |
| images | 否 | 图片 URL 数组，需要先调用上传接口。 |

备注：

- 至少应有文字或图片之一。
- 上线前建议接敏感词和图片审核。

### GET /api/posts/:id

用途：动态详情。

鉴权：不强制。

备注：访问详情时会增加浏览量。

### POST /api/posts/:id/like

用途：点赞或取消点赞。

鉴权：用户 JWT。

备注：同一用户对同一动态只能点赞一次。

## 5. 评论接口

### GET /api/posts/:postId/comments

用途：获取动态评论列表。

鉴权：不强制。

备注：第一版返回一级评论。

### POST /api/posts/:postId/comments

用途：发布评论。

鉴权：用户 JWT。

请求体：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| content | 是 | 评论内容。 |
| parentId | 否 | 父评论 ID，第一版可不传。 |

### DELETE /api/comments/:id

用途：删除自己的评论。

鉴权：用户 JWT。

备注：后台删除违规评论使用后台接口。

## 6. 公告接口

### GET /api/announcements

用途：获取公告。

鉴权：不需要。

查询参数：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| position | 否 | 公告展示位置，例如 `home_top`。 |

备注：小程序首页公告栏使用该接口。

## 7. 广告用户端接口

### GET /api/ad-positions

用途：获取可购买广告位。

鉴权：不需要。

备注：只返回启用状态广告位。

### GET /api/ad-packages

用途：获取广告套餐。

鉴权：不需要。

查询参数：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| positionId | 否 | 按广告位筛选套餐。 |

### GET /api/ads

用途：按广告位获取当前有效广告。

鉴权：不需要。

备注：只返回审核通过、展示中、在投放时间范围内的广告。

### POST /api/ad-orders

用途：创建广告订单。

鉴权：用户 JWT。

请求体：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| positionId | 是 | 广告位 ID。 |
| packageId | 是 | 广告套餐 ID。 |
| title | 是 | 广告标题。 |
| imageUrl | 是 | 广告图片 URL，需要先上传。 |
| linkType | 否 | 跳转类型。 |
| linkUrl | 否 | 跳转地址。 |
| startTime | 否 | 投放开始时间。 |

备注：

- 创建订单后进入待支付。
- 支付成功后进入待审核。
- 审核通过后才允许展示。

### GET /api/my/ad-orders

用途：获取我的广告订单。

鉴权：用户 JWT。

### GET /api/my/ad-orders/:id

用途：获取我的广告订单详情。

鉴权：用户 JWT。

## 8. 广告管理后台接口

### GET /api/admin/ad-positions

用途：后台广告位列表。

鉴权：管理员 JWT。

### POST /api/admin/ad-positions

用途：新增广告位。

鉴权：管理员 JWT。

备注：`code` 应唯一，推荐使用英文标识。

### PATCH /api/admin/ad-positions/:id

用途：编辑广告位。

鉴权：管理员 JWT。

### DELETE /api/admin/ad-positions/:id

用途：删除广告位。

鉴权：管理员 JWT。

备注：如广告位已被套餐引用，则改为禁用而不是物理删除。

### GET /api/admin/ad-packages

用途：后台广告套餐列表。

鉴权：管理员 JWT。

### POST /api/admin/ad-packages

用途：新增广告套餐。

鉴权：管理员 JWT。

### PATCH /api/admin/ad-packages/:id

用途：编辑广告套餐。

鉴权：管理员 JWT。

### DELETE /api/admin/ad-packages/:id

用途：删除广告套餐。

鉴权：管理员 JWT。

备注：如套餐已被订单引用，则改为禁用而不是物理删除。

### GET /api/admin/ad-orders

用途：后台广告订单列表。

鉴权：管理员 JWT。

### PATCH /api/admin/ads/:id/approve

用途：审核通过广告。

鉴权：管理员 JWT。

备注：审核通过后广告进入展示中或待投放状态。

### PATCH /api/admin/ads/:id/reject

用途：审核拒绝广告。

鉴权：管理员 JWT。

请求体：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| rejectReason | 是 | 拒绝原因。 |

## 9. 后台通用接口

### POST /api/admin/auth/login

用途：管理员登录。

鉴权：不需要。

备注：正式上线必须修改默认密码，并建议增加验证码、登录失败锁定和操作日志。

### GET /api/admin/statistics

用途：后台统计概览。

鉴权：管理员 JWT。

### GET /api/admin/users

用途：后台用户列表。

鉴权：管理员 JWT。

### PATCH /api/admin/users/:id/status

用途：禁用或解禁用户。

鉴权：管理员 JWT。

## 10. 健康检查接口

### GET /api/health

用途：进程健康检查。

鉴权：不需要。

### GET /api/health/readiness

用途：服务就绪检查，会检查数据库连接。

鉴权：不需要。

备注：Docker healthcheck 和负载均衡就绪探针可使用该接口。
