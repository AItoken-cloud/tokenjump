# 项目概览

## 路由框架：TanStack Router（基于文件的路由）

路由文件位于 `src/routes/`，文件名/目录名自动映射为 URL 路径。

---

## 目录结构

```
src/routes/
├── __root.tsx                    # 根路由（所有页面的共同父级）
│                                 # 功能：加载主题、系统配置、全局通知、开发工具
│                                 # 前置检查：系统是否已初始化，未初始化跳转 /setup
│
├── index.tsx                     # 首页 /
│                                 # 组件：Home（未登录显示落地页，已登录显示仪表盘）
│
├── (auth)/                       # 认证相关页面（括号表示路由分组，不影响 URL）
│   ├── route.tsx                 # 认证组布局（空布局）
│   ├── sign-in.tsx               # 登录页 /sign-in
│   ├── sign-up.tsx               # 注册页 /sign-up
│   ├── forgot-password.tsx       # 忘记密码页 /forgot-password
│   ├── reset.tsx                 # 重置密码页 /reset（管理员重置）
│   ├── otp.tsx                   # 一次性验证码页 /otp
│   ├── oauth.tsx                 # OAuth 回调页 /oauth（第三方登录）
│   └── user/
│       └── reset.tsx             # 用户重置密码页 /user/reset
│
├── _authenticated/               # 需要登录的页面（下划线前缀表示布局路由）
│   │                             # 前置检查：未登录跳转 /sign-in，验证 session 有效性
│   │                             # 布局：AuthenticatedLayout（侧边栏 + 顶栏）
│   │
│   ├── route.tsx                 # 已登录布局路由
│   │
│   ├── dashboard/                # 数据仪表盘 /dashboard
│   │   ├── index.tsx             # 默认跳转到 /dashboard/overview
│   │   └── $section.tsx          # 仪表盘子页面 /dashboard/overview, /dashboard/consumption 等
│   │
│   ├── wallet/                   # 钱包/充值 /wallet
│   │   └── index.tsx             # 钱包页面，支持查看历史记录
│   │
│   ├── keys/                     # API Key 管理 /keys
│   │   └── index.tsx             # 创建、编辑、删除 API Key
│   │
│   ├── channels/                 # 渠道管理 /channels（仅管理员）
│   │   └── index.tsx             # 管理 AI 渠道（OpenAI、Claude、Gemini 等）
│   │
│   ├── models/                   # 模型管理 /models
│   │   ├── index.tsx             # 默认跳转到 /models/list
│   │   └── $section.tsx          # 模型列表、定价等子页面
│   │
│   ├── profile/                  # 个人资料 /profile
│   │   └── index.tsx             # 修改个人信息、密码
│   │
│   ├── subscriptions/            # 订阅管理 /subscriptions
│   │   └── index.tsx             # 查看和管理订阅
│   │
│   ├── usage-logs/               # 使用日志 /usage-logs
│   │   ├── index.tsx             # 默认跳转到 /usage-logs/api
│   │   └── $section.tsx          # API 日志、充值日志等
│   │
│   ├── playground/               # 测试场 /playground
│   │   └── index.tsx             # 在线测试 AI 模型
│   │
│   ├── chat/                     # 聊天 /chat
│   │   └── $chatId.tsx           # 聊天会话页面
│   │
│   ├── chat2link.tsx             # 聊天转链接 /chat2link
│   │
│   ├── redemption-codes/         # 兑换码 /redemption-codes（仅管理员）
│   │   └── index.tsx             # 管理兑换码
│   │
│   ├── users/                    # 用户管理 /users（仅管理员）
│   │   └── index.tsx             # 查看和管理所有用户
│   │
│   ├── errors/                   # 已登录状态下的错误页
│   │   └── $error.tsx            # 动态错误页面
│   │
│   └── system-settings/          # 系统设置 /system-settings（仅超级管理员）
│       ├── route.tsx             # 权限检查：非超级管理员跳转 /403
│       ├── index.tsx             # 默认跳转到 /system-settings/site
│       ├── site/                 # 站点设置
│       │   ├── index.tsx         # 默认跳转到第一个子 section
│       │   └── $section.tsx      # 站点配置子页面
│       ├── auth/                 # 认证设置
│       ├── billing/              # 计费设置
│       ├── content/              # 内容设置
│       ├── models/               # 模型设置
│       ├── operations/           # 运营设置
│       └── security/             # 安全设置
│
├── (errors)/                     # 错误页面（路由分组）
│   ├── 401.tsx                   # 未授权 /401
│   ├── 403.tsx                   # 禁止访问 /403
│   ├── 404.tsx                   # 未找到 /404
│   ├── 500.tsx                   # 服务器错误 /500
│   └── 503.tsx                   # 服务不可用 /503
│
├── setup/                        # 系统初始化 /setup
│   └── index.tsx                 # 首次安装时设置管理员账户
│
├── about/                        # 关于页面 /about
│   └── index.tsx
│
├── pricing/                      # 定价页面 /pricing
│   ├── index.tsx                 # 定价列表
│   └── $modelId/
│       └── index.tsx             # 单个模型定价详情
│
├── rankings/                     # 排行榜 /rankings
│   └── index.tsx
│
├── privacy-policy.tsx            # 隐私政策 /privacy-policy
├── user-agreement.tsx            # 用户协议 /user-agreement
├── oauth/                        # OAuth 第三方登录
│   └── $provider.tsx             # /oauth/github, /oauth/google 等
│
├── console/                      # 控制台（公开）
│   ├── log.tsx                   # 控制台日志
│   └── topup.tsx                 # 控制台充值
│
└── routeTree.gen.ts              # 自动生成的路由树（不要手动修改）
```

