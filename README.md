<div align="center">

# 🧭 NAS 导航

**一个简洁优雅的自托管服务导航页，带后台管理，支持多设备自动同步**

[![部署状态](https://img.shields.io/badge/Cloudflare-Pages-059669?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com)
[![GitHub](https://img.shields.io/badge/GitHub-Data%20Sync-181717?style=flat-square&logo=github)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

<br>

[🚀 在线预览](https://nav.v9.cc.cd) · [✨ 功能特性](#-功能特性) · [🚀 快速部署](#-快速部署) · [📖 使用说明](#-使用说明)

<br>

> 🌐 **在线体验：[https://nav.v9.cc.cd](https://nav.v9.cc.cd)**

</div>

---

## 📸 预览

### 前台导航页

![前台导航页](screenshots/home.png)

### 后台管理 - 服务链接

![后台服务管理](screenshots/admin.png)

### 后台管理 - 站点设置（含背景自定义）

![站点设置](screenshots/settings.png)

---

## ✨ 功能特性

### 前台展示
- 🎨 **清新浅绿主题** — 明亮舒适的视觉体验
- 🖼️ **自定义背景** — 支持单色背景、图片背景，可调节透明度
- 🔍 **实时搜索** — 支持按名称、描述、URL 快速筛选
- 🏷️ **分类筛选** — 一键切换服务分类
- 🖼️ **图标支持** — 支持图片图标 URL，加载失败自动回退文字缩写
- 📱 **响应式布局** — 桌面端多列自适应，移动端完美适配
- ⏰ **实时时钟** — 顶部状态栏显示当前时间
- 🏠 **站点 Logo** — 支持自定义站点图标和 Logo
- 📋 **备案号** — 可在页脚显示备案号，点击跳转工信部

### 后台管理
- 🔐 **密码登录** — 默认密码 `admin123`，可在设置中修改
- 📝 **服务 CRUD** — 添加、编辑、删除服务链接
- 🖱️ **拖拽排序** — 服务和分类支持拖拽调整顺序
- 📂 **分类管理** — 自定义服务分类与排序
- ⚙️ **站点设置** — 自定义标题、副标题、页脚、背景、备案号等
- 💾 **数据导入导出** — 一键备份与恢复
- 🖼️ **图标上传** — 支持本地上传图标，自动压缩并上传到 GitHub 仓库
- ✅ **登录持久化** — 登录状态保存到 localStorage，刷新不丢失

### 部署与同步
- 🚀 **Cloudflare Pages** — 连接 GitHub 自动部署，全球 CDN 加速
- 🔗 **自定义域名** — 支持绑定自有域名
- 📦 **零构建** — 纯静态 HTML，无需构建工具
- 🌐 **多设备自动同步** — 通过 Cloudflare Pages Functions 代理 GitHub API，Token 存在服务端环境变量，**前端无需配置任何 Token**，换设备换浏览器自动同步
- ⚡ **Pages Functions** — 服务端代理 GitHub API，解决 CORS 和 Token 暴露问题

---

## 🚀 快速部署

### 前置准备

1. 一个 GitHub 账号
2. 一个 Cloudflare 账号（免费版即可）

### 第一步：Fork 仓库

Fork 本仓库到你的 GitHub 账号。

### 第二步：生成 GitHub Personal Access Token

1. 访问 [GitHub Token 设置页](https://github.com/settings/tokens)
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 勾选 `repo` 权限（完整仓库访问权限）
4. 点击生成，**复制保存 Token**（只显示一次）

### 第三步：在 Cloudflare Pages 部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. 选择你 Fork 的仓库，点击 **Begin setup**
4. 构建设置保持默认：
   - 框架预设：无
   - 构建命令：留空
   - 构建输出目录：留空（或 `/`）
5. 点击 **Save and Deploy**，等待首次部署完成

### 第四步：配置环境变量（关键步骤）

> ⚠️ 这一步是多设备同步的核心，必须配置！

1. 在 Cloudflare Pages 项目页面，点击 **设置** → **环境变量**
2. 点击 **添加**，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GITHUB_TOKEN` | 第二步生成的 Token | 必需，用于读写 GitHub 仓库数据 |
| `GITHUB_OWNER` | 你的 GitHub 用户名 | 可选，默认读取仓库所有者 |
| `GITHUB_REPO` | 仓库名（如 `nas-nav`） | 可选，默认 `nas-nav-private` |
| `GITHUB_BRANCH` | `main` | 可选，默认 `main` |
| `GITHUB_PATH` | `data.json` | 可选，默认 `data.json` |

3. 点击 **保存**
4. Cloudflare 会自动触发重新部署，等待部署完成

### 第五步：完成

访问你的 Pages 域名（如 `xxx.pages.dev`），即可使用。

> （可选）在 **自定义域** 中绑定你的自有域名。

---

## 📖 使用说明

### 登录后台

访问 `https://你的域名/#/admin`，输入默认密码 `admin123` 登录。

> 首次部署后建议立即在「站点设置」中修改密码。
>
> 登录状态会自动保存，刷新页面无需重新登录。

### 添加服务

1. 进入后台 → **服务链接** → 点击 **添加服务**
2. 填写服务名称、URL 地址、所属分类
3. （可选）填写图标文字（1-2 字符）或图标 URL
4. （可选）点击「上传图片」本地上传图标，自动压缩到 128×128 并上传到 GitHub
5. 点击保存，前台即时更新并自动同步

### 拖拽排序

在服务链接或分类管理页面，直接拖拽行首的六点手柄即可调整顺序，松开后自动保存并同步。

### 管理分类

1. 进入后台 → **分类管理** → 点击 **添加分类**
2. 填写分类名称
3. 拖拽调整分类顺序
4. 服务可在编辑时切换所属分类

### 自定义背景

1. 进入后台 → **站点设置** → 找到「背景设置」
2. 选择背景类型：
   - **默认（浅绿）**：使用原有的浅绿主题背景
   - **单色背景**：选择任意纯色作为背景
   - **图片背景**：输入图片 URL 或点击「上传图片」本地上传
3. 调节背景透明度（10% - 100%）
4. 点击保存设置

### 多设备同步

配置好环境变量后，**无需任何额外设置**：

- 在任意设备、任意浏览器访问站点，数据自动从 GitHub 加载
- 在后台修改内容后，自动同步到 GitHub
- 其他设备刷新页面即可看到最新内容
- 顶部状态栏显示「已同步 GitHub」表示同步正常

> 原理：前端通过 `/api/data` 端点访问 Cloudflare Pages Functions，Functions 使用服务端环境变量中的 Token 读写 GitHub 的 `data.json`，Token 永远不会暴露给前端。

### 数据备份

在后台 → **数据导入导出** 中：
- 点击 **导出 JSON** 下载当前数据备份
- 选择 JSON 文件可恢复数据

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | 原生 HTML / CSS / JavaScript（单文件，无框架） |
| 数据存储 | GitHub 仓库（data.json）+ localStorage 缓存 |
| 服务端代理 | Cloudflare Pages Functions（/api/data） |
| 部署 | Cloudflare Pages + Pages Functions |
| 图标库 | [dashboard-icons](https://github.com/walkxcode/dashboard-icons) |
| OAuth 代理 | Cloudflare Pages Functions（Device Flow，可选） |

---

## 📁 项目结构

```
nas-nav/
├── index.html              # 主页面（包含所有 CSS 和 JS）
├── data.json               # 导航数据（后台修改后自动更新）
├── logo.png                # 站点 Logo 和 favicon
├── functions/              # Cloudflare Pages Functions
│   └── api/
│       ├── data.js         # 数据代理端点（GET/PUT /api/data）
│       ├── device-code.js  # GitHub Device Flow 代理（可选）
│       └── access-token.js # GitHub Access Token 代理（可选）
├── icons/                  # 用户上传的图标（自动生成）
├── screenshots/            # 预览截图
│   ├── home.png
│   ├── admin.png
│   └── settings.png
└── README.md               # 项目说明
```

---

## 📝 默认数据

预置了 10 个常见自托管服务示例：

| 服务 | 分类 | 说明 |
|------|------|------|
| Jellyfin | 媒体娱乐 | 开源媒体服务器 |
| Nextcloud | 存储同步 | 私有云盘与协作 |
| Portainer | 系统管理 | Docker 容器管理 |
| qBittorrent | 下载工具 | BT 下载客户端 |
| Home Assistant | 系统管理 | 智能家居中枢 |
| AdGuard Home | 网络服务 | 网络广告过滤 |
| Alist | 存储同步 | 多网盘聚合挂载 |
| Nginx Proxy Manager | 网络服务 | 反向代理管理 |
| Prowlarr | 下载工具 | 索引器管理 |
| Cockpit | 系统管理 | 服务器 Web 管理 |

可在后台自由增删修改。

---

## ❓ 常见问题

**Q: 换设备后数据不同步？**
A: 检查 Cloudflare Pages 环境变量 `GITHUB_TOKEN` 是否配置正确，以及 Token 是否有 `repo` 权限。配置后需要重新部署才生效。

**Q: 后台修改后显示同步失败？**
A: 检查 Token 是否过期，或仓库是否存在。可在后台 → GitHub 配置中重新测试连接。

**Q: 可以用私有仓库吗？**
A: 可以。Fork 后在 GitHub 仓库设置中改为 Private，Cloudflare Pages 仍可正常部署和同步。

**Q: 如何修改默认密码？**
A: 登录后台 → 站点设置 → 修改管理员密码 → 保存设置。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

[MIT License](LICENSE) - 自由使用、修改和分发。

---

<div align="center">

**如果这个项目对你有帮助，别忘了给个 ⭐ Star 支持一下！**

</div>
