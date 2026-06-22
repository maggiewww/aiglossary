/**
 * 多渠道新术语扫描器 v2
 * - 数据源由 sources.json 配置驱动，可随时增删
 * - 抓取 RSS / 博客 / Reddit / HackerNews
 * - 记录每个候选词的出现次数和源，写入 trending.json 用于热词榜单
 */
const axios = require('axios');
const cheerio = require('cheerio');
const RSSParser = require('rss-parser');
const path = require('path');
const fs = require('fs');

const rssParser = new RSSParser({ timeout: 15000 });

const SOURCES_FILE = path.join(__dirname, 'sources.json');
const TRENDING_FILE = path.join(__dirname, 'trending.json');

// ========================================
// 数据源加载
// ========================================
function loadSources() {
  try {
    if (fs.existsSync(SOURCES_FILE)) {
      return JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('[Scanner] sources.json 解析失败:', e.message);
  }
  return { rss: [], blogs: [], reddit: [], hackernews: { enabled: false }, googleTrends: { enabled: false } };
}

function saveSources(sources) {
  fs.writeFileSync(SOURCES_FILE, JSON.stringify(sources, null, 2), 'utf-8');
}

// ========================================
// 术语提取规则
// ========================================
const BLACKLIST = new Set([
  'openai', 'anthropic', 'google', 'meta', 'microsoft', 'nvidia', 'apple', 'amazon',
  'deepmind', 'hugging face', 'tesla', 'ibm', 'intel', 'sam altman', 'elon musk',
  'ceo', 'cto', 'series', 'update', 'release', 'version', 'report', 'review',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
  'the', 'new', 'how', 'why', 'what', 'best', 'top', 'first', 'latest',
  'news', 'blog', 'post', 'article', 'story', 'read', 'watch', 'listen',
]);

const TERM_PATTERNS = [
  /\b([A-Z]{2,6})\b/g,
  /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b/g,
  /\b([A-Z][a-z]+-[A-Z][a-z-]+)\b/g,
  /\b((?:AI|ML|LLM)\s[A-Z][a-z]+(?:\s\w+)?)\b/g,
  /"([^"]{3,30})"/g,
  /\b([A-Z][a-z]+(?:AI|ML|LLM|GPT|Net))\b/g,
];

const AI_CONTEXT_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural',
  'model', 'training', 'inference', 'llm', 'agent', 'prompt', 'token',
  'transformer', 'diffusion', 'embedding', 'reinforcement', 'generative',
  'autonomous', 'reasoning', 'alignment', 'fine-tun', 'pre-train',
];

// ========================================
// 抓取函数
// ========================================

/** RSS 源 */
async function fetchRSS(source) {
  try {
    const feed = await rssParser.parseURL(source.url);
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return (feed.items || [])
      .filter(item => !item.pubDate || new Date(item.pubDate).getTime() > weekAgo)
      .slice(0, 20)
      .map(item => ({
        title: item.title || '',
        summary: item.contentSnippet || item.content || '',
        url: item.link || '',
        source: source.name
      }));
  } catch (error) {
    console.error(`[RSS] ${source.name} 抓取失败:`, error.message);
    return [];
  }
}

/** 博客网页爬取 */
async function fetchBlog(source) {
  try {
    const { data } = await axios.get(source.url, {
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AI-Glossary-Bot/1.0)' }
    });
    const $ = cheerio.load(data);
    const texts = [];
    const selector = source.selector || 'h2, h3, article a';
    $(selector).each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 3 && text.length < 200) {
        texts.push({ title: text, summary: '', url: source.url, source: source.name });
      }
    });
    return texts.slice(0, 30);
  } catch (error) {
    console.error(`[Blog] ${source.name} 抓取失败:`, error.message);
    return [];
  }
}

