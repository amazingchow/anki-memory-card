# Anki AI

一个基于艾宾浩斯遗忘曲线的英语单词记忆应用，帮助用户高效地记忆英语单词。

## 功能特点

- 🎯 科学的记忆算法：基于艾宾浩斯遗忘曲线，智能安排复习时间
- 📝 卡片管理：创建、编辑、删除单词卡片
- 📚 批量导入：支持批量导入单词卡片
- 📊 数据统计：可视化展示学习进度和效果
- 🔒 用户认证：安全的用户注册和登录系统
- 📱 响应式设计：支持各种设备屏幕尺寸

## 技术栈

### 前端
- Next.js 14
- TypeScript
- Tailwind CSS
- Ant Design
- Ant Design Charts
- React Query
- Axios

### 后端
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication
- Pydantic

## 快速开始

### 环境要求
- Node.js 18+
- Python 3.8+
- npm 或 yarn

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/anki-memory-card.git
cd anki-memory-card
```

2. 安装后端依赖
```bash
cd api
pip install -r requirements.txt
```

3. 安装前端依赖
```bash
cd web
npm install
```

4. 启动后端服务
```bash
cd api
python run.py
```

5. 启动前端开发服务器
```bash
cd web
npm run dev
```

6. 访问应用
打开浏览器访问 http://localhost:3000

## 项目结构

```
anki-memory-card/
├── api/                    # 后端代码
│   ├── app/
│   │   ├── main.py        # FastAPI 应用主文件
│   │   ├── models.py      # 数据库模型
│   │   ├── database.py    # 数据库配置
│   │   ├── auth.py        # 认证相关
│   │   └── spaced_repetition.py  # 记忆算法
│   └── requirements.txt    # Python 依赖
│
└── web/                    # 前端代码
    ├── app/               # Next.js 应用
    ├── components/        # React 组件
    ├── lib/              # 工具函数和 hooks
    └── package.json      # Node.js 依赖
```

## 主要功能说明

### 1. 用户认证
- 用户注册：创建新账户
- 用户登录：使用邮箱和密码登录
- JWT 认证：保护 API 端点

### 2. 卡片管理
- 创建卡片：添加新的单词卡片
- 编辑卡片：修改现有卡片内容
- 删除卡片：移除不需要的卡片
- 批量导入：通过文本批量导入卡片

### 3. 复习系统
- 智能复习：基于艾宾浩斯遗忘曲线安排复习时间
- 评分系统：1-4 分评分机制
- 状态追踪：学习、复习、掌握三种状态

### 4. 数据统计
- 卡片统计：总数、已掌握、学习中、待复习
- 复习趋势：最近 30 天的复习情况
- 状态分布：各状态卡片的占比
- 评分分布：不同评分的分布情况

## API 文档

启动后端服务后，访问 http://localhost:8000/docs 查看完整的 API 文档。

### 主要 API 端点

- POST `/token` - 用户登录
- POST `/users/` - 用户注册
- GET `/cards/` - 获取所有卡片
- POST `/cards/` - 创建新卡片
- GET `/cards/{id}` - 获取单个卡片
- POST `/cards/{id}/review` - 复习卡片
- GET `/cards/due/` - 获取待复习卡片
- GET `/statistics` - 获取统计数据

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有任何问题或建议，请通过以下方式联系：

- 项目 Issues
- 电子邮件：your.email@example.com

## 致谢

- [艾宾浩斯遗忘曲线](https://en.wikipedia.org/wiki/Forgetting_curve)
- [Anki](https://apps.ankiweb.net/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Next.js](https://nextjs.org/) 