---

## 关键概念

### 1. 路由类型

| 前缀/语法 | 含义 | 示例 |
|-----------|------|------|
| `__root.tsx` | 根路由，所有页面的父级 | - |
| `_authenticated/` | 布局路由，子路由共享布局和前置检查 | `/dashboard`, `/wallet` |
| `(auth)/` | 路由分组，不影响 URL | `/sign-in`, `/sign-up` |
| `$section.tsx` | 动态路由参数 | `/dashboard/overview` |

### 2. 路由配置 API

```typescript
export const Route = createFileRoute('/path')({
  /** 页面加载前执行，常用于权限检查、重定向 */
  beforeLoad: ({ params, search }) => { ... },
  
  /** 校验 URL 查询参数，返回类型安全的 search 对象 */
  validateSearch: z.object({ page: z.number() }),
  
  /** 渲染的组件 */
  component: MyComponent,
  
  /** 404 时显示的组件 */
  notFoundComponent: NotFoundError,
  
  /** 出错时显示的组件 */
  errorComponent: GeneralError,
})
```

### 3. 认证流程

```
访问页面 → __root.tsx 检查系统初始化
         → _authenticated/route.tsx 检查登录状态
           → 未登录：跳转 /sign-in
           → 已登录但 session 无效：清除缓存，跳转 /sign-in
           → 已登录且 session 有效：显示页面
```

### 4. 权限等级

| 角色 | 常量 | 说明 |
|------|------|------|
| 普通用户 | `ROLE.USER` | 基本功能 |
| 管理员 | `ROLE.ADMIN` | 渠道管理、用户管理 |
| 超级管理员 | `ROLE.SUPER_ADMIN` | 系统设置 |

---

## 常用页面路径

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 未登录显示落地页，已登录显示仪表盘 |
| 登录 | `/sign-in` | 用户登录 |
| 注册 | `/sign-up` | 用户注册 |
| 仪表盘 | `/dashboard` | 数据概览、消费统计 |
| 钱包 | `/wallet` | 余额、充值、消费记录 |
| API Key | `/keys` | 管理 API 密钥 |
| 渠道 | `/channels` | 管理 AI 渠道（管理员） |
| 模型 | `/models` | 模型列表和定价 |
| 系统设置 | `/system-settings` | 系统配置（超级管理员） |
| 使用日志 | `/usage-logs` | API 调用日志 |
| 个人资料 | `/profile` | 修改个人信息 |
