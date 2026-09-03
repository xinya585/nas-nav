<div align="center">

# 🧭 NAS 导航

**一个简洁优雅的自托管服务导航页，带后台管理，支持多设备自动同步**

[![部署状态](https://img.shields.io/badge/Cloudflare-Pages-059669?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com)
[![GitHub](https://img.shields.io/badge/GitHub-Data%20Sync-181717?style=flat-square&logo=github)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

<br>

[🚀 在线预览](https://nav.v9.cc.cd) · [✨ 功能特性](#-功能特性) · [🚀 部署教程](#-部署教程) · [⚙️ 工作原理](#️-工作原理) · [📖 使用说明](#-使用说明)

<br>

> 🌐 **在线体验：[https://nav.v9.cc.cd](https://nav.v9.cc.cd)**

</div>

---

## 📸 预览

### 前台导航页

![前台导航页](screenshots/home.png)

### 后台管理 - 服务链接

![后台服务管理](screenshots/admin.png)

### 后台管理 - 站点设置（含背景自定义、Logo 更换）

![站点设置](screenshots/settings.png)

---

## ✨ 功能特性

### 前台展示
- 🎨 **清新浅绿主题** — 明亮舒适的视觉体验
- 🖼️ **自定义背景** — 支持单色背景、图片背景，可调节透明度（10%-100%）
- 🖼️ **自定义 Logo** — 后台上传 Logo 图片，立即生效，同步更新 favicon
- 🔍 **实时搜索** — 支持按名称、描述、URL 快速筛选
- 🏷️ **分类筛选** — 一键切换服务分类
- 🖼️ **图标支持** — 支持图片图标 URL，加载失败自动回退文字缩写
- 📝 **智能卡片** — 有描述时显示名称+描述，无描述时只显示名称并居中放大
- 📱 **响应式布局** — 桌面端多列自适应（自动换行），移动端完美适配
- ⚡ **秒开无闪烁** — 刷新页面立即显示缓存数据，后台静默更新，告别默认状态闪烁
- ⏰ **实时时钟** — 顶部状态栏显示当前时间
- 🌍 **来访 IP 显示** — 时钟旁显示访客 IP 地址
- 📋 **备案号** — 可在页脚显示备案号，点击跳转工信部

### 后台管理
- 🔐 **密码登录** — 默认密码 `admin123`，可在设置中修改
- ✅ **登录持久化** — 登录状态保存到 localStorage，刷新不丢失
- 📝 **服务 CRUD** — 添加、编辑、删除服务链接
- 🔍 **分类筛选** — 后台服务列表支持按分类筛选，每页 10 条，自动分页
- 🖱️ **拖拽排序** — 服务和分类支持拖拽调整顺序，松开自动保存
- 📂 **分类管理** — 自定义服务分类与排序
- ⚙️ **站点设置** — 自定义标题、副标题、页脚、背景、Logo、备案号等
- 💾 **数据导入导出** — 一键备份与恢复（JSON 格式）
- 🖼️ **图标上传** — 支持本地上传图标，自动压缩到 128×128 并保存
- 🏠 **返回首页** — 后台侧边栏一键返回首页，新标签页打开不影响后台
- 🔗 **GitHub 配置** — 可手动配置 Token，用于图标上传等高级功能

### 部署与运维
- 🚀 **Cloudflare Pages** — 连接 GitHub 自动部署，全球 CDN 加速
- 🔗 **自定义域名** — 支持绑定自有域名
- 📦 **零构建** — 纯静态 HTML，无需构建工具，无需 Node.js
- 🌐 **多设备自动同步** — 通过 Cloudflare Pages Functions 代理 GitHub API，Token 存在服务端环境变量，**前端无需配置任何 Token**，换设备换浏览器自动同步
- ⚡ **Pages Functions** — 服务端代理 GitHub API，解决 CORS 和 Token 暴露问题
- 🧹 **自动清理部署** — GitHub Actions 每天自动清理 Cloudflare Pages 旧部署，只保留最新 3 个

---

## 🚀 部署教程

> 全程约 10 分钟，免费即可完成。

### 前置准备

| 需要 | 说明 |
|------|------|
| GitHub 账号 | 免费注册：https://github.com |
| Cloudflare 账号 | 免费注册：https://dash.cloudflare.com/sign-up |
| （可选）自有域名 | 用于绑定自定义访问地址 |

---

### 第一步：Fork 仓库到你的 GitHub

1. 打开本仓库页面
2. 点击右上角 **Fork** 按钮
3. 填写仓库名称（如 `nas-nav`），点击 **Create fork**
4. 等待 Fork 完成，你会拥有一份完全独立的副本

> 💡 **建议使用私有仓库**：Fork 完成后，进入仓库 **Settings** → **General** → 拉到最底部 **Danger Zone** → **Change repository visibility** → 改为 **Private**。这样你的导航数据（data.json）不会公开。

---

### 第二步：生成 GitHub Personal Access Token

这个 Token 用于 Cloudflare Pages Functions 读写你仓库中的 `data.json` 数据文件。

1. 访问 [GitHub Token 设置页](https://github.com/settings/tokens)
2. 点击 **Generate new token** → 选择 **Generate new token (classic)**
3. 填写：
   - **Note**：`nas-nav-sync`（随便填，方便识别）
   - **Expiration**：建议选 `No expiration`（永不过期）
   - **Select scopes**：勾选 `repo`（完整仓库访问权限，包含所有子项）
4. 点击页面底部 **Generate token**
5. **立即复制保存 Token**（格式如 `ghp_xxxxxxxxxxxx`，只显示一次，关闭页面后无法再查看）

> ⚠️ Token 非常重要，相当于你的 GitHub 密码，不要泄露给他人。

---

### 第三步：在 Cloudflare Pages 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单点击 **Workers & Pages**
3. 点击 **Create** → 选择 **Pages** 标签
4. 点击 **Connect to Git**
5. 首次使用需要授权 Cloudflare 访问你的 GitHub：
   - 点击 **Connect GitHub**
   - 选择 **All repositories** 或只选择你 Fork 的 `nas-nav` 仓库
   - 点击 **Install & Authorize**
6. 回到 Cloudflare，选择你 Fork 的仓库，点击 **Begin setup**
7. 构建设置（**全部保持默认即可**）：
   - **Project name**：项目名称，会作为默认域名（如 `nas-nav.pages.dev`）
   - **Production branch**：`main`
   - **Framework preset**：`None`
   - **Build command**：留空
   - **Build output directory**：留空
8. 点击 **Save and Deploy**
9. 等待首次部署完成（约 30 秒），点击 **Continue to project**

---

### 第四步：配置环境变量（关键步骤）

> ⚠️ 这一步是多设备自动同步的核心，**必须配置**，否则换设备数据不会同步。

1. 在 Cloudflare Pages 项目页面，点击顶部 **设置（Settings）** 标签
2. 左侧菜单点击 **环境变量（Environment variables）**
3. 在 **Production** 区域，点击 **Add** 逐个添加以下变量：

| 变量名 | 值 | 是否必需 | 说明 |
|--------|-----|----------|------|
| `GITHUB_TOKEN` | 第二步生成的 Token（`ghp_xxxx...`） | ✅ 必需 | 用于读写 GitHub 仓库数据 |
| `GITHUB_OWNER` | 你的 GitHub 用户名 | ✅ 必需 | 如 `xinya585` |
| `GITHUB_REPO` | 仓库名 | ✅ 必需 | 如 `nas-nav` 或 `nas-nav-private` |
| `GITHUB_BRANCH` | `main` | ⭕ 可选 | 默认 `main` |
| `GITHUB_PATH` | `data.json` | ⭕ 可选 | 默认 `data.json` |

4. 每个变量添加后点击 **Add** 确认
5. 全部添加完成后，Cloudflare 会**自动触发重新部署**
6. 等待部署完成（在 **Deployments** 标签可查看状态）

---

### 第五步：验证部署

1. 访问你的 Pages 域名（如 `https://nas-nav.pages.dev`）
2. 应该能看到导航页，顶部显示「已同步 GitHub」绿色状态
3. 访问 `https://你的域名/#/admin`，输入默认密码 `admin123` 登录后台
4. 尝试添加一个服务，保存后刷新页面，数据应该保留

> ✅ 如果顶部显示「已同步 GitHub」，说明环境变量配置正确，多设备同步已生效。
>
> ❌ 如果显示「本地模式」，说明环境变量配置有误，请检查第四步。

---

### 第六步（可选）：绑定自定义域名

1. 在 Cloudflare Pages 项目页面，点击 **自定义域（Custom domains）**
2. 点击 **Set up a custom domain**
3. 输入你的域名（如 `nav.example.com`），点击 **Continue**
4. 如果域名已在 Cloudflare 托管，会自动配置 DNS；否则需要按提示添加 CNAME 记录
5. 等待 SSL 证书签发（约 1-2 分钟），即可通过自定义域名访问

---

### 第七步（强烈推荐 ⚠️ 必看）：配置自动清理部署历史

> ## ⚠️⚠️⚠️ 重要提醒 ⚠️⚠️⚠️
>
> **这个功能绝对不能省略！**
>
> 本项目的工作原理是：**你在后台修改任何内容（哪怕只是一个标点符号），系统都会自动更新 GitHub 仓库的 `data.json`，而 GitHub 仓库的每次更新都会触发 Cloudflare Pages 的一次全新部署。**
>
> 这意味着：
> - 你每添加一个服务 → 触发一次部署
> - 你每修改一个标题 → 触发一次部署
> - 你每调整一次排序 → 触发一次部署
> - 你每换一个背景图 → 触发一次部署
>
> **一天修改十几次，一个月就是几百次部署记录！** Cloudflare Pages 会保留全部部署历史，不清理的话会堆积成千上万条，既影响页面加载速度，也可能触发 Cloudflare 的部署数量限制。
>
> **所以请务必完成以下配置，让系统每天自动清理旧部署，只保留最新 3 个。**

Cloudflare Pages 会保留每次部署的记录，时间长了会积累很多。本项目内置了 GitHub Actions 工作流，每天自动清理旧部署，只保留最新 3 个。

1. 首先创建 Cloudflare API Token：
   - 访问 [Cloudflare API Tokens 页面](https://dash.cloudflare.com/profile/api-tokens)
   - 点击 **Create Token** → **Create Custom Token**
   - **Token name**：`nas-nav-cleanup`
   - **Permissions**：选择 `Account` → `Cloudflare Pages` → `Edit`
   - **Account Resources**：选择你的账户
   - 点击 **Continue to summary** → **Create Token**
   - 复制保存 Token（格式如 `cfut_xxxx...`）

2. 在 GitHub 仓库配置 Secrets：
   - 进入你的仓库 → **Settings** → **Secrets and variables** → **Actions**
   - 点击 **New repository secret**，逐个添加：

| Secret 名称 | 值 |
|-------------|-----|
| `CLOUDFLARE_API_TOKEN` | 上面创建的 Cloudflare API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID（在 Pages 项目设置页面可找到） |
| `CLOUDFLARE_PROJECT_NAME` | Cloudflare Pages 项目名（如 `nas-nav`） |

3. 配置完成后，workflow 会在每天 **北京时间 8:00** 自动执行，也可以在 **Actions** 页面手动触发。

---

## ⚙️ 工作原理

### 数据同步流程

```
用户浏览器                    Cloudflare Pages              GitHub 仓库
    │                              │                           │
    │  1. 访问站点                  │                           │
    │ ──────────────────────────>  │                           │
    │                              │  2. Functions 读取 data.json │
    │                              │ ─────────────────────────>  │
    │                              │  3. 返回 JSON 数据          │
    │                              │ <─────────────────────────  │
    │  4. 渲染页面，显示「已同步」   │                           │
    │ <──────────────────────────  │                           │
    │                              │                           │
    │  5. 后台修改数据，点击保存     │                           │
    │ ──────────────────────────>  │                           │
    │                              │  6. Functions 写入 data.json │
    │                              │ ─────────────────────────>  │
    │                              │  7. 返回成功                │
    │                              │ <─────────────────────────  │
    │  8. 显示保存成功              │                           │
    │ <──────────────────────────  │                           │
```

**核心设计**：
- 前端不直接调用 GitHub API，而是通过 `/api/data` 端点访问 Cloudflare Pages Functions
- Functions 使用服务端环境变量中的 `GITHUB_TOKEN` 读写 GitHub 的 `data.json`
- Token 永远不会暴露给前端，安全可靠
- 换设备、换浏览器无需任何配置，自动从 GitHub 加载最新数据

> 💡 **注意**：第 6 步「Functions 写入 data.json」会更新 GitHub 仓库，而 GitHub 仓库的每次更新都会**自动触发 Cloudflare Pages 的一次全新部署**。因此后台的每一次保存操作都会产生一条新的部署记录，**自动清理部署历史的功能必不可少**（详见部署教程第七步）。

### 自动清理部署流程

```
GitHub Actions（每天 8:00）
    │
    │  1. 调用 Cloudflare API 列出所有部署
    │ ──────────────────────────────────────>  Cloudflare API
    │                                          │
    │  2. 按时间排序，保留最新 3 个             │
    │ <──────────────────────────────────────  │
    │                                          │
    │  3. 逐个删除其余旧部署                    │
    │ ──────────────────────────────────────>  Cloudflare API
    │                                          │
    │  4. 完成，输出删除报告                    │
    │ <──────────────────────────────────────  │
```

### 文件结构说明

```
nas-nav/
├── index.html                  # 主页面（包含所有 CSS 和 JS，单文件应用）
├── data.json                   # 导航数据（后台修改后自动更新，存在 GitHub）
├── logo.png                    # 默认站点 Logo 和 favicon
├── functions/                  # Cloudflare Pages Functions（服务端代码）
│   └── api/
│       ├── data.js             # 数据代理端点（GET 读取 / PUT 写入 /api/data）
│       ├── device-code.js      # GitHub Device Flow 代理（可选，用于获取 Token）
│       └── access-token.js     # GitHub Access Token 代理（可选）
├── .github/
│   └── workflows/
│       └── cleanup-deployments.yml  # 自动清理 Cloudflare Pages 旧部署
├── icons/                      # 用户上传的图标（自动生成，base64 内嵌在 data.json 中）
├── screenshots/                # README 预览截图
│   ├── home.png
│   ├── admin.png
│   └── settings.png
└── README.md                   # 项目说明文档
```

---

## 📖 使用说明

### 登录后台

访问 `https://你的域名/#/admin`，输入默认密码 `admin123` 登录。

> 🔐 首次部署后建议立即在「站点设置」中修改密码。
>
> ✅ 登录状态会自动保存到 localStorage，刷新页面无需重新登录。
>
> 🚪 点击后台侧边栏底部的「退出登录」可清除登录状态。

### 添加服务

1. 进入后台 → **服务链接** → 点击 **添加服务**
2. 填写：
   - **服务名称** *（必填）*：显示在卡片上的名称
   - **URL 地址** *（必填）*：点击卡片跳转的链接
   - **所属分类**：选择分类
   - **图标文字**：1-2 个字符，无图片图标时显示
   - **图标 URL**：图标图片地址，优先显示
   - **图标颜色**：图标文字背景色（默认纯白色）
   - **描述**：服务说明，显示在名称下方。*留空时前台卡片只显示服务名称并居中放大，不显示网址*
3. （可选）点击「上传图片」本地上传图标，自动压缩到 128×128
4. 点击保存，前台即时更新并自动同步到 GitHub

### 后台筛选与分页

后台服务链接页面支持：
- **分类筛选**：顶部下拉菜单可按分类筛选服务，默认显示全部分类
- **自动分页**：每页显示 10 个服务，超过时自动显示「上一页 / 下一页」按钮
- **计数显示**：显示当前筛选结果的服务总数

### 拖拽排序

在服务链接或分类管理页面，直接拖拽行首的 **六点手柄**（⋮⋮）即可调整顺序，松开后自动保存并同步。

### 管理分类

1. 进入后台 → **分类管理** → 点击 **添加分类**
2. 填写分类名称
3. 拖拽调整分类顺序
4. 服务可在编辑时切换所属分类

### 更换站点 Logo

1. 进入后台 → **站点设置** → 找到「站点 Logo」区域
2. 点击 **上传 Logo** 选择本地图片（建议正方形）
3. 图片自动压缩到 256×256，立即生效
4. 同时更新：页面 Logo、后台 Logo、登录页 Logo、浏览器 favicon
5. 点击 **恢复默认** 可还原为默认 Logo

> 💡 Logo 以 base64 格式保存在 data.json 中，换设备自动同步，无需等待重新部署。

### 自定义背景

1. 进入后台 → **站点设置** → 找到「背景设置」
2. 选择背景类型：
   - **默认（浅绿）**：使用原有的浅绿主题背景
   - **单色背景**：选择任意纯色作为背景
   - **图片背景**：输入图片 URL 或点击「上传图片」本地上传（自动压缩）
3. 调节背景透明度（10% - 100%）
4. 点击保存设置

### 多设备同步

配置好环境变量后，**无需任何额外设置**：

- 在任意设备、任意浏览器访问站点，数据自动从 GitHub 加载
- 在后台修改内容后，自动同步到 GitHub
- 其他设备刷新页面即可看到最新内容
- 顶部状态栏显示「已同步 GitHub」表示同步正常

> 🔧 如果显示「本地模式」，说明 Cloudflare 环境变量配置有误，请参考部署教程第四步检查。

### 数据备份

在后台 → **数据导入导出** 中：
- 点击 **导出 JSON** 下载当前数据备份（包含所有服务、分类、设置）
- 选择 JSON 文件可恢复数据（会覆盖当前所有数据）

### 更新代码

当上游仓库有新版本时，可以通过以下方式更新：

1. **方式一：手动下载替换**
   - 访问上游仓库下载最新的 `index.html` 和 `functions/` 目录
   - 上传到你自己的仓库覆盖对应文件
   - Cloudflare Pages 会自动部署

2. **方式二：Git 命令行**
   ```bash
   # 添加上游仓库
   git remote add upstream https://github.com/xinya585/nas-nav.git
   
   # 拉取最新代码
   git fetch upstream
   git merge upstream/main
   
   # 推送到你的仓库
   git push origin main
   ```

> ⚠️ 更新代码时注意不要覆盖你的 `data.json`（你的导航数据），建议更新前先导出备份。

3. **方式三：自动同步（推荐 ⭐）**

   本项目内置了自动同步 workflow，配置后**每天自动从上游拉取最新代码**，无需手动操作。

   **工作原理：**
   - 每天北京时间 9:00 自动执行
   - 从上游仓库 `xinya585/nas-nav` 拉取最新代码
   - **智能跳过** `data.json`（你的导航数据）和 `icons/` 目录（你上传的图标）
   - 只同步代码文件：`index.html`、`functions/`、`logo.png`、`README.md` 等
   - 自动提交到你的仓库，Cloudflare Pages 自动部署

   **使用方法：**

   1. Fork 本仓库后，确认 `.github/workflows/sync-from-upstream.yml` 文件存在
   2. 进入仓库 **Settings** → **Actions** → **General**
   3. 在 **Workflow permissions** 中选择 **Read and write permissions**
   4. 点击 **Save** 保存（这一步必须做，否则 workflow 没有推送权限）
   5. 进入 **Actions** 页面，找到「自动同步上游代码」workflow
   6. 点击 **Run workflow** 手动触发一次，验证是否正常工作

   **同步的文件：**
   | 文件/目录 | 说明 |
   |-----------|------|
   | `index.html` | 主页面代码 |
   | `functions/` | Cloudflare Pages Functions |
   | `logo.png` | 默认 Logo |
   | `README.md` | 项目文档 |
   | `.github/workflows/cleanup-deployments.yml` | 自动清理部署 workflow |

   **不同步的文件（保护你的数据）：**
   | 文件/目录 | 说明 |
   |-----------|------|
   | `data.json` | 你的导航数据（服务、分类、设置、密码等） |
   | `icons/` | 你上传的图标文件 |
   | `screenshots/` | 截图文件 |

   > 💡 如果上游更新了你想立即获取，可以随时在 Actions 页面手动触发同步，不需要等到每天 9:00。

   > ⚠️ 自动同步只会更新代码文件，**不会修改你的导航数据**。但如果上游的代码结构发生重大变化（如 data.json 格式变更），可能需要手动迁移数据，届时会在 Release 中说明。

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | 原生 HTML / CSS / JavaScript（单文件，无框架，无构建） |
| 数据存储 | GitHub 仓库（data.json）+ localStorage 本地缓存 |
| 服务端代理 | Cloudflare Pages Functions（/api/data） |
| 部署 | Cloudflare Pages + Pages Functions |
| CI/CD | GitHub Actions（自动清理部署） |
| 图标库 | [dashboard-icons](https://github.com/walkxcode/dashboard-icons)（CDN 引用） |
| 字体 | 思源黑体（Noto Sans SC，妙搭 CDN） |

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

**Q: 换设备后数据不同步，显示「本地模式」？**
A: 检查 Cloudflare Pages 环境变量 `GITHUB_TOKEN`、`GITHUB_OWNER`、`GITHUB_REPO` 是否配置正确，以及 Token 是否有 `repo` 权限。配置后需要重新部署才生效。可访问 `https://你的域名/api/data` 验证是否返回 JSON 数据。

**Q: 后台修改后显示同步失败？**
A: 检查 Token 是否过期，或仓库是否存在。可在后台 → GitHub 配置中重新测试连接。也可以直接在 GitHub 仓库查看 `data.json` 是否被更新。

**Q: 可以用私有仓库吗？**
A: 可以。Fork 后在 GitHub 仓库设置中改为 Private，Cloudflare Pages 仍可正常部署和同步。推荐使用私有仓库保护你的导航数据。

**Q: 如何修改默认密码？**
A: 登录后台 → 站点设置 → 修改管理员密码 → 保存设置。

**Q: 上传的图标存在哪里？**
A: 图标以 base64 格式内嵌在 `data.json` 中，同时也会上传到 GitHub 仓库的 `icons/` 目录。换设备自动同步，无需额外配置。

**Q: Cloudflare Pages 部署历史太多怎么办？**
A: 参考部署教程第七步配置 GitHub Actions 自动清理，每天自动保留最新 3 个部署。也可以在 Cloudflare Pages 项目的 **Deployments** 页面手动删除。

**Q: 修改 Logo 后需要重新部署吗？**
A: 不需要。Logo 以 base64 保存在 data.json 中，上传后立即生效，所有设备刷新即可看到。

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
