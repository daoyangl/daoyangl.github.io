# AGENTS.md

面向 AI 编程助手的项目说明（保持中文）。

## 目标

用直观、简洁的方式展示个人简介与经历，面向同事、学生与工业界同行。

## 技术栈

- 静态站点，GitHub Pages 部署（`daoyangl.github.io`）
- 纯 HTML / CSS / JS，无构建工具、无包管理器
- 内容以 `data/*.json` 与 `posts/*.md` 驱动，便于增改

## 目录结构

| 路径 | 作用 |
|------|------|
| `index.html` | 主页 |
| `archive.html` | 全部 posts 列表 |
| `research.html` | 研究成果列表 |
| `about.html` | 关于我 |
| `post.html` | 单篇 post 阅读页（`?slug=...`） |
| `css/tokens.css` | **可调参数**（颜色、字号、宽度、间距，带注释） |
| `css/style.css` | 页面样式 |
| `js/site.js` | 主题切换、导航高亮、内容渲染 |
| `data/home.json` | 主页介绍、社交链接 |
| `data/posts.json` | posts 索引 |
| `data/research.json` | 论文 / 研究列表 |
| `data/about.json` | What I do / 经历 / 教育 |
| `posts/*.md` | 每篇文章一个 Markdown 文件 |
| `assets/` | 头像、favicon 等静态资源 |

## 页面要求

### 主页（home）

- 简短个人介绍 + 社交媒体链接（数据来自 `data/home.json`）
- 最近最多 10 篇 posts（标题 + 日期）
- 可选：news、近期 research（按需显示）

### Archive

- 全部 posts，按年份分组，新到旧
- 每篇文章对应 `posts/<slug>.md`，并在 `data/posts.json` 登记

### Research

- 研究 / 论文列表，按年份分组
- 风格参考同上 archives 列表
- 数据来自 `data/research.json`

### About

分三块（数据来自 `data/about.json`）：

1. What I do（文字介绍）
2. Experience（职位 / 经历时间线）
3. Education（教育经历）

## 设计原则

1. 背景偏淡灰或淡黄，长时间阅读不累眼
2. 界面简洁，不做过度装饰
3. 所有页面顶部有导航：
   - 左侧：姓名 + 深浅色切换
   - 右侧：home / archive / research / about
4. 导航与正文同色一体；左右分别对齐正文栏的左右边界（概念对齐，不画竖线）
5. 尺寸、字号、间距等优先改 `css/tokens.css`

## 代码约定

- 代码简洁，结构清晰
- 改内容优先改 `data/` 与 `posts/`，少改 HTML 模板
- 不要引入 React / Vue / npm 构建，除非明确要求
- 本地预览需用静态服务器（`file://` 下 `fetch` 会失败）：

```powershell
cd d:\daoyang\daoyangl.github.io
python -m http.server 8080
```

然后打开 http://127.0.0.1:8080/

## 常见修改

### 改主页介绍

编辑 `data/home.json`（`name`、`bio`、`email`、`social` 等）。

### 新增一篇 post

1. 新建 `posts/your-slug.md`（含 front matter：`title`、`date`）
2. 在 `data/posts.json` 增加对应 `slug` / `title` / `date`

### 改研究列表

编辑 `data/research.json`。

### 改 About

编辑 `data/about.json`（`whatIDo`、`experience`、`education`）。

### 调视觉参数

编辑 `css/tokens.css`。

## 部署

推送到 GitHub 的 `main` 后，由 GitHub Pages 自动发布：

```powershell
git add -A
git commit -m "说明本次修改"
git push origin main
```

站点地址：https://daoyangl.github.io/
