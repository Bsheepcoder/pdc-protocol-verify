# PDC Protocol Verify

PDC（Parallel Data Channel Protocol，平行数据通道协议）的协议规范、采用者网络入口和验证工具。

## 什么是 PDC 协议

PDC 协议让静态博客（Hexo / Hugo / Jekyll 等）在构建时自动生成 AI 可读的零噪音内容端点，使 AI/Agent 能直接获取结构化文章数据，无需解析 HTML 噪音。

核心端点：

| 端点 | 用途 |
|------|------|
| `/llms.txt` | AI 入口，站点概览 + 文章索引 |
| `/api/index.json` | 结构化文章列表 |
| `/api/posts/<slug>.json` | 单篇 JSON（元数据 + 正文） |
| `/api/posts/<slug>.md` | 单篇纯 Markdown（零噪音） |
| `/api/categories/<slug>.json` | 按分类聚合 |
| `/api/adopters.json` | PDC 采用者列表 |

完整规范见 [`pdc-protocol.md`](./pdc-protocol.md)。

## 如何加入 PDC 采用者网络

### 1. 实现 PDC 协议

参照 [`pdc-protocol.md`](./pdc-protocol.md)，在你的静态站点上实现以下端点：

- `/llms.txt` — 站点概览 + 文章列表
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
- PDC 网络成员之间形成内容互链，提升整体搜索可见性

### 义务

- 维持 PDC 端点可访问
- 在站点可见位置标注 PDC 协议采用（如关于页或页脚）

## 参考实现

- [Q's blog](https://bsheepcoder.github.io/) — PDC 协议发源地，Hexo + Butterfly 主题

## License

MIT
