## 技术栈

---

本项目是一个现代化的 Web 应用，采用了以下技术栈：

### 核心框架
- **Next.js 15** - React 框架，提供服务器端渲染(SSR)和静态站点生成(SSG)功能
- **React 19** - 用于构建用户界面的 JavaScript 库
- **TypeScript** - 提供静态类型检查的 JavaScript 超集

### UI 组件和样式
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Radix UI** - 无样式、可访问的 UI 组件库
- **Framer Motion** - 用于创建流畅动画的库
- **Lucide React** - 精美的图标库

### 状态管理和数据获取
- **TanStack Query** - 用于服务器状态管理
- **React Hook Form** - 表单处理库
- **Zod** - TypeScript 优先的数据验证库

### 认证和安全性
- **NextAuth.js** - 完整的身份验证解决方案
- **js-cookie** - 用于处理浏览器 cookie

### 数据可视化
- **Recharts** - 基于 React 的图表库

### 开发工具
- **ESLint** - 代码质量检查
- **PostCSS** - CSS 转换工具
- **Turbopack** - 用于快速开发构建

### 其他功能
- **React Markdown** - Markdown 渲染
- **Embla Carousel** - 轮播组件
- **Next Themes** - 主题切换支持

## 项目架构

---

本项目采用 Next.js 的 App Router 架构，主要目录结构如下：

### 核心目录
- **`/app`** - 应用的主要路由和页面
  - `layout.tsx` - 全局布局组件
  - `page.tsx` - 首页组件
  - `providers.tsx` - 全局状态提供者
  - `globals.css` - 全局样式
  - `custom.css` - 自定义样式
  - 各功能模块目录：
    - `/cards` - 卡片管理相关页面
    - `/settings` - 用户设置页面
    - `/statistics` - 统计信息页面
    - `/login`, `/register` - 认证相关页面
    - more ...

- **`/components`** - 可复用的组件
  - `/ui` - 基础 UI 组件
  - `navbar.tsx` - 导航栏组件
  - `theme-toggle.tsx` - 主题切换组件
  - `markdown-preview.tsx` - Markdown 预览组件
  - `single-pricing-card.tsx` - 定价卡片组件
  - `testimonials.tsx` - 用户评价组件
  - more ...

- **`/lib`** - 工具函数和共享逻辑
  - `api.ts` - API 请求封装
  - `cookies.ts` - Cookie 处理工具
  - `utils.ts` - 通用工具函数
  - `/hooks` - 自定义 React Hooks

- **`/public`** - 静态资源文件
  - 图片、字体等静态资源

- **`/materials`** - 项目相关素材资源

### 配置文件
- `next.config.ts` - Next.js 配置
- `tailwind.config.ts` - Tailwind CSS 配置
- `tsconfig.json` - TypeScript 配置
- `eslint.config.mjs` - ESLint 配置
- `postcss.config.mjs` - PostCSS 配置
- `components.json` - UI 组件配置

### 中间件和类型定义
- `middleware.ts` - Next.js 中间件，用于请求拦截和路由保护
- `next-env.d.ts` - Next.js 类型声明文件