/** Reddit JSON API */
async function fetchReddit(source) {
  try {
    const { data } = await axios.get(source.url, {
      timeout: 15000,
      headers: { 'User-Agent': 'ai-glossary-bot/1.0' }
    });
    const children = (data && data.data && data.data.children) || [];
    return children
      .slice(0, 25)
      .map(c => ({
        title: (c.data && c.data.title) || '',
        summary: (c.data && c.data.selftext) || '',
        url: (c.data && c.data.url) || '',
        source: source.name
      }));
  } catch (error) {
    console.error(`[Reddit] ${source.name} 抓取失败:`, error.message);
    return [];
  }
}

/** HackerNews top stories */
async function fetchHackerNews(config) {
  try {
    const { data: ids } = await axios.get(config.url, { timeout: 15000 });
    const topIds = (ids || []).slice(0, config.topN || 30);
    const items = await Promise.all(
      topIds.map(id =>
        axios.get(config.itemUrl.replace('{id}', id), { timeout: 15000 })
          .then(r => r.data)
          .catch(() => null)
      )
    );
    const aiKeywords = config.aiKeywords || ['ai', 'ml', 'llm'];
    return items
      .filter(Boolean)
      .filter(item => (item.score || 0) >= (config.minScore || 100))
      .filter(item => {
        const text = `${item.title || ''} ${item.text || ''}`.toLowerCase();
        return aiKeywords.some(kw => text.includes(kw));
      })
      .map(item => ({
        title: item.title || '',
        summary: item.text || '',
        url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        source: 'HackerNews'
      }));
  } catch (error) {
    console.error('[HN] 抓取失败:', error.message);
    return [];
  }
}

/** Google Trends（占位，未实现） */
async function fetchGoogleTrends(config) {
  console.log('[GoogleTrends] 暂未实现，跳过');
  return [];
}

// ========================================
// 术语提取逻辑
// ========================================

/**
 * 从文章列表中提取候选术语（包括词库内已有术语，用于热度统计）
 * @param {Array} articles
 * @param {Set} existingTermsLower - 现有词库术语（小写）
 * @returns {Array} 候选术语 [{term, termLower, context, sourceUrl, sourceNames:[], sourceName, frequency, isNew}]
 */
function extractTerms(articles, existingTermsLower) {
  const candidates = new Map();

  articles.forEach(article => {
    const text = `${article.title} ${article.summary}`;
    const textLower = text.toLowerCase();

    const isAIRelated = AI_CONTEXT_KEYWORDS.some(kw => textLower.includes(kw));
    if (!isAIRelated) return;

    TERM_PATTERNS.forEach(pattern => {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const term = match[1].trim();
        const termLower = term.toLowerCase();

        if (term.length < 2 || term.length > 40) continue;
        if (BLACKLIST.has(termLower)) continue;
        if (/^\d+$/.test(term)) continue;
        if (/^[a-z]/.test(term) && !term.includes('-')) continue;

        if (candidates.has(termLower)) {
          const c = candidates.get(termLower);
          c.frequency++;
          if (!c.sourceNames.includes(article.source)) c.sourceNames.push(article.source);
        } else {
          candidates.set(termLower, {
            term,
            termLower,
            context: article.title,
            sourceUrl: article.url,
            sourceName: article.source,
            sourceNames: [article.source],
            frequency: 1,
            isNew: !existingTermsLower.has(termLower)
          });
        }
      }
    });
  });

  return Array.from(candidates.values()).sort((a, b) => b.frequency - a.frequency);
}

// ========================================
// 热度统计（trending.json）
// ========================================

