# AGENTS.md

AI 助手与协作者说明（中文）。

## 目标

用简洁、易读的方式展示个人简介与经历。

## 仓库结构

```
daoyangl.github.io/
├── index.html / archive.html / research.html / about.html / post.html
├── css/
│   ├── tokens.css      # 可调参数（颜色、字号、间距）
│   └── style.css
├── js/
│   ├── site.js         # 站点逻辑
│   └── vendor/
│       └── marked.min.js   # Markdown 渲染（本地，避免 CDN 延迟）
├── data/
│   ├── home.json / posts.json / research.json / about.json
├── posts/
│   └── <slug>/
│       ├── index.md    # 正文
│       └── …           # 图片等资源
├── assets/
├── .nojekyll           # 关闭 Jekyll，保证 md 原样发布
└── AGENTS.md
```

## 页面

| 页面 | 内容来源 |
|------|----------|
| home | `data/home.json` + 最近 posts |
| archive | `data/posts.json` |
| research | `data/research.json` |
| about | `data/about.json` |
| post | `posts/<slug>/index.md` |

## 设计

- 淡灰 / 淡黄背景，适合长时间阅读
- 界面简洁；导航：左姓名+主题切换，右 home / archive / research / about
- 视觉参数优先改 `css/tokens.css`

## 新增一篇 post

1. 建文件夹 `posts/my-slug/`，写入 `index.md`（front matter 含 `title`、`date`；标题含冒号时请加引号）
2. 图片放同目录，正文用 `![alt](image.png)`
3. 在 `data/posts.json` 增加同名 `slug` 条目

## 本地预览

```powershell
python -m http.server 8080
```

打开 http://127.0.0.1:8080/（不要用 `file://`）

## 部署

推送到 `main` 后由 GitHub Pages 发布：https://daoyangl.github.io/
