# 数据库字段说明

本文档说明社交广告平台第一版核心数据表、字段含义、业务约束和上线注意事项。当前后端使用 TypeORM 实体建模，开发环境可通过 `synchronize` 自动建表；正式上线建议改用数据库迁移脚本。

## 1. 用户与管理员

### 1.1 users 用户表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| openid | VARCHAR(100) | 否 | 微信小程序用户 openid，建议唯一。 |
| unionid | VARCHAR(100) | 否 | 微信开放平台 unionid，用于多端统一用户。 |
| nickname | VARCHAR(100) | 否 | 用户昵称。 |
| avatar | VARCHAR(500) | 否 | 用户头像 URL。 |
| phone | VARCHAR(30) | 否 | 用户手机号，手机号授权或绑定后入库。 |
| phone_verified | BOOLEAN/TINYINT | 是 | 手机号是否已验证。 |
| gender | TINYINT | 是 | 性别：0 未知，1 男，2 女。 |
| status | TINYINT | 是 | 用户状态：1 正常，0 禁用。 |
| bio | VARCHAR(255) | 否 | 用户简介。 |
| last_login_at | DATETIME | 否 | 最近登录时间。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

业务说明：

- 手机号属于敏感信息，后台展示时建议脱敏，例如 `138****8000`。
- 被禁用用户不能发布动态、评论、点赞或购买广告。
- `openid` 是小程序登录的主要身份凭证。

### 1.2 admins 管理员表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| username | VARCHAR(50) | 是 | 管理员账号，唯一。 |
| password | VARCHAR(255) | 是 | 密码哈希，禁止存储明文密码。 |
| nickname | VARCHAR(50) | 否 | 管理员昵称。 |
| role | VARCHAR(50) | 是 | 管理员角色，默认 `admin`。 |
| status | TINYINT | 是 | 状态：1 正常，0 禁用。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

业务说明：

- 第一版可使用单一管理员角色。
- 后续应扩展角色权限，例如超级管理员、内容审核员、广告运营。

## 2. 内容与互动

### 2.1 posts 动态表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| user_id | BIGINT | 是 | 发布用户 ID。 |
| content | TEXT | 否 | 动态文字内容。 |
| images | JSON | 否 | 动态图片 URL 数组。 |
| is_top | BOOLEAN/TINYINT | 是 | 是否置顶。 |
| is_recommend | BOOLEAN/TINYINT | 是 | 是否推荐。 |
| status | TINYINT | 是 | 状态：1 正常，0 隐藏，-1 删除，2 审核中。 |
| like_count | INT | 是 | 点赞数量冗余字段。 |
| comment_count | INT | 是 | 评论数量冗余字段。 |
| view_count | INT | 是 | 浏览数量冗余字段。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

业务说明：

- 发布动态前，图片必须先通过上传接口上传，再把 URL 写入 `images`。
- 列表排序建议：置顶优先，其次按发布时间倒序。
- 删除建议优先软删除，避免影响评论、点赞和审计追踪。

### 2.2 post_likes 动态点赞表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| post_id | BIGINT | 是 | 动态 ID。 |
| user_id | BIGINT | 是 | 点赞用户 ID。 |
| created_at | DATETIME | 是 | 点赞时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

业务说明：

- 必须对 `post_id + user_id` 建唯一约束，防止重复点赞。
- 点赞/取消点赞时同步维护 `posts.like_count`。

### 2.3 comments 评论表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| post_id | BIGINT | 是 | 所属动态 ID。 |
| user_id | BIGINT | 是 | 评论用户 ID。 |
| parent_id | BIGINT | 是 | 父评论 ID，0 表示一级评论。 |
| content | VARCHAR(1000) | 是 | 评论内容。 |
| status | TINYINT | 是 | 状态：1 正常，0 隐藏，-1 删除。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

业务说明：

- 第一版优先使用一级评论。
- 后台删除违规评论时建议软删除。
- 评论内容上线前建议接入敏感词过滤。

## 3. 文件上传

### 3.1 files 文件表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| user_id | BIGINT | 否 | 上传用户 ID。 |
| file_url | VARCHAR(500) | 是 | 文件可访问 URL。 |
| file_path | VARCHAR(500) | 否 | 文件存储路径。 |
| file_name | VARCHAR(255) | 否 | 系统生成文件名。 |
| original_name | VARCHAR(255) | 否 | 原始文件名。 |
| file_type | VARCHAR(50) | 是 | 文件类型，例如 image、video、file。 |
| mime_type | VARCHAR(100) | 否 | MIME 类型。 |
| file_size | BIGINT | 是 | 文件大小，单位字节。 |
| storage_type | VARCHAR(50) | 是 | 存储类型：local、oss、cos、qiniu。 |
| scene | VARCHAR(50) | 否 | 使用场景：post、avatar、ad、announcement。 |
| status | TINYINT | 是 | 状态：1 正常，0 删除/禁用。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

业务说明：

- 开发阶段可使用本地存储。
- 正式上线建议使用对象存储，并限制文件类型和大小。

## 4. 公告与广告

