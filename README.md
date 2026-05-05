
# Movie System - 电影管理系统

一个基于 Vite + React 构建的现代化电影管理系统，提供电影浏览、搜索、评价、收藏和管理等功能。

## 🚀 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 6
- **路由**: React Router DOM 6
- **UI 组件库**: Radix UI + Tailwind CSS
- **状态管理**: TanStack React Query
- **表单处理**: React Hook Form + Zod
- **后端服务**: Base44 SDK
- **动画效果**: Framer Motion
- **数据可视化**: Recharts

### 主要依赖

- **@radix-ui/react** - 无障碍 UI 组件库
- **lucide-react** - 现代图标库
- **framer-motion** - 流畅动画效果
- **recharts** - 数据可视化图表
- **@tanstack/react-query** - 服务端状态管理
- **react-hook-form** - 高性能表单处理
- **zod** - TypeScript 优先的模式验证
- **class-variance-authority** - 样式变体管理
- **tailwindcss** - 原子化 CSS 框架
- **@base44/sdk** - 后端服务集成

## 📋 前置要求

- Node.js >= 16.x
- npm >= 8.x 或 yarn >= 1.22.x

## 🛠️ 安装

克隆项目后，安装依赖：
或使用 yarn：

## 🏃 运行开发服务器

应用将在 `http://localhost:5173` 上运行（端口可能根据可用性自动调整）

## 📦 构建生产版本

构建输出将位于 `dist/` 目录中。


## 📁 项目结构

## 🎯 核心组件

### MovieCard
电影卡片组件，展示电影海报、标题、评分等基本信息。

### SearchBar
搜索栏组件，提供搜索、类型筛选和排序功能。

### StarRating
星级评分组件，支持交互式评分显示。

### MovieFormDialog
电影表单对话框，用于添加和编辑电影信息。

## 🌐 环境变量配置

在项目根目录创建 `.env` 文件，配置 Base44 应用参数：


