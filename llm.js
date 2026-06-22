/**
 * LLM 调用模块
 * 为新发现的术语生成完整词条信息
 * 支持热度上下文输入（生成更贴合当下语境的释义）
 */
const axios = require('axios');

const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

/**
 * 轻量版：只为术语生成 brief（一句话解释）+ chinese（中文翻译）
 * 用于热词榜单的快速解释，比 generateTermEntry 快且省 token
 * @param {string} term - 英文术语
 * @param {number} frequency - 在抓取中出现的次数
 * @param {string[]} sources - 出现的来源列表
 * @returns {object} { brief, chinese }
 */
async function generateTermBrief(term, frequency, sources) {
  const hotLine = frequency > 0
    ? `\n该术语最近在 AI 行业信息源中被提及 ${frequency} 次（来源：${(sources || []).slice(0, 3).join('、') || '多渠道'}），属于近期高频热词。`
    : '';

  const prompt = `你是一个AI术语库的编辑助手。请为以下AI领域术语生成简短解释。

术语：${term}${hotLine}

请严格按以下JSON格式返回（不要markdown代码块标记）：
{
  "chinese": "中文译名（如有通用译法用通用译法，否则直译）",
  "brief": "一句话解释（15-30字，通俗语言，让非技术人员也能理解）"
}

要求：
1. chinese：如有约定俗成的中文译法用译法，没有则直译，不要加括号注释
2. brief：用大白话，避免专业术语，控制在15-30字
3. 只返回JSON，不要任何其他内容`;

  try {
    const response = await axios.post(
      `${LLM_BASE_URL}/chat/completions`,
      {
        model: LLM_MODEL,
        messages: [
          { role: 'system', content: '你是AI术语库编辑助手，负责生成简短易懂的术语解释。只返回JSON。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${LLM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const jsonStr = content.replace(/^```json?\s*\n?/, '').replace(/\n?```\s*$/, '');
    const data = JSON.parse(jsonStr);
    return {
      brief: data.brief || '（待补充）',
      chinese: data.chinese || ''
    };
  } catch (error) {
    console.error(`[LLM] 生成 brief "${term}" 失败:`, error.message);
    return {
      brief: '（待补充）',
      chinese: ''
    };
  }
}

/**
 * 调用 LLM 为术语生成完整词条
 * @param {string} term - 英文术语名
 * @param {string} context - 发现该术语的上下文（文章标题/摘要）
 * @param {string[]} existingTerms - 现有词库中的英文术语列表（用于生成关联词）
 * @param {object} [hotInfo] - 热度上下文 { frequency, sources }
 * @returns {object} 完整的术语对象
 */
async function generateTermEntry(term, context, existingTerms, hotInfo) {
  const hotLine = hotInfo && hotInfo.frequency
    ? `\n该术语在最近抓取中出现了 ${hotInfo.frequency} 次，来源：${(hotInfo.sources || []).join('、') || '未知'}。请在 brief 中体现其当前热度语境。`
    : '';

  const prompt = `你是一个AI术语库的编辑助手。请为以下AI术语生成完整的词条信息。

术语：${term}
发现上下文：${context}${hotLine}

现有词库中的术语列表（用于选择关联词，只能从中选择）：
${existingTerms.join('、')}

请严格按照以下JSON格式返回（不要包含markdown代码块标记）：
{
  "initial": "首字母大写",
  "english": "英文术语",
  "chinese": "中文翻译",
  "brief": "一句话解释（15-25字，通俗易懂，AI生成）",
  "definition": "官方定义（必须从指定权威来源中原文引用或准确翻译）",
  "example": "生活化示例（用比喻帮小白理解，50-80字，AI生成）",
  "related": ["关联术语1", "关联术语2", "关联术语3"],
  "source": "官方定义所引用的来源URL（必须是以下8个之一）"
}

【关键约束】官方定义(definition)必须且只能从以下8个权威来源中引用：
1. https://www.britannica.com/technology/artificial-intelligence/Methods-and-goals-in-AI （大英百科全书）
2. https://www.bu.edu/articles/2024/what-is-artificial-intelligence-ai-at-bu-a-to-z/ （波士顿大学）
3. https://hai.stanford.edu/ai-definitions （斯坦福大学 HAI）
4. https://www.coursera.org/resources/ai-terms （Coursera）
5. https://developers.google.com/machine-learning/glossary （Google ML Glossary）
6. https://www.cnet.com/tech/services-and-software/chatgpt-glossary-50-ai-terms-everyone-should-know/ （CNET）
7. https://huggingface.co/blog/agent-glossary （Hugging Face）
8. https://en.wikipedia.org/wiki/Glossary_of_artificial_intelligence （维基百科）

要求：
1. brief（一句话解释）：AI生成，用通俗语言，让非技术人员也能理解
2. definition（官方定义）：必须从上述8个来源中找到该术语的定义，原文翻译为中文。如果8个来源中都没有该术语的定义，请使用最接近的来源内容并在source中标注
3. example（示例）：AI生成，用生活中的比喻来解释
4. related：必须从现有词库列表中选择3个最相关的
5. source：填写definition所引用的来源URL（必须是上述8个URL之一）`;

  try {
    const response = await axios.post(
      `${LLM_BASE_URL}/chat/completions`,
      {
        model: LLM_MODEL,
        messages: [
          { role: 'system', content: '你是AI术语库编辑助手，负责生成高质量的术语词条。只返回JSON，不要任何其他内容。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${LLM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const jsonStr = content.replace(/^```json?\s*\n?/, '').replace(/\n?```\s*$/, '');
    const termData = JSON.parse(jsonStr);

    return {
      initial: termData.initial || term[0].toUpperCase(),
      english: termData.english || term,
      chinese: termData.chinese || '',
      brief: termData.brief || '',
      definition: termData.definition || '',
      example: termData.example || '',
      related: Array.isArray(termData.related) ? termData.related : [],
      source: termData.source || ''
    };
  } catch (error) {
    console.error(`[LLM] 生成术语 "${term}" 失败:`, error.message);
    return {
      initial: term[0].toUpperCase(),
      english: term,
      chinese: '',
      brief: '（待补充）',
      definition: '（待补充 - LLM生成失败）',
      example: '',
      related: [],
      source: ''
    };
  }
}

module.exports = { generateTermEntry, generateTermBrief };
