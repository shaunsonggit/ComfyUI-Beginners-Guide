# ComfyUI 极简入门站点

使用 [Astro](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/) 构建的静态教学站，为已经安装 ComfyUI 的新手提供快速上手流程、可复用的工作流 JSON 以及动态图解。

---

## 目录

- [准备工作](#准备工作)
- [项目安装](#项目安装)
- [常用命令](#常用命令)
- [开发调试](#开发调试)
- [部署发布](#部署发布)
- [CMS 后台使用（Decap CMS）](#cms-后台使用decap-cms)
  - [后台入口](#后台入口)
  - [章节内容编辑](#章节内容编辑)
  - [图片与视频素材](#图片与视频素材)
  - [操作按钮](#操作按钮)
- [前端页面说明](#前端页面说明)
- [故障排查](#故障排查)
- [文件结构](#文件结构)

---

## 准备工作

- Node.js ≥ 18.17.0（建议安装最新版 LTS）。
- 包管理器推荐使用 pnpm：
  ```bash
  npm install -g pnpm
  ```
- 如需关闭匿名遥测，可在命令行设置 `ASTRO_TELEMETRY_DISABLED=1`。

---

## 项目安装

```bash
pnpm install
```

安装后会生成 `node_modules/`，后续命令均使用 pnpm。

---

## 常用命令

| 功能             | 命令          | 说明                                   |
| ---------------- | ------------- | -------------------------------------- |
| 开发模式         | `pnpm dev`    | 启动 Astro 开发服务器（默认端口 4321） |
| 静态构建         | `pnpm build`  | 输出生产包到 `dist/`                   |
| 本地预览构建产物 | `pnpm preview`| 预览 `dist/` 内容（默认端口 4321）     |
| 代码格式化       | `pnpm fmt`    | 运行 Prettier（含 `prettier-plugin-astro`） |

---

## 开发调试

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```
   浏览器访问 `http://localhost:4321/ComfyUI-Beginners-Guide/`。

2. 编辑内容：
   - 章节正文：`src/content/tutorial/*.mdx`
   - 公共组件：`src/components/`
   - 页面与样式：`src/pages/`、`src/layouts/`、`src/styles/`

3. 实时热更新：保存文件即可在浏览器看到更新结果。

> 项目在 `astro.config.mjs` 中设置了 `base: "/ComfyUI-Beginners-Guide/"`。无论开发还是部署，站点都挂在该子路径下。

---

## 部署发布

1. **GitHub Actions（推荐）**：仓库内含 `.github/workflows/deploy.yml`，推送到 `main` 时自动构建并部署到 GitHub Pages。
2. **线上地址**：`https://shaunsonggit.github.io/ComfyUI-Beginners-Guide/`
3. **手动构建**：
   ```bash
   pnpm build
   pnpm preview   # 验证 dist 内容
   ```

---

## CMS 后台使用（Decap CMS）

站点集成 [Decap CMS](https://decapcms.org/)，可在浏览器中维护章节内容。

### 后台入口

- **本地开发**：
  1. `pnpm dev` 启动页面；
  2. 另开终端运行 `npx decap-server`；
  3. 访问 `http://localhost:4321/ComfyUI-Beginners-Guide/admin/`，使用 GitHub 账号登录。

- **线上环境**：访问 `https://shaunsonggit.github.io/ComfyUI-Beginners-Guide/admin/`，使用 GitHub OAuth 登录。需预先配置 OAuth 应用并部署授权代理。

### 章节内容编辑

1. 进入 “教程章节” 集合，选择或新建章节。
2. 字段说明：
   - **标题 / 摘要 / 排序序号**：控制首页显示信息与顺序。
   - **章节主图 / 动图演示**：上传的图片或 GIF 会被拷贝到 `public/assets/uploads/`。
   - **关键词标签、学习目标、预计时间、难度、前置准备、产出物、易错提醒**：提供给首页及详情页展示。
   - **操作按钮**：配置额外 CTA（见下一节）。
   - **正文内容**：Markdown / MDX，支持嵌入组件，如 `<GifDemo />`、`<AnnotatedImage />` 等。
3. 保存后，首页和详情页均会自动读取最新内容。

### 图片与视频素材

- 上传文件默认放在 `public/assets/uploads/`，CMS 会生成 `/ComfyUI-Beginners-Guide/assets/uploads/...` 路径。
- 正文中插入图片：
  ```markdown
  ![描述文案](/ComfyUI-Beginners-Guide/assets/uploads/example.jpg)
  ```
- 插入视频：
  ```html
  <video src="/ComfyUI-Beginners-Guide/assets/uploads/demo.mp4" controls playsInline />
  ```
  或者嵌入外部 iframe（B 站 / YouTube）。

### 操作按钮

章节卡片上的按钮可在 CMS 中配置：
1. 在章节页面找到 **“操作按钮”** 列表（默认折叠）。
2. 点击 “Add 操作按钮”：
   - **按钮文案**：显示名称；
   - **链接地址**：可填 `/assets/workflows/example.json`、`tutorial/new-chapter/` 或任意外部链接；
   - **下载文件？**：勾选后前端 `<a>` 会带 `download` 属性，实现直接下载。
3. 若不添加按钮，页面只保留默认的 “阅读完整章节”。

> 注意：链接不要写 `public/...`，路径以站点根 `/ComfyUI-Beginners-Guide/` 为准。

---

## 前端页面说明

- **首页 `src/pages/index.astro`**
  - 动态遍历 `tutorial` 集合渲染所有章节。
  - CTA 按钮来自章节的 `ctaButtons` 配置。
- **章节详情 `src/pages/tutorial/[slug].astro`**
  - 读取 MDX 正文、Frontmatter 字段构成页面。
  - 页面底部资源区同样使用 `ctaButtons`。
- **侧边导航**
  - 根据章节集合动态生成，并以当前 URL 计算高亮。

---

## 故障排查

| 症状 | 可能原因 | 解决办法 |
| ---- | -------- | -------- |
| 首页图片 404 | 链接缺少 `/ComfyUI-Beginners-Guide/` 前缀，或误写 `public/...` | 在 CMS 内重新选择图片，确保路径形如 `/ComfyUI-Beginners-Guide/assets/...` |
| CMS 登录失败 | 本地未运行 `npx decap-server`，或 OAuth 未配置 | 本地启动代理；线上确认 GitHub OAuth 配置、回调地址 |
| 新增章节未显示 | 草稿未发布或页面缓存未刷新 | 在 CMS 中点击 “Publish”，刷新首页 |
| 子页面 404 | URL 未带结尾 `/` | 项目设置 `trailingSlash: "always"`，务必访问 `/tutorial/slug/` |

---

## 文件结构

```
ComfyUI 极简入门教程/
├─ public/
│  └─ assets/
│     ├─ images/                 # 静态示意图、动图
│     ├─ uploads/                # CMS 上传的素材
│     └─ workflows/              # 可下载的 JSON 工作流
├─ src/
│  ├─ components/                # 公共与 MDX 组件
│  ├─ content/                   # 章节 MDX 内容
│  ├─ layouts/                   # 布局文件（BaseLayout）
│  ├─ pages/                     # Astro 路由（主页、教程详情、CMS）
│  └─ utils/                     # 工具方法（如路径处理）
├─ public/admin/                 # Decap CMS 前端及配置
├─ docs/                         # 补充文档，如 `docs/cms.md`
├─ astro.config.mjs              # Astro 主配置（含 base 设置）
├─ package.json / pnpm-lock.yaml # 依赖与脚本
└─ tailwind.config.cjs / tsconfig.json 等
```

如需扩展更多集合、组件或部署方式，可在本 README 基础上继续补充。
