// 人格类型数据
const PERSONALITY_TYPES = [
  { id: 1, type_name: "逻辑分析型", traits: "思维缜密理性，擅长拆解复杂问题，注重数据与逻辑，做事严谨有条理", abilities: "超强逻辑推演、理性思辨拆解能力...数据敏感挖掘、定量分析建模能力...客观冷静独立判断能力", reason: "天生擅长理性复盘、数据核算、规律研判，和金融审计、数据分析、技术编程岗位完美匹配", careers: ["数据分析师", "软件工程师", "审计师", "金融分析师"] },
  { id: 2, type_name: "社交沟通型", traits: "擅长表达共情，热衷与人打交道，团队协作力强，擅长维护关系与协调沟通", abilities: "超强语言表达、共情倾听能力...多方协调谈判、人脉维护社交能力...临场应变、公众表达说服能力", reason: "天生擅长人际交往、共情说服、资源对接，和市场销售、公关HR、商务顾问类岗位完美契合", careers: ["人力资源专员", "市场营销专员", "公关专员", "销售顾问"] },
  { id: 3, type_name: "创意艺术型", traits: "想象力丰富，追求独特创新，反感刻板流程，擅长用灵感打造个性化内容与作品", abilities: "天马行空想象力、突破性创新构思能力...高级审美感知、视觉文字内容创作能力...跨界脑洞融合、潮流趋势捕捉能力", reason: "天生不受条条框框束缚，擅长审美创作、新鲜策划、内容革新，是设计、文案编导类岗位的天赋型人选", careers: ["平面设计师", "文案策划", "新媒体编导", "艺术指导"] },
  { id: 4, type_name: "务实执行型", traits: "动手能力突出，注重实际落地，擅长解决具象问题，做事踏实高效、执行力拉满", abilities: "超强动手实操、技术落地攻坚能力...耐心细致流程落地、现场问题应急处理能力...抗压踏实专注执行能力", reason: "天生偏爱动手实干、问题落地解决、硬核技术钻研，完美适配工程建筑、医护实操、技术运维等实干类岗位", careers: ["机械工程师", "建筑工程师", "护士", "技术支持工程师"] },
  { id: 5, type_name: "统筹领导型", traits: "有全局视野，擅长决策规划，具备组织管理能力，愿意承担责任、带领团队推进目标", abilities: "长远全局视野、整体目标规划统筹能力...团队管理带队、资源分配决策能力...风险预判大局权衡能力", reason: "天生自带领袖格局、全局统筹思维与带队决策天赋，和项目管理、企业运营、管培管理层岗位高度匹配", careers: ["企业管理培训生", "项目主管", "运营经理", "行政总监"] },
  { id: 6, type_name: "探索研究型", traits: "好奇心极强，热衷钻研未知领域，喜欢深度思考与学术探索，追求专业领域的深度突破", abilities: "极致深度求知、底层原理深挖钻研能力...长期专注学术深耕、实验复盘验证能力...独立深度思考、前沿新知探索学习能力", reason: "天生好奇心强、偏爱深度学术钻研、专注长期专项探索，完全适配科研实验、专利研发、学术编辑等研究类职业", careers: ["科研研究员", "实验室技术员", "学术编辑", "专利分析师"] },
  { id: 7, type_name: "共情服务型", traits: "内心细腻温暖，善于体察他人情绪，乐于帮助他人，适合从事关怀类、服务类工作", abilities: "超强细腻情绪感知、共情同理包容能力...温柔耐心陪伴、情绪疏导安抚能力...细心贴心助人服务能力", reason: "天生共情力拉满、温柔耐心擅长治愈陪伴，和心理咨询、早教教育、健康社工等关怀助人类职业内核完全契合", careers: ["心理咨询师", "社会工作者", "早教老师", "健康管理师"] },
  { id: 8, type_name: "规划细节型", traits: "做事细致周全，擅长规划统筹，注重流程规范，能精准把控细节、规避疏漏", abilities: "极致细节核查、周全严谨规整能力...规则流程遵守、合规风险排查能力...长期耐心统筹归档、事前规划预判能力", reason: "天生细心缜密、守规矩重流程、擅长细节风控账目统筹，完美适配财务会计、行政档案、供应链合规等规整类岗位", careers: ["财务会计", "行政文员", "档案管理员", "供应链专员"] }
];

function calculateSimilarity(userTags, personality) {
  const text = (personality.traits + ' ' + personality.abilities).toLowerCase();
  let totalScore = 0;
  for (const [tag, score] of Object.entries(userTags)) {
    if (text.includes(tag.toLowerCase())) {
      totalScore += score * 2;
    }
  }
  return totalScore;
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // 匹配接口
    if (path === '/api/match') {
      try {
        const { tags } = await request.json();
        if (!tags) {
          return new Response(JSON.stringify({ success: false, error: '缺少用户标签' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }

        let bestMatch = PERSONALITY_TYPES[0];
        let bestScore = -1;
        for (const p of PERSONALITY_TYPES) {
          const s = calculateSimilarity(tags, p);
          if (s > bestScore) {
            bestScore = s;
            bestMatch = p;
          }
        }

        return new Response(JSON.stringify({
          success: true,
          personality: { type_name: bestMatch.type_name, traits: bestMatch.traits, abilities: bestMatch.abilities, reason: bestMatch.reason },
          careers: bestMatch.careers
        }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
    }

    // AI 建议接口
    if (path === '/api/ai-suggestion') {
      try {
        const { tags, personality, careers } = await request.json();
        const prompt = `你是一位资深职业规划师。请根据以下信息给出具体发展建议。\n用户标签得分：${JSON.stringify(tags)}\n最匹配人格类型：${personality?.type_name || '未指定'}\n人格描述：${personality?.traits || ''}\n推荐职业：${(careers || []).join('、')}\n请为每个推荐职业提供成长路径、学习资源、行业前景。简洁条列式，不要开场白。`;

        const DEEPSEEK_KEY = 'sk-05123421fa6f47c5b80cfe1fcae81d08';  // ← 替换成你的真密钥

        const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${DEEPSEEK_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], max_tokens: 1500 })
        });

        const data = await resp.json();
        if (!data.choices || !data.choices[0]) {
          return new Response(JSON.stringify({ success: false, error: 'DeepSeek 返回异常: ' + JSON.stringify(data) }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
        }

        const suggestion = data.choices[0].message.content;
        return new Response(JSON.stringify({ success: true, suggestion }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};