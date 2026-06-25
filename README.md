# PDC — llms.txt Enhanced for Hexo

PDC（Parallel Data Channel）是 [llms.txt](https://llmstxt.org) 标准的 Hexo 增强实现，包含协议规范、采用者网络入口和验证工具。

## 什么是 PDC

[llms.txt](https://llmstxt.org) 是由 Jeremy Howard（fast.ai）提出的标准，定义了 `/llms.txt` 文件格式，让网站为 LLM 提供 Markdown 友好的内容概览。PDC 在完全兼容 llms.txt 的基础上，为 Hexo 博客扩展了：

- 结构化文章索引（`/api/index.json`，含 tags/categories/description）
- 单篇纯 Markdown 正文（`/api/posts/<slug>.md`，零噪音）
- 按分类聚合（`/api/categories/<slug>.json`）
- 加密文章保护（AI 知道存在但不泄露正文）
- MCP 适配层（可选，接入 Claude Desktop / Cursor 等）
- 采用者互链网络（`/api/adopters.json`）

完整规范见 [`pdc-protocol.md`](./pdc-protocol.md)。

## 如何加入 llms.txt 采用者网络

### 1. 实现 llms.txt + PDC 扩展端点

参照 [`pdc-protocol.md`](./pdc-protocol.md)，在你的静态站点上实现以下端点：

- `/llms.txt` — 站点概览 + 文章列表（llms.txt 标准格式）
- `/api/index.json` — 结构化文章索引
- `/api/posts/<slug>.md` — 单篇纯 Markdown

### 2. 提交申请

在 [Bsheepcoder/Bsheepcoder.github.io Issues](https://github.com/Bsheepcoder/Bsheepcoder.github.io/issues) 创建 Issue，填写：

- **站点名称**：你的博客名
- **站点 URL**：`https://your-blog.com/`
- **头像 URL**：`https://your-blog.com/avatar.png`
- **一句话描述**：50 字以内的站点描述

### 3. 自动验证

维护者会运行验证脚本检查你的端点：

```bash
node verify.js https://your-blog.com/
```

### 4. 互链

验证通过后，你的站点将：

- 出现在 [友链页](https://bsheepcoder.github.io/flink/)
- 列入 [/api/adopters.json](https://bsheepcoder.github.io/api/adopters.json)
- 其他 AI/Agent 可通过 adopters.json 发现你的站点

## 验证脚本使用方法

### 前提条件

- Node.js 18+

### 验证单个站点

```bash
node verify.js https://your-blog.com/
```

### 验证全部采用者

```bash
node verify.js
```

不传参数时，脚本会从 `https://bsheepcoder.github.io/api/adopters.json` 拉取全部采用者列表并逐一验证。

### 输出示例

```
✓ Q's blog (https://bsheepcoder.github.io/)
  /llms.txt → 200 OK
  /api/index.json → 200 OK (24 posts)

✗ Example Blog (https://example.com/)
  /llms.txt → 404 Not Found
  /api/index.json → 404 Not Found
```

## 采用者权利与义务

### 权利

- 出现在友链页面，获得反向链接
- 列入 `/api/adopters.json`，其他 AI/Agent 可发现你的站点
- 网络成员之间形成内容互链，提升整体搜索可见性

### 义务

- 维持 llms.txt 端点可访问
- 在站点可见位置标注 llms.txt 采用（如关于页或页脚）

## 参考实现

- [Q's blog](https://bsheepcoder.github.io/) — PDC 参考实现，Hexo + Butterfly 主题

## License

MIT
