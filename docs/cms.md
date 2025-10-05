# Decap CMS 使用说明

本文档解释如何在不修改 Astro 框架的前提下，通过 Decap CMS（原 Netlify CMS）维护 src/content/tutorial/*.mdx 的内容。

## 1. 目录结构回顾

- public/admin/index.html：载入 Decap CMS 脚本。
- public/admin/config.yml：后台配置、GitHub 仓库信息、字段定义。
- public/assets/uploads/：通过 CMS 上传的图片 / JSON 会保存到这里。
- src/content/tutorial/：章节 MDX，后台编辑后自动提交到该目录。

## 2. 本地开发模式

1. 安装依赖并启动 Astro 开发服务器：
   `ash
   pnpm install
   pnpm dev
   `
2. 打开新的终端，启动 Decap CMS 的本地代理：
   `ash
   npx decap-server
   `
3. 浏览器访问 http://localhost:4321/admin/，使用 GitHub 账号登录即可在本地编辑。
4. 编辑完成后可以直接在后台预览、保存；本地代理会把变更写入对应 MDX 文件，随后在 Git 中查看、提交。

> 注意：
px decap-server 只在开发环境使用，生产部署时无需运行。

## 3. GitHub OAuth 配置（生产环境）

要在 GitHub Pages 上使用 /admin/，需要 GitHub OAuth 应用或 Decap CMS 授权服务：

1. 在 GitHub Settings → Developer settings → OAuth Apps 创建新应用：
   - Homepage URL：https://www.nuash.cn/
   - Authorization callback URL：https://www.nuash.cn/admin/
2. 记录生成的 Client ID 与 Client Secret。
3. 选择一种授权代理：
   - 使用官方开源的 
etlify-cms-oauth（Node 服务）部署在任意可访问地址。
   - 或使用第三方托管服务（需确认安全性）。
4. 在 public/admin/config.yml 中新增 oauth_client_id 与代理地址配置，或在代理中指定仓库信息。
5. 重新部署后，访问 /admin/ 进行 GitHub 登录，后续内容更新会以 Pull Request 的形式提交。

## 4. 发布流程

- 默认设置为 publish_mode: editorial_workflow：提交内容会生成草稿 → 审核 → 发布。
- 如果希望直接推送到仓库，可将配置改为 publish_mode: simple。
- 所有自动提交的 commit message 模板见 config.yml 中的 commit_messages 段，可按需调整。

## 5. 常见问题

| 问题 | 解决方法 |
| ---- | -------- |
| 无法登录后台 | 确认 OAuth 应用回调地址与仓库名称填写正确；在本地测试时请运行 
px decap-server。 |
| 资源路径错误 | CMS 上传的文件默认放在 public/assets/uploads/，正文引用时使用 /assets/uploads/xxx。 |
| 生成的 PR 未自动合并 | 需要仓库维护者手动审查并合并 PR；可结合 GitHub Actions 自动化测试。 |

如需扩展更多集合，请在 public/admin/config.yml 中新增 collections 项，并保证目标目录已经存在。


