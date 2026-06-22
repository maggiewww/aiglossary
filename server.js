/**
 * AI术语库后端服务 v2
 * - 智能频率调度：白天每小时/夜间每6小时扫描
 * - 热词榜单 API
 * - 数据源配置管理 API
 * - 扫描状态 API + 手动触发
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const {
  scanAllSources,
  loadSources,
  saveSources,
  loadTrending,
  saveTrending,
  appendScanHistory
} = require('./scanner');
const { generateTermEntry } = require('./llm');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ai2026';
const MAX_LLM_PER_SCAN = parseInt(process.env.MAX_LLM_GENERATIONS_PER_SCAN || '5');
const SCAN_INTERVAL_OVERRIDE = process.env.SCAN_INTERVAL_MINUTES
  ? parseInt(process.env.SCAN_INTERVAL_MINUTES)
  : null;

const DISCOVERED_FILE = path.join(__dirname, 'discovered.json');

// 中间件
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, '..')));

// ========================================
// 数据持久化（discovered.json）
// ========================================
function loadDiscoveredData() {
  try {
    if (fs.existsSync(DISCOVERED_FILE)) {
      return JSON.parse(fs.readFileSync(DISCOVERED_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('[Server] discovered.json 解析失败:', e.message);
  }
  return { terms: [], lastScanTime: null, stats: null };
}

function saveDiscoveredData(data) {
  fs.writeFileSync(DISCOVERED_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 从 data.js 解析现有词库术语
function loadExistingTermsFromData() {
  try {
    const dataJsPath = path.join(__dirname, '..', 'data.js');
    if (!fs.existsSync(dataJsPath)) return [];
    const dataJs = fs.readFileSync(dataJsPath, 'utf-8');
    const terms = [];
    const regex = /english:\s*"([^"]+)"/g;
    let match;
    while ((match = regex.exec(dataJs)) !== null) {
      terms.push(match[1]);
    }
    return terms;
  } catch (e) {
    console.error('[Server] 读取 data.js 失败:', e.message);
    return [];
  }
}

// ========================================
// 扫描状态
// ========================================
let scanStatus = {
  lastScanTime: null,
  nextScanTime: null,
  scanning: false,
  lastError: null
};

// ========================================
// 扫描主流程
// ========================================
async function runScan() {
  if (scanStatus.scanning) {
    console.log('[Scan] 已有扫描进行中，跳过');
    return;
  }
  scanStatus.scanning = true;
  const startedAt = new Date().toISOString();
  console.log(`[Scan] 开始扫描 ${new Date().toLocaleString()}`);

  try {
    const englishTerms = loadExistingTermsFromData();
    const englishTermsLower = new Set(englishTerms.map(t => t.toLowerCase()));

    // 已发现的待审核术语也算"已存在"，避免重复生成
    const discovered = loadDiscoveredData();
    discovered.terms.forEach(t => englishTermsLower.add(t.english.toLowerCase()));

    const { candidates, sourcesHit } = await scanAllSources(englishTermsLower);

    // 新词走 LLM 生成
    const newCandidates = candidates.filter(c => c.isNew).slice(0, MAX_LLM_PER_SCAN);
    let llmGenerated = 0;
    if (newCandidates.length > 0 && process.env.LLM_API_KEY) {
      console.log(`[Scan] 为 ${newCandidates.length} 个新候选术语生成词条...`);
      for (const c of newCandidates) {
        try {
          const entry = await generateTermEntry(
            c.term, c.context, englishTerms,
            { frequency: c.frequency, sources: c.sourceNames }
          );
          if (!entry.source && c.sourceUrl) entry.source = c.sourceUrl;
          const exists = discovered.terms.find(
            t => t.english.toLowerCase() === entry.english.toLowerCase()
          );
          if (!exists) {
            discovered.terms.push(entry);
            llmGenerated++;
          }
        } catch (e) {
          console.error(`[Scan] 生成 ${c.term} 失败:`, e.message);
        }
      }
    }

    discovered.lastScanTime = startedAt;
    discovered.stats = {
      message: `扫描 ${sourcesHit} 个源，发现 ${candidates.filter(c => c.isNew).length} 个新术语，生成 ${llmGenerated} 个词条`,
      totalCandidates: candidates.length,
      newCandidates: candidates.filter(c => c.isNew).length,
      llmGenerated,
      sourcesHit,
      scannedAt: startedAt
    };
    saveDiscoveredData(discovered);

    appendScanHistory({
      time: startedAt,
      sourcesHit,
      candidatesFound: candidates.length,
      newTerms: candidates.filter(c => c.isNew).length,
      llmGenerated
    });

    scanStatus.lastScanTime = startedAt;
    scanStatus.lastError = null;
    console.log(`[Scan] 完成：候选 ${candidates.length}，新词 ${candidates.filter(c => c.isNew).length}，LLM 生成 ${llmGenerated}`);
  } catch (error) {
    console.error('[Scan] 扫描失败:', error.message);
    scanStatus.lastError = error.message;
  } finally {
    scanStatus.scanning = false;
  }
}

// ========================================
// 智能频率调度
// ========================================
function setupScheduler() {
  if (SCAN_INTERVAL_OVERRIDE) {
    const ms = SCAN_INTERVAL_OVERRIDE * 60 * 1000;
    console.log(`[Scheduler] 自定义间隔：每 ${SCAN_INTERVAL_OVERRIDE} 分钟扫描一次`);
    setInterval(runScan, ms);
    // 启动后 30 秒执行首次扫描
    setTimeout(runScan, 30 * 1000);
    return;
  }

  // 白天 08:00-21:59 每小时
  cron.schedule('0 8-21 * * *', () => {
    console.log('[Scheduler] 触发白天扫描');
    runScan();
  });

  // 夜间 22:00、04:00 各一次（间隔 6 小时）
  cron.schedule('0 22,4 * * *', () => {
    console.log('[Scheduler] 触发夜间扫描');
    runScan();
  });

  // 启动后 30 秒执行首次扫描
  setTimeout(runScan, 30 * 1000);
  console.log('[Scheduler] 已注册：白天 8-21 点每小时、夜间 22/4 点各一次');
}

// 计算下次扫描时间
function getNextScanTime() {
  if (SCAN_INTERVAL_OVERRIDE) {
    return new Date(Date.now() + SCAN_INTERVAL_OVERRIDE * 60 * 1000).toISOString();
  }
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // 当前在白天时段（8-21）：下次是当前小时+1 的 0 分
  if (hour >= 8 && hour < 22) {
    const next = new Date(now);
    next.setHours(hour + 1, 0, 0, 0);
    return next.toISOString();
  }
  // 当前是 22 点之前（即 22 点之前的夜间，0-7 点）：下次是 4 点或 8 点
  if (hour < 4) {
    const next = new Date(now);
    next.setHours(4, 0, 0, 0);
    return next.toISOString();
  }
  if (hour < 8) {
    const next = new Date(now);
    next.setHours(8, 0, 0, 0);
    return next.toISOString();
  }
  // 当前 22 点之后（22-23）：下次是次日 4 点
  if (hour >= 22) {
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    next.setHours(4, 0, 0, 0);
    return next.toISOString();
  }
  return null;
}

// ========================================
// 热词榜单计算
// ========================================
function getTrendingList(range, limit) {
  const data = loadTrending();
  const now = new Date();
  let cutoff;
  if (range === '24h') cutoff = new Date(now.getTime() - 24 * 3600 * 1000);
  else if (range === '30d') cutoff = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
  else cutoff = new Date(now.getTime() - 7 * 24 * 3600 * 1000); // default 7d

  // 从 data.js 读现有词库的 brief
  const existingTermsMap = loadExistingTermsMap();

  const result = [];
  const terms = data.terms || {};
  for (const [term, info] of Object.entries(terms)) {
    let count = 0;
    (info.history || []).forEach(h => {
      if (new Date(h.date) >= cutoff) count += h.count;
    });
    if (count > 0) {
      const known = existingTermsMap.get(term.toLowerCase());
      result.push({
        term,
        count,
        totalMentions: info.totalMentions || 0,
        lastSeen: info.lastSeen,
        firstSeen: info.firstSeen,
        sources: info.sources || [],
        history: info.history || [],
        inGlossary: !!known,
        brief: known ? known.brief : null  // 未知词的 brief 由前端按需调用 /api/trending/:english/brief 获取
      });
    }
  }
  result.sort((a, b) => b.count - a.count);
  return result.slice(0, limit);
}

// 从 data.js 解析所有术语（含 brief），返回 Map<lowercase_english, termObj>
function loadExistingTermsMap() {
  const map = new Map();
  try {
    const dataJsPath = path.join(__dirname, '..', 'data.js');
    if (!fs.existsSync(dataJsPath)) return map;
    const content = fs.readFileSync(dataJsPath, 'utf-8');
    // 匹配每个 object entry: { initial:"X", english:"...", chinese:"...", brief:"...", ... }
    const entryRegex = /\{\s*initial:\s*"([^"]*)"\s*,\s*english:\s*"([^"]*)"\s*,\s*chinese:\s*"([^"]*)"\s*,\s*brief:\s*"([^"]*)"/g;
    let m;
    while ((m = entryRegex.exec(content)) !== null) {
      map.set(m[2].toLowerCase(), {
        english: m[2],
        chinese: m[3],
        brief: m[4]
      });
    }
  } catch (e) {
    console.error('[Server] loadExistingTermsMap 失败:', e.message);
  }
  return map;
}

// ========================================
// Brief 缓存（为未知热词生成解释）
// ========================================
const BRIEFS_FILE = path.join(__dirname, 'briefs.json');

function loadBriefs() {
  try {
    if (fs.existsSync(BRIEFS_FILE)) {
      return JSON.parse(fs.readFileSync(BRIEFS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return {};
}

function saveBriefs(data) {
  fs.writeFileSync(BRIEFS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ========================================
// 管理员鉴权中间件
// ========================================
function adminGuard(req, res, next) {
  const pwd = req.headers['x-admin-password'] || req.body?.adminPassword;
  if (pwd !== ADMIN_PASSWORD) {
    return res.status(403).json({ success: false, error: '管理员密码错误' });
  }
  next();
}

// ========================================
// API 路由
// ========================================

// 沿用：待审核新词
app.get('/api/discovered', (req, res) => {
  res.json(loadDiscoveredData());
});

app.post('/api/discovered/remove', (req, res) => {
  const { english } = req.body;
  if (!english) return res.status(400).json({ success: false, error: '缺少 english' });
  const data = loadDiscoveredData();
  data.terms = data.terms.filter(t => t.english.toLowerCase() !== english.toLowerCase());
  saveDiscoveredData(data);
  res.json({ success: true });
});

// 新增：热词榜单
app.get('/api/trending', (req, res) => {
  const range = ['24h', '7d', '30d'].includes(req.query.range) ? req.query.range : '7d';
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  try {
    res.json({
      range,
      list: getTrendingList(range, limit),
      lastScanTime: scanStatus.lastScanTime
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 新增：某术语热度详情
app.get('/api/trending/:english', (req, res) => {
  const data = loadTrending();
  const term = req.params.english;
  const info = (data.terms || {})[term];
  if (!info) return res.status(404).json({ error: '未找到该术语的热度记录' });
  res.json({ term, ...info });
});

// 新增：为未知热词生成 brief 解释（带缓存）
app.get('/api/trending/:english/brief', async (req, res) => {
  const english = req.params.english;
  // 词库已有 → 直接返回
  const existingMap = loadExistingTermsMap();
  const known = existingMap.get(english.toLowerCase());
  if (known) {
    return res.json({ english, brief: known.brief, chinese: known.chinese, cached: true, inGlossary: true });
  }
  // 查缓存
  const cache = loadBriefs();
  if (cache[english]) {
    return res.json({ english, brief: cache[english].brief, chinese: cache[english].chinese || '', cached: true, inGlossary: false });
  }
  // 查 trending 是否有热度上下文
  const trending = loadTrending();
  const info = (trending.terms || {})[english];
  const hotInfo = info ? { frequency: info.totalMentions || 0, sources: info.sources || [] } : null;
  // 调 LLM 生成
  try {
    const { generateTermBrief } = require('./llm');
    const result = await generateTermBrief(english, hotInfo?.frequency || 0, hotInfo?.sources || []);
    cache[english] = result;
    saveBriefs(cache);
    res.json({ english, brief: result.brief, chinese: result.chinese, cached: false, inGlossary: false });
  } catch (e) {
    res.status(500).json({ error: '生成失败: ' + e.message });
  }
});

// 新增：数据源列表
app.get('/api/sources', (req, res) => {
  res.json(loadSources());
});

// 新增：更新数据源（管理员）
app.post('/api/sources', adminGuard, (req, res) => {
  const { sources } = req.body;
  if (!sources || typeof sources !== 'object') {
    return res.status(400).json({ success: false, error: '缺少 sources 对象' });
  }
  try {
    saveSources(sources);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 新增：扫描状态
app.get('/api/scan/status', (req, res) => {
  res.json({
    scanning: scanStatus.scanning,
    lastScanTime: scanStatus.lastScanTime,
    nextScanTime: getNextScanTime(),
    lastError: scanStatus.lastError,
    history: (loadTrending().scanHistory || []).slice(-10).reverse()
  });
});

// 新增：手动触发扫描（管理员）
app.post('/api/scan/trigger', adminGuard, (req, res) => {
  if (scanStatus.scanning) {
    return res.json({ success: false, message: '已有扫描进行中' });
  }
  runScan();
  res.json({ success: true, message: '已触发扫描' });
});

// ========================================
// data.js 写入接口（管理员）
// ========================================
const DATA_JS_PATH = path.join(__dirname, '..', 'data.js');

// 把词条对象序列化为 data.js 中的单行格式
function serializeTerm(t) {
  const parts = [];
  parts.push(`initial:${JSON.stringify(t.initial || (t.english[0] || 'A').toUpperCase())}`);
  parts.push(`english:${JSON.stringify(t.english)}`);
  parts.push(`chinese:${JSON.stringify(t.chinese || '')}`);
  parts.push(`brief:${JSON.stringify(t.brief || '')}`);
  parts.push(`definition:${JSON.stringify(t.definition || '')}`);
  parts.push(`source:${JSON.stringify(t.source || '')}`);
  parts.push(`related:${JSON.stringify(t.related || [])}`);
  if (t.example) parts.push(`example:${JSON.stringify(t.example)}`);
  return `  { ${parts.join(', ')} }`;
}

// 在 GLOSSARY_DATA 数组末尾追加新词条
function appendTermToDataFile(term) {
  const content = fs.readFileSync(DATA_JS_PATH, 'utf-8');
  // 匹配 GLOSSARY_DATA = [ ... ]; 的结束位置
  // 找最后一个 } 在 ]; 之前的位置
  const closingIdx = content.lastIndexOf('];');
  if (closingIdx === -1) {
    throw new Error('data.js 中找不到 GLOSSARY_DATA 数组的结束 ];');
  }
  // 往前找最后一个非空字符
  let insertIdx = closingIdx;
  while (insertIdx > 0 && /\s/.test(content[insertIdx - 1])) insertIdx--;

  // 判断前一个字符是不是 } 或 {（数组开头）
  const prevChar = content[insertIdx - 1];
  const needComma = prevChar === '}';
  const line = serializeTerm(term);
  const newContent =
    content.slice(0, insertIdx) +
    (needComma ? ',' : '') +
    '\n' + line +
    content.slice(insertIdx);
  fs.writeFileSync(DATA_JS_PATH, newContent, 'utf-8');
}

// 编辑：替换某词条
function editTermInDataFile(originalEnglish, newTerm) {
  const content = fs.readFileSync(DATA_JS_PATH, 'utf-8');
  // 找匹配 english:"xxx" 的那一行（GLOSSARY_DATA 数组内的整条 object）
  const escaped = originalEnglish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `(\\s*)\\{[^}]*english:\\s*"${escaped}"[^}]*\\},?`,
    'g'
  );
  if (!regex.test(content)) {
    // 可能是最后一条没有逗号
    const regexNoComma = new RegExp(
      `(\\s*)\\{[^}]*english:\\s*"${escaped}"[^}]*\\}`,
      'g'
    );
    if (!regexNoComma.test(content)) {
      throw new Error(`未找到 english:"${originalEnglish}" 的词条`);
    }
    const newLine = serializeTerm(newTerm);
    const newContent = content.replace(regexNoComma, `$1${newLine}`);
    fs.writeFileSync(DATA_JS_PATH, newContent, 'utf-8');
    return;
  }
  const newLine = serializeTerm(newTerm);
  const newContent = content.replace(regex, `$1${newLine},`);
  fs.writeFileSync(DATA_JS_PATH, newContent, 'utf-8');
}

// 删除某词条
function deleteTermFromDataFile(english) {
  const content = fs.readFileSync(DATA_JS_PATH, 'utf-8');
  const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 先匹配带逗号的，再匹配不带逗号的（最后一条）
  let newContent = content.replace(
    new RegExp(`\\s*\\{[^}]*english:\\s*"${escaped}"[^}]*\\},?\\n?`, 'g'),
    ''
  );
  if (newContent === content) {
    throw new Error(`未找到 english:"${english}" 的词条`);
  }
  fs.writeFileSync(DATA_JS_PATH, newContent, 'utf-8');
}

// 鉴权 + 重复检查：新增
app.post('/api/terms', adminGuard, (req, res) => {
  const term = req.body.term;
  if (!term || !term.english || !term.chinese) {
    return res.status(400).json({ success: false, error: '缺少 english 或 chinese' });
  }
  // 重复检查
  const existing = loadExistingTermsFromData();
  if (existing.some(e => e.toLowerCase() === term.english.toLowerCase())) {
    return res.status(409).json({ success: false, error: `术语 "${term.english}" 已存在于 data.js` });
  }
  try {
    appendTermToDataFile(term);
    console.log(`[Data] 新增词条: ${term.english}`);
    res.json({ success: true, term });
  } catch (e) {
    console.error('[Data] 新增失败:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// 编辑
app.put('/api/terms/:english', adminGuard, (req, res) => {
  const originalEnglish = decodeURIComponent(req.params.english);
  const newTerm = req.body.term;
  if (!newTerm || !newTerm.english || !newTerm.chinese) {
    return res.status(400).json({ success: false, error: '缺少 english 或 chinese' });
  }
  try {
    editTermInDataFile(originalEnglish, newTerm);
    console.log(`[Data] 编辑词条: ${originalEnglish} -> ${newTerm.english}`);
    res.json({ success: true, term: newTerm });
  } catch (e) {
    console.error('[Data] 编辑失败:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// 删除
app.delete('/api/terms/:english', adminGuard, (req, res) => {
  const english = decodeURIComponent(req.params.english);
  try {
    deleteTermFromDataFile(english);
    console.log(`[Data] 删除词条: ${english}`);
    res.json({ success: true });
  } catch (e) {
    console.error('[Data] 删除失败:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

// 沿用：健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    llmConfigured: !!process.env.LLM_API_KEY,
    model: process.env.LLM_MODEL || 'not configured',
    lastScanTime: scanStatus.lastScanTime,
    nextScanTime: getNextScanTime(),
    pendingTerms: loadDiscoveredData().terms.length,
    scanInterval: SCAN_INTERVAL_OVERRIDE ? `${SCAN_INTERVAL_OVERRIDE}分钟` : '智能频率'
  });
});

// ========================================
// 启动
// ========================================
app.listen(PORT, () => {
  console.log(`\n🚀 AI术语库服务已启动: http://localhost:${PORT}`);
  console.log(`⏰ 扫描频率: ${SCAN_INTERVAL_OVERRIDE ? `每 ${SCAN_INTERVAL_OVERRIDE} 分钟` : '智能（白天每小时/夜间每6小时）'}`);
  console.log(`🔧 LLM配置: ${process.env.LLM_API_KEY ? '✅ 已配置' : '❌ 未配置（请编辑 .env）'}`);
  console.log(`📋 模型: ${process.env.LLM_MODEL || '未指定'}`);
  console.log(`🔑 管理员密码: ${ADMIN_PASSWORD === 'ai2026' ? '默认 ai2026' : '已自定义'}\n`);
  setupScheduler();
});