function loadTrending() {
  try {
    if (fs.existsSync(TRENDING_FILE)) {
      return JSON.parse(fs.readFileSync(TRENDING_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('[Scanner] trending.json 解析失败:', e.message);
  }
  return { terms: {}, lastScanTime: null, scanHistory: [] };
}

function saveTrending(data) {
  fs.writeFileSync(TRENDING_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 把本次扫描的候选词累加进 trending.json
 * @param {Array} candidates - extractTerms 返回值
 */
function recordMentions(candidates) {
  const data = loadTrending();
  data.terms = data.terms || {};
  const today = todayISO();

  candidates.forEach(c => {
    const key = c.term;
    if (!data.terms[key]) {
      data.terms[key] = {
        totalMentions: 0,
        lastSeen: null,
        firstSeen: new Date().toISOString(),
        history: [],
        sources: []
      };
    }
    const t = data.terms[key];
    t.totalMentions += c.frequency;
    t.lastSeen = new Date().toISOString();

    // 合并 sources
    c.sourceNames.forEach(s => {
      if (!t.sources.includes(s)) t.sources.push(s);
    });

    // 累加今天的 history
    const todayEntry = t.history.find(h => h.date === today);
    if (todayEntry) {
      todayEntry.count += c.frequency;
    } else {
      t.history.push({ date: today, count: c.frequency });
    }

    // 清理 30 天前的 history
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    t.history = t.history.filter(h => new Date(h.date) >= cutoff);
  });

  saveTrending(data);
  return data;
}

/**
 * 记录扫描历史
 * @param {object} entry - { time, sourcesHit, candidatesFound, newTerms, llmGenerated }
 */
function appendScanHistory(entry) {
  const data = loadTrending();
  data.scanHistory = data.scanHistory || [];
  data.scanHistory.push(entry);
  data.scanHistory = data.scanHistory.slice(-30); // 保留最近 30 次
  data.lastScanTime = entry.time;
  saveTrending(data);
}

// ========================================
// 主扫描函数
// ========================================

/**
 * 执行全渠道扫描
 * @param {Set} existingTermsLower - 现有词库术语名（小写）
 * @returns {object} { candidates, allArticles, sourcesHit }
 */
async function scanAllSources(existingTermsLower) {
  console.log('[Scanner] 开始多渠道扫描...');
  const config = loadSources();
  const allArticles = [];
  let sourcesHit = 0;

  // RSS
  const rssTasks = (config.rss || []).filter(s => s.enabled).map(s => {
    sourcesHit++;
    return fetchRSS(s);
  });
  const rssResults = await Promise.allSettled(rssTasks);
  rssResults.forEach(r => { if (r.status === 'fulfilled') allArticles.push(...r.value); });

  // Blogs
  const blogTasks = (config.blogs || []).filter(s => s.enabled).map(s => {
    sourcesHit++;
    return fetchBlog(s);
  });
  const blogResults = await Promise.allSettled(blogTasks);
  blogResults.forEach(r => { if (r.status === 'fulfilled') allArticles.push(...r.value); });

  // Reddit
  const redditTasks = (config.reddit || []).filter(s => s.enabled).map(s => {
    sourcesHit++;
    return fetchReddit(s);
  });
  const redditResults = await Promise.allSettled(redditTasks);
  redditResults.forEach(r => { if (r.status === 'fulfilled') allArticles.push(...r.value); });

  // HackerNews
  if (config.hackernews && config.hackernews.enabled) {
    sourcesHit++;
    const hnArticles = await fetchHackerNews(config.hackernews);
    allArticles.push(...hnArticles);
  }

  // Google Trends
  if (config.googleTrends && config.googleTrends.enabled) {
    sourcesHit++;
    const gtArticles = await fetchGoogleTrends(config.googleTrends);
    allArticles.push(...gtArticles);
  }

  console.log(`[Scanner] 共抓取 ${allArticles.length} 条内容，命中 ${sourcesHit} 个源`);

  // 提取候选术语
  const candidates = extractTerms(allArticles, existingTermsLower);
  console.log(`[Scanner] 提取到 ${candidates.length} 个候选术语`);

  // 记录热度
  recordMentions(candidates);

  return { candidates, allArticles, sourcesHit };
}

module.exports = {
  scanAllSources,
  loadSources,
  saveSources,
  loadTrending,
  saveTrending,
  appendScanHistory,
  extractTerms
};
