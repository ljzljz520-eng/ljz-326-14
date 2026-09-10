# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package.json ./

# 配置npm镜像源并安装依赖
RUN npm config set registry https://registry.npmmirror.com && \
    npm install

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 复制package.json用于生产依赖
COPY package.json ./

# 只安装生产依赖
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --omit=dev

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 8000

# 启动应用
CMD ["node", "dist/main"]
