# 山与城的回响 - 视觉小说游戏

一个基于 Vue 3 + TypeScript 的视觉小说游戏，支持移动端访问。

## 在线访问

访问地址：`https://<你的用户名>.github.io/mountain-and-city-echo/`

## 本地开发

```bash
cd web
npm install
npm run dev
```

访问 `http://localhost:3000`

## 构建部署

### 自动部署（推荐）

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages（Source 选择 GitHub Actions）
3. 每次推送到 `main` 分支会自动部署

### 手动部署

```bash
cd web
npm run build
```

构建产物在 `web/dist` 目录，可以部署到任何静态文件服务器。

## 移动端适配

- ✅ 响应式布局，适配各种屏幕尺寸
- ✅ 支持刘海屏、底部导航栏安全区域
- ✅ 触摸优化，适合手机操作
- ✅ 小米手机等安卓设备特别优化

## 功能特性

- 📖 14 章主线剧情
- 🎭 多选项选择系统
- 💝 角色羁绊系统
- 💾 自动存档/读档
- 📸 回忆相册系统
- 🗺️ 徒步地图探索
- 👥 角色图鉴系统

## 技术栈

- Vue 3 + TypeScript
- Pinia 状态管理
- Vue Router
- Vite 构建工具

## 许可证

个人学习使用，非商业项目
