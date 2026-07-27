export const jinggangshanWorkflow = {
  run: {
    id: '井冈山-小红书全流程-20260725',
    status: 'COMPLETED',
    platform: '小红书',
    platformCode: 'xhs',
    topic: '红色文化与革命纪念地',
    updatedAt: '2026-07-25 22:06',
    publishingAuthorized: false,
    sourceLabel: '本地全流程产物'
  },
  stages: [
    { id: 'input', label: '解析讲解词', shortLabel: '解析', status: 'completed' },
    { id: 'hotspots', label: '检索热点', shortLabel: '热点', status: 'completed' },
    { id: 'selection', label: '选择爆款', shortLabel: '选择', status: 'completed' },
    { id: 'style', label: '提炼风格', shortLabel: '风格', status: 'completed' },
    { id: 'generation', label: '生成内容', shortLabel: '生成', status: 'completed' },
    { id: 'validation', label: '质量校验', shortLabel: '校验', status: 'completed' },
    { id: 'publish', label: '模拟发布', shortLabel: '发布', status: 'demo' }
  ],
  overview: [
    { label: '事实条目', value: '26', suffix: '条', tone: 'blue' },
    { label: '热点样本', value: '23', suffix: '篇', tone: 'purple' },
    { label: '爆款得分', value: '80.8', suffix: '分', tone: 'orange' },
    { label: '最终质量', value: '92', suffix: '分', tone: 'green' }
  ],
  request: {
    scenicSpot: '井冈山革命博物馆与革命旧址',
    intent: '把官方讲解词转化为小红书红色文化主题图文笔记',
    audience: '关注红色文化、历史旅行和研学的年轻游客',
    source: '官方讲解词 / 原始口播稿',
    suggestedDuration: '7 分钟',
    summary: '读取井冈山革命博物馆与革命旧址官方讲解词，检索小红书同主题热点，生成爆款风格特征、平台文案与配图。',
    guideExcerpt: '井冈山位于湘赣边界、罗霄山脉中段。1927年秋收起义后，毛泽东率领部队向井冈山进军，在这里开展武装斗争、土地革命和根据地建设。参观时可以带着三个问题：为什么要到农村建立根据地？怎样在封锁中生存和战斗？为什么群众支持关系到革命力量的存续？',
    facts: [
      '井冈山位于湘赣边界、罗霄山脉中段',
      '1927 年秋收起义后向井冈山进军',
      '1928 年相关会师推动革命力量发展',
      '重点场景包括茨坪、黄洋界、茅坪和龙市',
      '博物馆资料涵盖生活用品、武器、文件和群众工作',
      '开放范围与交通接驳以景区当天公告为准'
    ],
    guardrails: [
      '不得新增讲解词中没有的人物、日期、地点、关系或结论',
      '不得把传说、推测或争议信息改写为确定事实',
      '不得复制参考爆款的长句或图片'
    ]
  },
  hotspots: [
    {
      rank: 1,
      title: '“久有凌云志，重上井冈山”',
      likes: 4919,
      score: 80.8,
      label: '爆款',
      age: '4 天前',
      author: 'sonny',
      selected: true
    },
    {
      rank: 2,
      title: '吃水不忘挖井人！带你看看爷爷亲手挖的红井',
      likes: 8126,
      score: 78.57,
      label: '常青高热',
      age: '70 天前',
      author: '热点样本',
      selected: false
    },
    {
      rank: 3,
      title: '带我狗叔来井冈山…',
      likes: 3153,
      score: 71.75,
      label: '观察',
      age: '24 天前',
      author: '热点样本',
      selected: false
    },
    {
      rank: 4,
      title: '红军长征到底走了哪些地方？',
      likes: 1319,
      score: 68.32,
      label: '观察',
      age: '历史高热',
      author: '热点样本',
      selected: false
    },
    {
      rank: 5,
      title: '导游级攻略（江西井冈山2天最优路线）',
      likes: 191,
      score: 64.91,
      label: '观察',
      age: '攻略样本',
      author: '热点样本',
      selected: false
    }
  ],
  selectedHotspot: {
    contentId: '6a5f14b5000000001303fffc',
    title: '“久有凌云志，重上井冈山”',
    description: '#教员 #传承红色文化 #新青年',
    author: 'sonny',
    likes: 4919,
    score: 80.8,
    type: '图文笔记',
    reason: '近 7 天热度与互动综合得分最高，标题简洁、有记忆点，并包含青年身份和红色文化标签。'
  },
  style: {
    hook: '“久有凌云志，重上井冈山”',
    hookSource: '根据标题估算',
    keywords: ['新青年', '教员', '传承红色文化'],
    traits: [
      { label: '标题', value: '短句 + 强记忆点，避免解释过满' },
      { label: '开场', value: '用认知反差或设问，在首屏给出阅读理由' },
      { label: '结构', value: '一个核心视角，分三幕展开，段落短而清晰' },
      { label: '语气', value: '真诚、具体、有画面感，面向年轻游客' }
    ],
    limitation: '样本为图文笔记，没有口播转写；钩子结论来自标题与正文估算。'
  },
  contentPlan: {
    angle: '以“问题意识”切入红色旅行：不只看旧址，更带着三个核心问题走进现场。',
    hook: '别背年代了！来井冈山前，先记住这三个问题。',
    hookType: '认知颠覆型',
    tone: '真诚、具体、有画面感',
    structure: [
      '开篇设问：破除打卡式参观',
      '三幕展开：茨坪旧居 → 黄洋界 → 茅坪、龙市旧址群',
      '结尾回归：让文物和旧址成为问题的答案'
    ]
  },
  candidates: [
    {
      id: 'C01',
      title: '别背年代了！来井冈山先记住这3个问题',
      score: 92,
      selected: true,
      reason: '强设问开场，三幕事实闭环，信息密度和画面感最均衡。'
    },
    {
      id: 'C02',
      title: '走进井冈山：一座旧址就是一份生存方案',
      score: 85,
      selected: false,
      reason: '视角有创意，但开场留存力与关键词匹配略弱。'
    },
    {
      id: 'C03',
      title: '文物不会说话，却回答了井冈山的3个问题',
      score: 88,
      selected: false,
      reason: '好奇心强、事实覆盖广，但部分隐喻略显抽象。'
    }
  ],
  finalPost: {
    title: '别只背年代｜用3个问题读懂井冈山',
    body: `来井冈山，别急着只记1927和1928。带着这3个问题看旧址，历史会更清楚：

❶ 为什么要到农村建立根据地？
1927年秋收起义后，毛泽东率领部队向井冈山进军，在这里开展武装斗争、土地革命和根据地建设。茨坪的机关和领导人旧居、简朴房屋和狭小办公空间，让这段探索变得具体。

❷ 怎样在封锁中生存和战斗？
井冈山革命博物馆里的生活用品、武器、文件和群众工作资料给出线索。黄洋界山路狭窄、地势险要，1928年的黄洋界保卫战体现出地形、军民协同和坚定信念的重要作用。

❸ 为什么群众支持关系到革命力量的存续？
茅坪、龙市一带保存着会师、建军和根据地政权建设相关旧址。它们提醒我们：井冈山斗争不仅是军事斗争，也包括党的建设、军队建设、群众工作和社会治理的探索。

带着问题看，旧址不再只是静止的背景。井冈山精神，正是在这些具体实践中逐步形成。

参观当天的交通接驳和开放范围，请以景区及博物馆公告为准。配图为AI生成的景区主题示意图。`,
    hashtags: ['#井冈山', '#红色文化', '#新青年', '#传承红色文化', '#井冈山革命博物馆'],
    provider: '通义千问兼容接口',
    factIds: 18
  },
  images: [
    {
      id: 'I01',
      src: '/assets/jinggangshan/I01.png',
      label: '封面图',
      scene: '云雾山林与蜿蜒山路',
      prompt: '3:4 竖版封面，井冈山云雾群峰、茂密山林与蜿蜒山路，上方留出标题空间，无人物、无文字。'
    },
    {
      id: 'I02',
      src: '/assets/jinggangshan/I02.png',
      label: '场景图 1',
      scene: '黄洋界山路',
      prompt: '3:4 竖版，黄洋界狭窄山路、薄雾和森林，强调地势险要与纵深感，无人物、无文字。'
    },
    {
      id: 'I03',
      src: '/assets/jinggangshan/I03.png',
      label: '场景图 2',
      scene: '茨坪简朴旧居',
      prompt: '3:4 竖版，茨坪简朴旧居、林间道路与柔和自然光，纪实旅行摄影风格，无人物、无文字。'
    }
  ],
  validation: {
    valid: true,
    titleChars: 16,
    bodyChars: 415,
    hashtagCount: 5,
    factCoverage: 69.23,
    longestReferenceSpan: 3,
    actions: [
      '删除 Fact Pack 未提供的具体文物、陈设、动作和现场痕迹',
      '保留所选爆款的简洁记忆感和青年身份关键词，不复制原句',
      '重新执行候选校验，标题、正文、标签与事实边界全部通过'
    ]
  }
}

export default jinggangshanWorkflow