### 4.1 announcements 公告表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| title | VARCHAR(100) | 是 | 公告标题。 |
| content | TEXT | 否 | 公告内容。 |
| position | VARCHAR(50) | 是 | 展示位置，例如 `home_top`。 |
| is_top | BOOLEAN/TINYINT | 是 | 是否置顶。 |
| status | TINYINT | 是 | 状态：1 启用，0 停用。 |
| start_time | DATETIME | 否 | 展示开始时间。 |
| end_time | DATETIME | 否 | 展示结束时间。 |
| sort | INT | 是 | 排序值，越大越靠前。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

### 4.2 ad_positions 广告位表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| name | VARCHAR(100) | 是 | 广告位名称。 |
| code | VARCHAR(100) | 是 | 广告位编码，例如 `home_banner`，唯一。 |
| description | VARCHAR(255) | 否 | 广告位说明。 |
| width | INT | 否 | 建议宽度。 |
| height | INT | 否 | 建议高度。 |
| max_count | INT | 是 | 同一时间最多展示数量。 |
| price_per_day | DECIMAL(10,2) | 是 | 每日价格。 |
| status | TINYINT | 是 | 状态：1 启用，0 禁用。 |
| sort | INT | 是 | 排序值。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

业务说明：

- 广告位被套餐引用后，删除时建议改为禁用。
- 第一版推荐广告位：`home_banner`、`feed_insert`、`post_detail_bottom`、`profile_banner`。

### 4.3 ad_packages 广告套餐表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| position_id | BIGINT | 是 | 所属广告位 ID。 |
| name | VARCHAR(100) | 是 | 套餐名称。 |
| days | INT | 是 | 投放天数。 |
| price | DECIMAL(10,2) | 是 | 套餐价格。 |
| original_price | DECIMAL(10,2) | 否 | 原价。 |
| description | VARCHAR(255) | 否 | 套餐说明。 |
| status | TINYINT | 是 | 状态：1 启用，0 禁用。 |
| sort | INT | 是 | 排序值。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

业务说明：

- 套餐被订单引用后，删除时建议改为禁用。
- 用户购买广告时必须选择启用状态的套餐。

### 4.4 ad_orders 广告订单表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| order_no | VARCHAR(64) | 是 | 订单号，唯一。 |
| user_id | BIGINT | 是 | 购买用户 ID。 |
| position_id | BIGINT | 是 | 广告位 ID。 |
| package_id | BIGINT | 是 | 广告套餐 ID。 |
| amount | DECIMAL(10,2) | 是 | 订单金额。 |
| pay_amount | DECIMAL(10,2) | 是 | 实际支付金额。 |
| pay_status | TINYINT | 是 | 支付状态：0 未支付，1 已支付，2 已退款。 |
| order_status | TINYINT | 是 | 订单状态：0 待支付，1 待审核，2 待投放，3 投放中，4 已结束，5 审核拒绝，6 已取消。 |
| pay_time | DATETIME | 否 | 支付时间。 |
| start_time | DATETIME | 否 | 投放开始时间。 |
| end_time | DATETIME | 否 | 投放结束时间。 |
| reject_reason | VARCHAR(255) | 否 | 审核拒绝原因。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

### 4.5 ads 广告内容表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| order_id | BIGINT | 否 | 关联广告订单 ID。 |
| user_id | BIGINT | 否 | 广告主用户 ID。 |
| title | VARCHAR(100) | 是 | 广告标题。 |
| image_url | VARCHAR(500) | 是 | 广告图片 URL。 |
| position_id | BIGINT | 是 | 广告位 ID。 |
| link_type | VARCHAR(50) | 是 | 跳转类型，例如 none、url、page。 |
| link_url | VARCHAR(500) | 否 | 跳转地址。 |
| status | TINYINT | 是 | 状态：0 待审核，1 待投放，2 展示中，3 已下架，4 审核拒绝，5 已结束。 |
| start_time | DATETIME | 否 | 展示开始时间。 |
| end_time | DATETIME | 否 | 展示结束时间。 |
| sort | INT | 是 | 排序值。 |
| view_count | INT | 是 | 曝光次数。 |
| click_count | INT | 是 | 点击次数。 |
| reject_reason | VARCHAR(255) | 否 | 拒绝原因。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

### 4.6 ad_logs 广告日志表

| 字段 | 类型建议 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| id | BIGINT | 是 | 主键 ID。 |
| ad_id | BIGINT | 是 | 广告 ID。 |
| user_id | BIGINT | 否 | 触发用户 ID。 |
| event_type | VARCHAR(20) | 是 | 事件类型：view 曝光，click 点击。 |
| ip | VARCHAR(50) | 否 | 客户端 IP。 |
| user_agent | VARCHAR(500) | 否 | 客户端 User-Agent。 |
| created_at | DATETIME | 是 | 创建时间。 |
| updated_at | DATETIME | 是 | 更新时间。 |

业务说明：

- 高频曝光日志后续可考虑分表或写入日志系统。
- 当前表适合第一版统计点击量、曝光量和点击率。
