# Minecraft Server 官方网站

一个功能完整的Minecraft服务器官方网站，采用前后端分离架构，具有现代化的UI设计和完善的用户系统。

## 🛠 技术栈

- **Frontend**: React + Next.js 14 + Tailwind CSS + Framer Motion
- **Backend**: NestJS + TypeORM + Swagger
- **Database**: MySQL 8.0

## 🚀 启动指南 (How to Run)

1. 确保 Docker Desktop 已启动
2. 在根目录执行：
   ```bash
   docker compose up --build
   ```
3. 等待容器启动完成（首次构建可能需要几分钟）

## 🔗 服务地址 (Services)

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Backend Swagger**: http://localhost:8000/docs
- **Database**: localhost:3306
  - 用户名: minecraft
  - 密码: minecraft123456
  - 数据库: minecraft_server

## 🧪 测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@minecraft.com | 123456 |
| 普通用户 | player1@example.com | 123456 |

## 📁 项目结构

```
taskId326/
├── docker-compose.yml      # Docker编排配置
├── README.md               # 项目说明文档
├── frontend/               # 前端项目 (Next.js)
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── app/            # 页面目录
│   │   │   ├── page.tsx              # 首页
│   │   │   ├── login/                # 登录页
│   │   │   ├── register/             # 注册页
│   │   │   ├── server-info/          # 服务器介绍
│   │   │   ├── gameplay/             # 玩法内容
│   │   │   ├── qa/                   # 常见问题
│   │   │   ├── profile/              # 个人中心
│   │   │   └── admin/                # 管理后台
│   │   ├── components/     # 组件目录
│   │   ├── lib/            # 工具函数
│   │   └── store/          # 状态管理
│   └── public/             # 静态资源
├── backend/                # 后端项目 (NestJS)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── main.ts         # 入口文件
│       ├── app.module.ts   # 主模块
│       ├── auth/           # 认证模块
│       ├── users/          # 用户模块
│       ├── news/           # 新闻模块
│       ├── qa/             # 问答模块
│       ├── server-status/  # 服务器状态模块
│       ├── leaderboard/    # 排行榜模块
│       ├── announcements/  # 公告模块
│       └── gameplay/       # 玩法模块
└── mysql/                  # 数据库
    └── init.sql            # 初始化脚本
```

## ✨ 功能特性

### 用户系统
- ✅ 用户注册（邮箱验证、密码强度检测）
- ✅ 用户登录（记住密码）
- ✅ 忘记密码/重置密码
- ✅ 个人中心
- ✅ JWT认证

### 页面功能
- ✅ 首页（服务器状态、最新公告、新闻动态、排行榜）
- ✅ 服务器介绍（IP地址、版本信息、硬件配置、发展时间线）
- ✅ 玩法内容（游戏模式分类、详细介绍）
- ✅ 常见问题（分类展示、关键词搜索）
- ✅ 管理后台（用户管理、内容管理）

### 设计特色
- ✅ Minecraft风格主题（绿色#71A600为主色调）
- ✅ 磨砂玻璃(Glassmorphism)效果
- ✅ 响应式布局（PC、平板、手机适配）
- ✅ 平滑动画过渡效果
- ✅ 深色模式设计

## 🔧 API 接口

### 认证接口
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/forgot-password` - 忘记密码
- `POST /auth/reset-password` - 重置密码
- `GET /auth/verify-email` - 邮箱验证

### 用户接口
- `GET /users/profile` - 获取当前用户信息
- `PATCH /users/profile` - 更新用户信息
- `GET /users` - 获取所有用户（管理员）

### 内容接口
- `GET /news` - 获取新闻列表
- `GET /qa` - 获取问答列表
- `GET /announcements` - 获取公告列表
- `GET /gameplay` - 获取玩法列表
- `GET /server-status` - 获取服务器状态
- `GET /leaderboard/playtime` - 获取游戏时长排行榜

## 📝 注意事项

1. 首次启动需要等待MySQL完成初始化
2. 后端依赖MySQL启动完成后才会启动
3. 如需修改端口，请同时修改docker-compose.yml和相应的环境变量
4. 数据库数据通过Docker Volume持久化存储

## 🐛 常见问题

**Q: 容器启动失败？**
A: 检查端口3000、8000、3306是否被占用

**Q: 数据库连接失败？**
A: 等待MySQL容器完全启动后重试

**Q: 前端页面白屏？**
A: 检查后端服务是否正常启动，查看浏览器控制台错误信息
