# 项目说明

## 1. 项目概述
“ComfyUI小白入门” 是一个使用 Astro 构建的静态教学网站，面向已安装 ComfyUI 的新手用户。站点聚焦于核心概念速览、文生图实战操作、社区工作流复用三大主题，配套动图、标注截图以及可下载的 JSON 工作流示例，帮助用户快速掌握高频工作流搭建方法。

## 2. 环境准备与安装
- Node.js 版本：≥ 18.17.0（见 `package.json#engines`）。
- 推荐使用 [pnpm](https://pnpm.io/) 作为包管理器：`npm install -g pnpm`（仅首次需要）。
- 可选环境变量：
  - `ASTRO_TELEMETRY_DISABLED=1`（关闭 Astro 匿名遥测）。
  - 如需扩展自定义变量，请创建 `.env` 或 `.env.local`（已在 `.gitignore` 中忽略）。

安装依赖：
```bash
pnpm install
```

## 3. 常用命令（pnpm）
| 功能 | 命令 | 说明 |
| ---- | ---- | ---- |
| 启动开发服务器 | `pnpm dev` | 启动 Astro Dev Server（默认端口 4321，支持热更新）。 |
| 生产构建 | `pnpm build` | 输出静态文件至 `dist/`。 |
| 本地预览构建产物 | `pnpm preview` | 基于 `dist/` 启动只读预览服务。 |
| 代码格式化 | `pnpm fmt` | 运行 Prettier（含 `prettier-plugin-astro`）。 |

## 4. 目录结构与路由
```
ComfyUI 极简入门教程/
├─ public/                     # 静态资源与 CMS 配置
│  ├─ admin/                   # Decap CMS 前端入口与 config.yml
│  └─ assets/
│     ├─ images/               # 教程插图、动图（初始素材）
│     ├─ workflows/            # 可下载的 ComfyUI 工作流 JSON
│     └─ uploads/              # CMS 上传的图片 / 视频 / 其他静态文件
├─ docs/                       # 补充文档（如 docs/cms.md）
├─ scripts/
│  └─ generate-media.cjs       # 生成示意图与 GIF 的 Node 脚本
├─ src/
│  ├─ components/              # 通用组件与 MDX 组件
│  ├─ content/                 # 教程章节（MDX）及 `config.ts` 内容集合定义（含 `ctaButtons` 字段）
│  ├─ layouts/                 # 页面布局（`BaseLayout.astro`）
│  ├─ pages/                   # Astro 路由：主页、教程详情、CMS 后台入口等
│  │  └─ admin/                # `/admin/` 页面（加载 Decap CMS 脚本）
│  ├─ styles/                  # 全局样式与 Tailwind 入口
│  └─ utils/                   # 辅助方法（如 `paths.ts` 处理 base 前缀）
├─ .astro/                     # Astro 构建缓存（自动生成）
├─ dist/                       # `pnpm build` 后的静态输出
├─ README.md                   # 使用手册与操作说明
├─ astro.config.mjs            # Astro 配置（集成 Tailwind、MDX，设置 `base`）
├─ tailwind.config.cjs         # Tailwind 主题及扫描路径
├─ postcss.config.cjs          # PostCSS / Autoprefixer 配置
├─ package.json                # 项目信息、脚本、依赖
├─ pnpm-lock.yaml              # 依赖锁定
└─ tsconfig.json               # TypeScript/IDE 提示配置
```

- 前端目录：`src/`（Astro + Tailwind + MDX）。
- 后端目录：本项目为纯静态站点，无后端代码与服务器运行时。

### 页面路由
| 路径 | 描述 | 数据来源 |
| ---- | ---- | -------- |
| `/` | 首页，动态展示所有教程章节摘要与资源下载 | `getCollection("tutorial")`（按 `order` 排序） |
| `/tutorial/[slug]/` | 章节详情页面（示例：`/tutorial/core-concepts/`） | `src/content/tutorial/*.mdx` 动态生成 |
| `/admin/` | Decap CMS 后台入口 | `src/pages/admin/index.astro` + `public/admin/` 配置 |

### API 接口
- 当前项目为静态站点，不包含任何后端 API。如需扩展，可在未来接入独立服务或使用 Astro 的 serverless 方案。

## 5. 技术栈与关键依赖
| 依赖 | 版本 | 作用 |
| ---- | ---- | ---- |
| `astro` | ^4.11.1 | 框架核心，负责编译 Astro/MDX、生成静态站点 |
| `@astrojs/tailwind` | ^5.1.0 | 集成 Tailwind CSS（关闭默认 Base Styles） |
| `@astrojs/mdx` | ^3.1.0 | 支持 MDX 内容，供教程章节使用 |
| `tailwindcss` | ^3.4.14 | 实现原子化样式，结合 `@tailwindcss/typography` 优化排版 |
| `@tailwindcss/typography` | ^0.5.13 | Markdown/MDX 排版增强（`prose` 风格） |
| `autoprefixer` | ^10.4.20 | PostCSS 插件，自动补全 CSS 前缀 |
| `prettier` & `prettier-plugin-astro` | ^3.3.3 / ^0.13.0 | 统一代码格式（含 `.astro` 文件） |
| `gif-encoder-2` | ^1.0.5 | Node 脚本生成演示 GIF 动图 |

> 如需新增依赖，请使用 `pnpm add <pkg>`（生产依赖）或 `pnpm add -D <pkg>`（开发依赖）。

---
如有新的开发约定、API 或目录调整，请同步更新本文件，确保协作人员能快速了解项目现状。
