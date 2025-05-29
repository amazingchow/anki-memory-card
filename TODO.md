制作一个背英文单词的网页应用，提供制作 Anki 记忆卡功能，也支持批量导入单词，同时也支持生成 Anki 记忆卡，并提供一套科学的基于艾宾浩斯遗忘曲线的记忆算法帮助用户记忆单词。希望你实现的网页应用是一个简洁美观的响应式页面。

* 前端技术栈：Next.js、Tailwind CSS、Shadcn UI、Lucide Icons、React、TypeScript等
* 后端技术栈：FastAPI、SQLAlchemy、SQLite等


* 实现邮件通知发送功能
* 实现浏览器推送通知功能
* 实现定时提醒功能

在注册页面点击【Create account】按钮后
1. 前端弹窗显示“激活邮件已发送到您的邮箱，请查收”，悬停显示10s
2. 后端在 h_create_user_endpoint 注册处理器方法中基于RESEND SDK发送一份注册邮件给用户
