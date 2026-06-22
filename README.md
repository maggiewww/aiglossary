# AI 术语库

帮助每个人轻松理解 AI 的术语库网站,含动态热词榜单、自动新词发现、管理员审核流程。

## 功能

- **词库浏览**:134 条 AI 术语,按字母分组,支持中英文搜索
- **热词榜单**:实时抓取行业 RSS/博客/HackerNews,按出现频次排行 Top 10
- **收藏审核**:用户可收藏未收录的热词,管理员审核通过后自动写入 `data.js`
- **详情弹窗**:每条术语含一句话解释、官方定义、生活化示例、热度趋势折线图
- **数据源管理**:管理员可在关于页启用/禁用各数据源,立即生效
- **智能调度**:白天每小时扫描、夜间每 6 小时扫描
- **深色模式**:跟随系统自动切换

## 技术栈

- 前端:原生 HTML / CSS / JavaScript(无构建)
- 后端:Node.js + Express
- LLM:OpenAI 兼容接口(用于生成新词条解释)
- 数据存储:JSON 文件(discovered / trending / briefs / sources)

## 本地运行

### 1. 安装后端依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 填入 LLM_API_KEY(可选,不填则跳过自动生成新词条)
```

### 3. 启动服务

```bash
npm start
```

访问 http://localhost:3000

## 数据源配置

编辑 `server/sources.json` 增删数据源,或在关于页管理员界面热编辑。

默认启用的数据源:
- 5 个 RSS(TechCrunch / MIT Tech Review / The Verge / VentureBeat / Google News)
- 4 个公司博客(Anthropic / OpenAI / DeepMind / Hugging Face)
- HackerNews(top 30,minScore 100)

默认禁用的数据源:
- Reddit(r/MachineLearning / r/artificial / r/LocalLLaMA)
- Google Trends(占位)

## 管理员功能

- 管理员密码默认 `ai2026`,在 `.env` 的 `ADMIN_PASSWORD` 配置
- 审核"收藏"的术语 → 通过后自动追加到 `data.js`
- 编辑/删除现有词条 → 直接修改 `data.js` 文件
- 手动触发扫描 → 不用等定时任务

## 目录结构

```
.
├── index.html           # 前端结构
├── styles.css           # 前端样式
├── app.js               # 前端逻辑
├── data.js              # 134 条词条数据(保留不动)
├── examples.js          # 135 条示例数据(保留不动)
└── server/
    ├── server.js        # 后端主程序 + API
    ├── scanner.js       # 多渠道抓取 + 热度统计
    ├── llm.js           # LLM 调用(完整词条 + brief)
    ├── sources.json     # 数据源配置
    ├── package.json     # 后端依赖
    └── .env.example     # 环境变量样例
```

## API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/trending?range=7d&limit=10` | 热词榜单 |
| GET | `/api/trending/:english` | 单个术语热度详情 |
| GET | `/api/trending/:english/brief` | 为未知热词生成 brief(LLM) |
| GET | `/api/discovered` | 待审核新词列表 |
| POST | `/api/discovered/remove` | 从待审核列表移除 |
| GET | `/api/sources` | 数据源列表 |
| POST | `/api/sources` | 更新数据源(管理员) |
| GET | `/api/scan/status` | 扫描状态 + 历史 |
| POST | `/api/scan/trigger` | 手动触发扫描(管理员) |
| POST | `/api/terms` | 新增词条到 data.js(管理员) |
| PUT | `/api/terms/:english` | 编辑词条(管理员) |
| DELETE | `/api/terms/:english` | 删除词条(管理员) |
| GET | `/api/health` | 健康检查 |

## 联系人

- 王小雨(ERP:wangxiaoyu.296)
- 庞若灵(ERP:pangruoling.1)
