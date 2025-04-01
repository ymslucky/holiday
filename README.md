# 节假日日历项目

在线地址：[https://holiday.meta-p.com](https://holiday.meta-p.com)

## 项目简介

本项目实现了一个交互式节假日日历，用户可以通过界面查看当前月份的日历，并支持通过滚轮切换月份。日历会高亮显示当天日期，并优化了移动端和桌面端的显示效果。

---

## 快速开始

### 安装依赖

首先，确保你已经安装了 Node.js 和 npm/yarn/pnpm/bun 等包管理工具。然后在项目根目录下运行以下命令安装依赖：

### 启动开发服务器

运行以下命令启动开发服务器：

打开浏览器访问 [http://localhost:3000](http://localhost:3000)，即可查看运行中的应用。

---

## 功能说明

1. **实时时间更新**  
   页面会每分钟自动更新当前时间，并同步刷新日历状态。

2. **月份切换**
    - 用户可以通过鼠标滚轮上下滚动切换月份。
    - 切换时，日历会平滑更新显示内容。

3. **今日高亮**  
   当前月份的日历中，今天的日期会以蓝色背景高亮显示。

4. **响应式设计**  
   日历支持多种屏幕尺寸（移动端、平板、桌面端），并根据屏幕大小动态调整格子大小。

5. **字体优化**  
   项目使用了 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动加载并优化字体。

---

## 项目结构

- **`src/app/page.tsx`**  
  主页面组件，包含日历的核心逻辑和状态管理。

- **`src/component/Calendar.tsx`**  
  日历组件，负责渲染日历的 UI 和处理日期显示逻辑。

---

## 部署

推荐使用 [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 部署你的 Next.js 应用。

更多部署细节，请参考 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。

---

## 开发资源

如果你想了解更多关于 Next.js 的内容，可以参考以下资源：
- [Next.js 官方文档](https://nextjs.org/docs) - 学习 Next.js 的特性和 API。
- [Next.js 互动教程](https://nextjs.org/learn) - 一个交互式的 Next.js 教程。

如果对项目有任何问题或建议，欢迎提交 issue 或 PR！
