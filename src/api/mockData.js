// Mock数据
export const platformData = {
  xiaohongshu: {
    period: "统计周期 07-18 至 07-24",
    summary: { score: "73%", views: "3", favorites: "0", comments: "0" },
    metrics: {
      exposure: { value: "16", change: "-57%" },
      views: { value: "3", change: "-50%" },
      likes: { value: "0", change: "-" },
      comments: { value: "0", change: "-" },
      netFollowers: { value: "1", change: "-" },
      newFollowers: { value: "1", change: "-" },
      coverCtr: { value: "18.8", suffix: "%", change: "+18%" },
      completion: { value: "0", suffix: "%", change: "-" },
      favorites: { value: "0", change: "-" },
      shares: { value: "0", change: "-" },
      unfollows: { value: "0", change: "-" },
      profileVisitors: { value: "5", change: "-37%" }
    }
  },
  douyin: {
    period: "统计周期 07-18 至 07-24",
    summary: { score: "86%", views: "8,932", favorites: "418", comments: "286" },
    metrics: {
      exposure: { value: "12,486", change: "+24%" },
      views: { value: "8,932", change: "+18%" },
      likes: { value: "1,203", change: "+31%" },
      comments: { value: "286", change: "+12%" },
      netFollowers: { value: "96", change: "+15%" },
      newFollowers: { value: "122", change: "+22%" },
      coverCtr: { value: "32.4", suffix: "%", change: "+6%" },
      completion: { value: "41.7", suffix: "%", change: "+9%" },
      favorites: { value: "418", change: "+17%" },
      shares: { value: "164", change: "+14%" },
      unfollows: { value: "26", change: "-8%" },
      profileVisitors: { value: "703", change: "+19%" }
    }
  },
  wechat: {
    period: "统计周期 07-18 至 07-24",
    summary: { score: "68%", views: "4,281", favorites: "188", comments: "67" },
    metrics: {
      exposure: { value: "5,624", change: "+11%" },
      views: { value: "4,281", change: "+7%" },
      likes: { value: "342", change: "+5%" },
      comments: { value: "67", change: "+3%" },
      netFollowers: { value: "43", change: "+9%" },
      newFollowers: { value: "58", change: "+12%" },
      coverCtr: { value: "21.6", suffix: "%", change: "-4%" },
      completion: { value: "63.8", suffix: "%", change: "+8%" },
      favorites: { value: "188", change: "+6%" },
      shares: { value: "95", change: "+10%" },
      unfollows: { value: "15", change: "-5%" },
      profileVisitors: { value: "286", change: "+4%" }
    }
  },
  bilibili: {
    period: "统计周期 07-18 至 07-24",
    summary: { score: "79%", views: "6,742", favorites: "527", comments: "174" },
    metrics: {
      exposure: { value: "8,305", change: "+16%" },
      views: { value: "6,742", change: "+13%" },
      likes: { value: "956", change: "+21%" },
      comments: { value: "174", change: "+8%" },
      netFollowers: { value: "71", change: "+11%" },
      newFollowers: { value: "88", change: "+15%" },
      coverCtr: { value: "27.9", suffix: "%", change: "+3%" },
      completion: { value: "52.1", suffix: "%", change: "+5%" },
      favorites: { value: "527", change: "+18%" },
      shares: { value: "209", change: "+9%" },
      unfollows: { value: "17", change: "-6%" },
      profileVisitors: { value: "441", change: "+7%" }
    }
  }
}

export const trendRecommendations = [
  {
    id: 1,
    tag: '#经典景点',
    top: 'Top 1',
    title: '打卡万里长城啦！',
    meta: '32.5万人参与，15.3亿浏览',
    copy:
      '说明：适用于xxxxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxxxx推广，',
    image: '/assets/reference-photo.png'
  },
  {
    id: 2,
    tag: '#经典景点',
    top: 'Top 2',
    title: '打卡万里长城啦！',
    meta: '32.5万人参与，15.3亿浏览',
    copy:
      '说明：适用于xxxxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxxxx推广，',
    image: '/assets/reference-photo.png'
  },
  {
    id: 3,
    tag: '#经典景点',
    top: 'Top 3',
    title: '打卡万里长城啦！',
    meta: '32.5万人参与，15.3亿浏览',
    copy:
      '说明：适用于xxxxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxxxx推广，',
    image: '/assets/reference-photo.png'
  },
  {
    id: 4,
    tag: '#经典景点',
    top: 'Top 4',
    title: '打卡万里长城啦！',
    meta: '32.5万人参与，15.3亿浏览',
    copy:
      '说明：适用于xxxxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxxxx推广，',
    image: '/assets/reference-photo.png'
  }
]

export const noteTrackingData = {
  xiaohongshu: {
    periods: {
      '7d': {
        range: '统计周期 07-21 至 07-27',
        overview: [
          { label: '发布笔记数', value: '12', meta: '较上周期 +3 篇' },
          { label: '总浏览量', value: '8,426', meta: '环比 +18%' },
          { label: '总互动量', value: '1,124', meta: '收藏评论占比 19%' },
          { label: '最佳发布时间', value: '18:00-21:00', meta: '晚高峰转化更高' }
        ],
        trendChart: {
          labels: ['07-21', '07-22', '07-23', '07-24', '07-25', '07-26', '07-27'],
          views: [684, 936, 1214, 1334, 1886, 2372, 8426],
          likes: [46, 72, 96, 128, 214, 356, 612],
          comments: [8, 13, 18, 29, 43, 67, 93]
        },
        notes: [
          {
            id: 'xhs-7-1',
            title: '大理古城日落漫游攻略',
            meta: '10.8万人参与，4,328次浏览',
            date: '2026-07-26  19:42',
            publishedAt: '2026-07-26T19:42:00',
            desc: '围绕古城漫游路线、拍照机位与夜游美食展开，标题和首图点击表现明显优于近30日均值。',
            stats: ['浏览 4,328', '点赞 356', '收藏 426', '评论 93', '分享 61'],
            status: '爆款增长',
            thumbLabel: '古城日落',
            thumbClass: 'note-thumb-sunset',
            sortWeight: 96,
            tags: ['大理古城', '日落机位', '旅行路线'],
            detail: {
              headline: '收藏率 9.8%，封面点击率明显高于平台均值',
              score: '84%',
              summary: { views: '4,328', favorites: '426', comments: '93' },
              metrics: [
                { label: '曝光数', value: '1.82万', change: '+18%' },
                { label: '阅读量', value: '4,328', change: '+22%' },
                { label: '点赞数', value: '356', change: '+11%' },
                { label: '收藏数', value: '426', change: '+27%' },
                { label: '评论数', value: '93', change: '+14%' },
                { label: '主页访问', value: '174', change: '+9%' }
              ],
              trend: [
                { label: '发布24h', value: '1,126', percent: 36 },
                { label: '发布48h', value: '2,042', percent: 58 },
                { label: '发布72h', value: '3,125', percent: 76 },
                { label: '近7日沉淀', value: '4,328', percent: 100 }
              ],
              insight: '这篇笔记在“路线 + 打卡机位 + 夜游氛围”组合上表现最好，建议后续继续沿用首图大字标题和三段式正文结构。'
            }
          },
          {
            id: 'xhs-7-2',
            title: '洱海骑行一日路线',
            meta: '8.3万人参与，2,764次浏览',
            date: '2026-07-25  17:18',
            publishedAt: '2026-07-25T17:18:00',
            desc: '内容以轻攻略为主，收藏量稳定，评论集中在路线安排和交通建议。',
            stats: ['浏览 2,764', '点赞 214', '收藏 298', '评论 57', '分享 34'],
            status: '稳定转化',
            thumbLabel: '洱海骑行',
            thumbClass: 'note-thumb-sea',
            sortWeight: 78,
            tags: ['洱海骑行', '一日游', '交通建议'],
            detail: {
              headline: '收藏率稳定，适合作为长期引流内容',
              score: '76%',
              summary: { views: '2,764', favorites: '298', comments: '57' },
              metrics: [
                { label: '曝光数', value: '1.09万', change: '+9%' },
                { label: '阅读量', value: '2,764', change: '+12%' },
                { label: '点赞数', value: '214', change: '+6%' },
                { label: '收藏数', value: '298', change: '+18%' },
                { label: '评论数', value: '57', change: '+8%' },
                { label: '主页访问', value: '92', change: '+4%' }
              ],
              trend: [
                { label: '发布24h', value: '864', percent: 31 },
                { label: '发布48h', value: '1,692', percent: 61 },
                { label: '发布72h', value: '2,215', percent: 80 },
                { label: '近7日沉淀', value: '2,764', percent: 100 }
              ],
              insight: '适合继续增加“停车点位”“补给点”类信息，能进一步提升评论区停留和收藏动作。'
            }
          },
          {
            id: 'xhs-7-3',
            title: '喜洲古镇拍照点合集',
            meta: '6.6万人参与，1,334次浏览',
            date: '2026-07-24  14:08',
            publishedAt: '2026-07-24T14:08:00',
            desc: '首图审美统一，但正文信息密度偏高，阅读完成率低于平台平均。',
            stats: ['浏览 1,334', '点赞 128', '收藏 167', '评论 29', '分享 18'],
            status: '待优化',
            thumbLabel: '喜洲拍照',
            thumbClass: 'note-thumb-city',
            sortWeight: 61,
            tags: ['喜洲古镇', '拍照打卡', '机位合集'],
            detail: {
              headline: '封面吸引力不错，但正文信息节奏需要精简',
              score: '63%',
              summary: { views: '1,334', favorites: '167', comments: '29' },
              metrics: [
                { label: '曝光数', value: '6,508', change: '-3%' },
                { label: '阅读量', value: '1,334', change: '-5%' },
                { label: '点赞数', value: '128', change: '+2%' },
                { label: '收藏数', value: '167', change: '+4%' },
                { label: '评论数', value: '29', change: '-6%' },
                { label: '主页访问', value: '44', change: '-2%' }
              ],
              trend: [
                { label: '发布24h', value: '522', percent: 39 },
                { label: '发布48h', value: '894', percent: 67 },
                { label: '发布72h', value: '1,074', percent: 81 },
                { label: '近7日沉淀', value: '1,334', percent: 100 }
              ],
              insight: '建议把单篇图文压缩到 5 张以内，并把“拍照建议”前置，能更快建立读者预期。'
            }
          }
        ]
      },
      '30d': {
        range: '统计周期 06-28 至 07-27',
        overview: [
          { label: '发布笔记数', value: '38', meta: '较上月 +8 篇' },
          { label: '总浏览量', value: '2.9万', meta: '环比 +26%' },
          { label: '总互动量', value: '4,218', meta: '收藏占互动 34%' },
          { label: '最佳发布时间', value: '17:30-20:30', meta: '节假日前一天更强' }
        ],
        trendChart: {
          labels: ['06-28', '07-03', '07-08', '07-13', '07-18', '07-23', '07-27'],
          views: [2840, 4186, 5274, 6182, 8963, 12840, 29000],
          likes: [214, 322, 384, 468, 706, 936, 1842],
          comments: [52, 74, 119, 142, 164, 218, 486]
        },
        notes: [
          {
            id: 'xhs-30-1',
            title: '大理四天三晚懒人攻略',
            meta: '22.4万人参与，8,963次浏览',
            date: '2026-07-18  20:06',
            publishedAt: '2026-07-18T20:06:00',
            desc: '这篇是近30日累计表现最好的内容，搜索入口与首页推荐入口占比较均衡。',
            stats: ['浏览 8,963', '点赞 706', '收藏 982', '评论 164', '分享 113'],
            status: '月度最佳',
            thumbLabel: '四天三晚',
            thumbClass: 'note-thumb-mountain',
            sortWeight: 98,
            tags: ['四天三晚', '懒人攻略', '路线推荐'],
            detail: {
              headline: '搜索流量和推荐流量分布均衡，是最稳的承接内容',
              score: '88%',
              summary: { views: '8,963', favorites: '982', comments: '164' },
              metrics: [
                { label: '曝光数', value: '3.76万', change: '+32%' },
                { label: '阅读量', value: '8,963', change: '+29%' },
                { label: '点赞数', value: '706', change: '+24%' },
                { label: '收藏数', value: '982', change: '+35%' },
                { label: '评论数', value: '164', change: '+18%' },
                { label: '主页访问', value: '342', change: '+15%' }
              ],
              trend: [
                { label: '发布24h', value: '2,341', percent: 26 },
                { label: '发布72h', value: '5,218', percent: 58 },
                { label: '发布7日', value: '7,026', percent: 78 },
                { label: '近30日沉淀', value: '8,963', percent: 100 }
              ],
              insight: '适合作为首页固定爆款模板，后续可以只替换目的地与预算模块继续复用。'
            }
          },
          {
            id: 'xhs-30-2',
            title: '苍山索道避坑清单',
            meta: '14.8万人参与，5,274次浏览',
            date: '2026-07-09  11:24',
            publishedAt: '2026-07-09T11:24:00',
            desc: '问题导向文案转化不错，评论区集中在天气、排队和购票说明。',
            stats: ['浏览 5,274', '点赞 384', '收藏 532', '评论 119', '分享 45'],
            status: '搜索承接',
            thumbLabel: '索道避坑',
            thumbClass: 'note-thumb-film',
            sortWeight: 82,
            tags: ['苍山索道', '避坑清单', '交通说明'],
            detail: {
              headline: '高意图用户明显更多，评论区答疑价值高',
              score: '79%',
              summary: { views: '5,274', favorites: '532', comments: '119' },
              metrics: [
                { label: '曝光数', value: '2.08万', change: '+16%' },
                { label: '阅读量', value: '5,274', change: '+12%' },
                { label: '点赞数', value: '384', change: '+8%' },
                { label: '收藏数', value: '532', change: '+21%' },
                { label: '评论数', value: '119', change: '+17%' },
                { label: '主页访问', value: '188', change: '+5%' }
              ],
              trend: [
                { label: '发布24h', value: '1,508', percent: 29 },
                { label: '发布72h', value: '3,024', percent: 57 },
                { label: '发布7日', value: '4,182', percent: 79 },
                { label: '近30日沉淀', value: '5,274', percent: 100 }
              ],
              insight: '建议在正文前两屏直接补充“是否值得排队”结论，能进一步提高停留与分享。'
            }
          }
        ]
      }
    }
  },
  douyin: {
    periods: {
      '7d': {
        range: '统计周期 07-21 至 07-27',
        overview: [
          { label: '发布视频数', value: '9', meta: '较上周期 +2 条' },
          { label: '总播放量', value: '3.6万', meta: '环比 +24%' },
          { label: '总互动量', value: '2,986', meta: '点赞占比最高' },
          { label: '最佳发布时间', value: '20:00-22:00', meta: '夜间推流更集中' }
        ],
        trendChart: {
          labels: ['07-21', '07-22', '07-23', '07-24', '07-25', '07-26', '07-27'],
          views: [2418, 3862, 5214, 6418, 7826, 8932, 36000],
          likes: [218, 346, 512, 905, 1082, 1203, 2140],
          comments: [36, 58, 84, 205, 238, 286, 421]
        },
        notes: [
          {
            id: 'dy-7-1',
            title: '长城日落机位攻略',
            meta: '16.2万人参与，8,932次播放',
            date: '2026-07-26  20:15',
            publishedAt: '2026-07-26T20:15:00',
            desc: '前三秒镜头完成度高，点赞转评链路顺滑，是近7日最强视频。',
            stats: ['播放 8,932', '点赞 1,203', '收藏 418', '评论 286', '转发 164'],
            status: '高热传播',
            thumbLabel: '长城日落',
            thumbClass: 'note-thumb-sunset',
            sortWeight: 97,
            tags: ['长城', '日落机位', '短视频脚本'],
            detail: {
              headline: '完播率和互动率双高，适合继续做系列化内容',
              score: '89%',
              summary: { views: '8,932', favorites: '418', comments: '286' },
              metrics: [
                { label: '曝光数', value: '1.25万', change: '+24%' },
                { label: '播放量', value: '8,932', change: '+18%' },
                { label: '点赞数', value: '1,203', change: '+31%' },
                { label: '评论数', value: '286', change: '+12%' },
                { label: '转发数', value: '164', change: '+14%' },
                { label: '涨粉数', value: '96', change: '+15%' }
              ],
              trend: [
                { label: '发布3h', value: '2,218', percent: 25 },
                { label: '发布12h', value: '5,406', percent: 61 },
                { label: '发布24h', value: '7,428', percent: 83 },
                { label: '近7日沉淀', value: '8,932', percent: 100 }
              ],
              insight: '镜头切换和字幕节奏已经形成模板，后续只需替换目的地素材即可快速复用。'
            }
          },
          {
            id: 'dy-7-2',
            title: '夜游古城路线合集',
            meta: '12.8万人参与，6,418次播放',
            date: '2026-07-25  18:40',
            publishedAt: '2026-07-25T18:40:00',
            desc: '用户更偏好“路线推荐 + 拍摄氛围”组合，评论区有较多求定位互动。',
            stats: ['播放 6,418', '点赞 905', '收藏 286', '评论 205', '转发 96'],
            status: '持续增长',
            thumbLabel: '夜游路线',
            thumbClass: 'note-thumb-city',
            sortWeight: 84,
            tags: ['古城夜游', '路线合集', '夜景拍摄'],
            detail: {
              headline: '评论区讨论度好，适合补充二创版本',
              score: '81%',
              summary: { views: '6,418', favorites: '286', comments: '205' },
              metrics: [
                { label: '曝光数', value: '9,842', change: '+16%' },
                { label: '播放量', value: '6,418', change: '+11%' },
                { label: '点赞数', value: '905', change: '+19%' },
                { label: '评论数', value: '205', change: '+13%' },
                { label: '转发数', value: '96', change: '+9%' },
                { label: '涨粉数', value: '62', change: '+8%' }
              ],
              trend: [
                { label: '发布3h', value: '1,604', percent: 25 },
                { label: '发布12h', value: '3,826', percent: 60 },
                { label: '发布24h', value: '5,214', percent: 81 },
                { label: '近7日沉淀', value: '6,418', percent: 100 }
              ],
              insight: '把定位信息做成置顶评论，能更好承接用户提问并提升二次互动。'
            }
          }
        ]
      },
      '30d': {
        range: '统计周期 06-28 至 07-27',
        overview: [
          { label: '发布视频数', value: '26', meta: '较上月 +6 条' },
          { label: '总播放量', value: '10.4万', meta: '环比 +31%' },
          { label: '总互动量', value: '8,216', meta: '评论增幅最快' },
          { label: '最佳发布时间', value: '19:30-22:30', meta: '晚间浏览更集中' }
        ],
        trendChart: {
          labels: ['06-28', '07-03', '07-08', '07-13', '07-18', '07-23', '07-27'],
          views: [8426, 12984, 18420, 26480, 42860, 71620, 104000],
          likes: [824, 1085, 1362, 2106, 2488, 3164, 4526],
          comments: [94, 141, 186, 352, 428, 586, 904]
        },
        notes: [
          {
            id: 'dy-30-1',
            title: '周末自驾看山海',
            meta: '9.6万人参与，1.7万次播放',
            date: '2026-07-12  17:08',
            publishedAt: '2026-07-12T17:08:00',
            desc: '强节奏剪辑带来了稳定完播，适合继续做“周末短逃离”系列。',
            stats: ['播放 1.7万', '点赞 2,106', '收藏 744', '评论 352', '转发 219'],
            status: '月度主推',
            thumbLabel: '山海自驾',
            thumbClass: 'note-thumb-sea',
            sortWeight: 95,
            tags: ['周末自驾', '山海路线', '短逃离'],
            detail: {
              headline: '完播率高，适合放大系列化标签',
              score: '87%',
              summary: { views: '1.7万', favorites: '744', comments: '352' },
              metrics: [
                { label: '曝光数', value: '2.86万', change: '+22%' },
                { label: '播放量', value: '1.7万', change: '+17%' },
                { label: '点赞数', value: '2,106', change: '+26%' },
                { label: '评论数', value: '352', change: '+14%' },
                { label: '转发数', value: '219', change: '+11%' },
                { label: '涨粉数', value: '164', change: '+20%' }
              ],
              trend: [
                { label: '发布3h', value: '3,514', percent: 21 },
                { label: '发布24h', value: '9,826', percent: 58 },
                { label: '发布7日', value: '1.4万', percent: 82 },
                { label: '近30日沉淀', value: '1.7万', percent: 100 }
              ],
              insight: '建议后续补一版“花费清单”结尾，会更适合吸引高意图评论。'
            }
          },
          {
            id: 'dy-30-2',
            title: '古城航拍转场模板',
            meta: '6.4万人参与，9,842次播放',
            date: '2026-07-03  21:26',
            publishedAt: '2026-07-03T21:26:00',
            desc: '模板化强，收藏保存高于点赞，适合引流给创作者人群。',
            stats: ['播放 9,842', '点赞 1,085', '收藏 608', '评论 141', '转发 132'],
            status: '模板引流',
            thumbLabel: '航拍转场',
            thumbClass: 'note-thumb-film',
            sortWeight: 79,
            tags: ['航拍模板', '运镜转场', '创作参考'],
            detail: {
              headline: '收藏率高于平均值，适合作为创作者向内容承接页',
              score: '78%',
              summary: { views: '9,842', favorites: '608', comments: '141' },
              metrics: [
                { label: '曝光数', value: '1.68万', change: '+13%' },
                { label: '播放量', value: '9,842', change: '+9%' },
                { label: '点赞数', value: '1,085', change: '+12%' },
                { label: '评论数', value: '141', change: '+5%' },
                { label: '转发数', value: '132', change: '+8%' },
                { label: '涨粉数', value: '88', change: '+7%' }
              ],
              trend: [
                { label: '发布3h', value: '2,286', percent: 23 },
                { label: '发布24h', value: '5,684', percent: 58 },
                { label: '发布7日', value: '8,214', percent: 83 },
                { label: '近30日沉淀', value: '9,842', percent: 100 }
              ],
              insight: '适合增加“拍摄设备参数”信息，提升专业用户的收藏和复访。'
            }
          }
        ]
      }
    }
  },
  wechat: {
    periods: {
      '7d': {
        range: '统计周期 07-21 至 07-27',
        overview: [
          { label: '发布图文数', value: '6', meta: '较上周期 +1 篇' },
          { label: '总阅读量', value: '1.2万', meta: '环比 +9%' },
          { label: '总互动量', value: '1,084', meta: '分享转发提升明显' },
          { label: '最佳发布时间', value: '08:00-10:00', meta: '早间打开率更高' }
        ],
        trendChart: {
          labels: ['07-21', '07-22', '07-23', '07-24', '07-25', '07-26', '07-27'],
          views: [928, 1416, 2084, 3216, 4281, 6824, 12000],
          likes: [84, 126, 168, 286, 342, 426, 568],
          comments: [12, 18, 26, 52, 67, 82, 116]
        },
        notes: [
          {
            id: 'wx-7-1',
            title: '北京文化漫游路线',
            meta: '3.8万人参与，4,281次阅读',
            date: '2026-07-25  10:12',
            publishedAt: '2026-07-25T10:12:00',
            desc: '文章层次清晰，适合景区活动前做预约引导和路线推荐。',
            stats: ['阅读 4,281', '点赞 342', '收藏 188', '评论 67', '分享 95'],
            status: '稳定阅读',
            thumbLabel: '文化漫游',
            thumbClass: 'note-thumb-article',
            sortWeight: 83,
            tags: ['文化路线', '预约引导', '活动推荐'],
            detail: {
              headline: '阅读完成率较高，适合继续做城市文化系列',
              score: '74%',
              summary: { views: '4,281', favorites: '188', comments: '67' },
              metrics: [
                { label: '送达人数', value: '5,624', change: '+11%' },
                { label: '阅读量', value: '4,281', change: '+7%' },
                { label: '点赞数', value: '342', change: '+5%' },
                { label: '评论数', value: '67', change: '+3%' },
                { label: '分享数', value: '95', change: '+10%' },
                { label: '新增关注', value: '58', change: '+12%' }
              ],
              trend: [
                { label: '发布6h', value: '1,024', percent: 24 },
                { label: '发布24h', value: '2,816', percent: 66 },
                { label: '发布72h', value: '3,652', percent: 85 },
                { label: '近7日沉淀', value: '4,281', percent: 100 }
              ],
              insight: '文首摘要和路线地图有效承接了阅读，后续可补充更明确的出行成本说明。'
            }
          },
          {
            id: 'wx-7-2',
            title: '夏日景区活动日历',
            meta: '2.9万人参与，3,216次阅读',
            date: '2026-07-24  14:26',
            publishedAt: '2026-07-24T14:26:00',
            desc: '活动型内容转发率偏高，适合作为社群扩散入口。',
            stats: ['阅读 3,216', '点赞 286', '收藏 142', '评论 52', '分享 118'],
            status: '高转发',
            thumbLabel: '活动日历',
            thumbClass: 'note-thumb-city',
            sortWeight: 79,
            tags: ['活动日历', '社群传播', '周末安排'],
            detail: {
              headline: '活动信息清晰，社群转发效率高',
              score: '71%',
              summary: { views: '3,216', favorites: '142', comments: '52' },
              metrics: [
                { label: '送达人数', value: '4,208', change: '+6%' },
                { label: '阅读量', value: '3,216', change: '+9%' },
                { label: '点赞数', value: '286', change: '+8%' },
                { label: '评论数', value: '52', change: '+4%' },
                { label: '分享数', value: '118', change: '+16%' },
                { label: '新增关注', value: '33', change: '+6%' }
              ],
              trend: [
                { label: '发布6h', value: '892', percent: 28 },
                { label: '发布24h', value: '2,148', percent: 67 },
                { label: '发布72h', value: '2,806', percent: 87 },
                { label: '近7日沉淀', value: '3,216', percent: 100 }
              ],
              insight: '推荐在标题中继续保留明确时间词，能稳定提升转发与收藏。'
            }
          }
        ]
      },
      '30d': {
        range: '统计周期 06-28 至 07-27',
        overview: [
          { label: '发布图文数', value: '18', meta: '较上月 +4 篇' },
          { label: '总阅读量', value: '3.4万', meta: '环比 +14%' },
          { label: '总互动量', value: '2,984', meta: '分享贡献稳定' },
          { label: '最佳发布时间', value: '08:30-10:30', meta: '工作日更稳定' }
        ],
        trendChart: {
          labels: ['06-28', '07-03', '07-08', '07-13', '07-18', '07-23', '07-27'],
          views: [3618, 6238, 8412, 12460, 18620, 26400, 34000],
          likes: [238, 422, 618, 862, 1034, 1282, 1648],
          comments: [34, 79, 126, 188, 236, 314, 402]
        },
        notes: [
          {
            id: 'wx-30-1',
            title: '城市夜游灵感手册',
            meta: '2.1万人参与，8,412次阅读',
            date: '2026-07-07  09:03',
            publishedAt: '2026-07-07T09:03:00',
            desc: '内容适合做系列专栏，用户对“路线 + 时间安排”反馈积极。',
            stats: ['阅读 8,412', '点赞 618', '收藏 306', '评论 126', '分享 274'],
            status: '月度长尾',
            thumbLabel: '夜游手册',
            thumbClass: 'note-thumb-night',
            sortWeight: 88,
            tags: ['夜游路线', '时间安排', '城市灵感'],
            detail: {
              headline: '长尾阅读较强，适合作为内容矩阵底层承接',
              score: '77%',
              summary: { views: '8,412', favorites: '306', comments: '126' },
              metrics: [
                { label: '送达人数', value: '1.08万', change: '+9%' },
                { label: '阅读量', value: '8,412', change: '+13%' },
                { label: '点赞数', value: '618', change: '+10%' },
                { label: '评论数', value: '126', change: '+7%' },
                { label: '分享数', value: '274', change: '+19%' },
                { label: '新增关注', value: '84', change: '+8%' }
              ],
              trend: [
                { label: '发布6h', value: '1,608', percent: 19 },
                { label: '发布24h', value: '4,286', percent: 51 },
                { label: '发布7日', value: '6,942', percent: 82 },
                { label: '近30日沉淀', value: '8,412', percent: 100 }
              ],
              insight: '建议继续拆分为“亲子版”“情侣版”等衍生主题，利于矩阵扩散。'
            }
          },
          {
            id: 'wx-30-2',
            title: '景区预约避峰指南',
            meta: '1.6万人参与，6,238次阅读',
            date: '2026-07-02  08:46',
            publishedAt: '2026-07-02T08:46:00',
            desc: '服务型信息实用性高，用户收藏与分享都比较稳定。',
            stats: ['阅读 6,238', '点赞 422', '收藏 288', '评论 79', '分享 196'],
            status: '服务承接',
            thumbLabel: '预约避峰',
            thumbClass: 'note-thumb-mountain',
            sortWeight: 76,
            tags: ['预约攻略', '避峰指南', '服务信息'],
            detail: {
              headline: '高实用内容，适合作为用户服务型固定栏目',
              score: '73%',
              summary: { views: '6,238', favorites: '288', comments: '79' },
              metrics: [
                { label: '送达人数', value: '8,406', change: '+7%' },
                { label: '阅读量', value: '6,238', change: '+8%' },
                { label: '点赞数', value: '422', change: '+6%' },
                { label: '评论数', value: '79', change: '+4%' },
                { label: '分享数', value: '196', change: '+12%' },
                { label: '新增关注', value: '51', change: '+5%' }
              ],
              trend: [
                { label: '发布6h', value: '1,286', percent: 21 },
                { label: '发布24h', value: '3,408', percent: 55 },
                { label: '发布7日', value: '5,102', percent: 82 },
                { label: '近30日沉淀', value: '6,238', percent: 100 }
              ],
              insight: '可以在文末加入预约入口按钮，进一步提升服务转化效率。'
            }
          }
        ]
      }
    }
  },
  bilibili: {
    periods: {
      '7d': {
        range: '统计周期 07-21 至 07-27',
        overview: [
          { label: '发布视频数', value: '7', meta: '较上周期 +1 条' },
          { label: '总播放量', value: '2.1万', meta: '环比 +13%' },
          { label: '总互动量', value: '2,307', meta: '收藏投币稳步增长' },
          { label: '最佳发布时间', value: '19:00-21:30', meta: '晚饭后停留更高' }
        ],
        trendChart: {
          labels: ['07-21', '07-22', '07-23', '07-24', '07-25', '07-26', '07-27'],
          views: [1832, 2468, 3294, 4906, 6742, 11520, 21000],
          likes: [164, 242, 328, 728, 956, 1236, 1688],
          comments: [22, 36, 48, 102, 174, 218, 296]
        },
        notes: [
          {
            id: 'bl-7-1',
            title: '长城 Vlog 拍摄参考',
            meta: '7.2万人参与，6,742次播放',
            date: '2026-07-25  21:04',
            publishedAt: '2026-07-25T21:04:00',
            desc: '镜头与配乐适配度高，收藏和投币转化都优于站内平均。',
            stats: ['播放 6,742', '点赞 956', '收藏 527', '评论 174', '分享 209'],
            status: '高收藏',
            thumbLabel: 'Vlog参考',
            thumbClass: 'note-thumb-film',
            sortWeight: 91,
            tags: ['Vlog', '拍摄参考', '镜头脚本'],
            detail: {
              headline: '投币和收藏都偏高，适合继续做系列内容',
              score: '82%',
              summary: { views: '6,742', favorites: '527', comments: '174' },
              metrics: [
                { label: '曝光数', value: '8,305', change: '+16%' },
                { label: '播放量', value: '6,742', change: '+13%' },
                { label: '点赞数', value: '956', change: '+21%' },
                { label: '评论数', value: '174', change: '+8%' },
                { label: '分享数', value: '209', change: '+9%' },
                { label: '新增关注', value: '88', change: '+15%' }
              ],
              trend: [
                { label: '发布6h', value: '1,426', percent: 21 },
                { label: '发布24h', value: '3,982', percent: 59 },
                { label: '发布72h', value: '5,418', percent: 80 },
                { label: '近7日沉淀', value: '6,742', percent: 100 }
              ],
              insight: '建议在片尾加上“下期拍摄地投票”，有机会提升评论区参与度。'
            }
          },
          {
            id: 'bl-7-2',
            title: '古城夜景运镜模板',
            meta: '5.8万人参与，4,906次播放',
            date: '2026-07-24  16:32',
            publishedAt: '2026-07-24T16:32:00',
            desc: '适合偏创作教学向内容，收藏明显高于评论，用户更关注模板本身。',
            stats: ['播放 4,906', '点赞 728', '收藏 384', '评论 102', '分享 118'],
            status: '模板向',
            thumbLabel: '运镜模板',
            thumbClass: 'note-thumb-night',
            sortWeight: 75,
            tags: ['运镜模板', '夜景拍摄', '创作教程'],
            detail: {
              headline: '创作型用户占比更高，建议继续增强参数细节',
              score: '75%',
              summary: { views: '4,906', favorites: '384', comments: '102' },
              metrics: [
                { label: '曝光数', value: '6,924', change: '+10%' },
                { label: '播放量', value: '4,906', change: '+8%' },
                { label: '点赞数', value: '728', change: '+13%' },
                { label: '评论数', value: '102', change: '+5%' },
                { label: '分享数', value: '118', change: '+7%' },
                { label: '新增关注', value: '53', change: '+6%' }
              ],
              trend: [
                { label: '发布6h', value: '1,084', percent: 22 },
                { label: '发布24h', value: '2,862', percent: 58 },
                { label: '发布72h', value: '3,968', percent: 81 },
                { label: '近7日沉淀', value: '4,906', percent: 100 }
              ],
              insight: '可增加“设备参数 + 运镜节奏”两个固定模块，便于形成可复用模板。'
            }
          }
        ]
      },
      '30d': {
        range: '统计周期 06-28 至 07-27',
        overview: [
          { label: '发布视频数', value: '19', meta: '较上月 +5 条' },
          { label: '总播放量', value: '6.8万', meta: '环比 +19%' },
          { label: '总互动量', value: '7,426', meta: '收藏投币持续增长' },
          { label: '最佳发布时间', value: '18:30-21:00', meta: '节奏类视频更适配' }
        ],
        trendChart: {
          labels: ['06-28', '07-03', '07-08', '07-13', '07-18', '07-23', '07-27'],
          views: [5814, 8164, 12000, 18620, 29440, 46820, 68000],
          likes: [516, 986, 1244, 1486, 1868, 2342, 3016],
          comments: [68, 168, 204, 243, 296, 384, 462]
        },
        notes: [
          {
            id: 'bl-30-1',
            title: '山海旅行合集脚本',
            meta: '4.4万人参与，1.2万次播放',
            date: '2026-07-10  13:17',
            publishedAt: '2026-07-10T13:17:00',
            desc: '合集型内容在 B 站更适合拉高停留和收藏，是近30日的内容支柱。',
            stats: ['播放 1.2万', '点赞 1,486', '收藏 862', '评论 243', '分享 326'],
            status: '月度沉淀',
            thumbLabel: '旅行合集',
            thumbClass: 'note-thumb-sea',
            sortWeight: 93,
            tags: ['旅行合集', '脚本结构', '内容沉淀'],
            detail: {
              headline: '长尾播放明显，说明合集类内容更适合 B 站沉淀',
              score: '85%',
              summary: { views: '1.2万', favorites: '862', comments: '243' },
              metrics: [
                { label: '曝光数', value: '1.56万', change: '+18%' },
                { label: '播放量', value: '1.2万', change: '+16%' },
                { label: '点赞数', value: '1,486', change: '+20%' },
                { label: '评论数', value: '243', change: '+9%' },
                { label: '分享数', value: '326', change: '+13%' },
                { label: '新增关注', value: '142', change: '+11%' }
              ],
              trend: [
                { label: '发布6h', value: '1,982', percent: 17 },
                { label: '发布24h', value: '5,614', percent: 47 },
                { label: '发布7日', value: '9,428', percent: 79 },
                { label: '近30日沉淀', value: '1.2万', percent: 100 }
              ],
              insight: '可以延展为“季节路线合集”系列，继续放大站内收藏和长尾播放价值。'
            }
          },
          {
            id: 'bl-30-2',
            title: '古建机位与运镜节奏',
            meta: '3.2万人参与，8,164次播放',
            date: '2026-07-01  18:46',
            publishedAt: '2026-07-01T18:46:00',
            desc: '知识点明确，适合吸引偏创作者受众，评论区问题质量较高。',
            stats: ['播放 8,164', '点赞 986', '收藏 514', '评论 168', '分享 142'],
            status: '创作教学',
            thumbLabel: '古建机位',
            thumbClass: 'note-thumb-mountain',
            sortWeight: 74,
            tags: ['古建拍摄', '运镜节奏', '教学内容'],
            detail: {
              headline: '教学内容用户质量高，适合沉淀创作者人群',
              score: '74%',
              summary: { views: '8,164', favorites: '514', comments: '168' },
              metrics: [
                { label: '曝光数', value: '1.02万', change: '+8%' },
                { label: '播放量', value: '8,164', change: '+7%' },
                { label: '点赞数', value: '986', change: '+10%' },
                { label: '评论数', value: '168', change: '+6%' },
                { label: '分享数', value: '142', change: '+5%' },
                { label: '新增关注', value: '76', change: '+4%' }
              ],
              trend: [
                { label: '发布6h', value: '1,364', percent: 17 },
                { label: '发布24h', value: '3,826', percent: 47 },
                { label: '发布7日', value: '6,542', percent: 80 },
                { label: '近30日沉淀', value: '8,164', percent: 100 }
              ],
              insight: '适合补一版更短的“纯参数版”，覆盖更偏技巧向的观看人群。'
            }
          }
        ]
      }
    }
  }
}

export const accountBindingPresets = [
  {
    id: 'xiaohongshu',
    label: '小红书',
    icon: '/assets/xiaohongshu.png',
    description: '图文种草发布与评论互动追踪',
    status: 'bound',
    accountName: '智旅云宣-大理攻略',
    accountId: 'xhs_travel_dali',
    contact: '138 0013 8000',
    remark: '当前主运营账号，承担景区图文发布与热度承接。',
    enablePublishing: true,
    enableTracking: true,
    lastSyncAt: '2026-07-27T09:30:00'
  },
  {
    id: 'douyin',
    label: '抖音',
    icon: '/assets/douyin.png',
    description: '短视频发布、播放数据与涨粉追踪',
    status: 'bound',
    accountName: '智旅云宣-城市漫游',
    accountId: 'douyin_city_trip',
    contact: '138 0013 8001',
    remark: '用于景区短视频传播，当前以路线合集和打卡机位为主。',
    enablePublishing: true,
    enableTracking: true,
    lastSyncAt: '2026-07-27T08:45:00'
  },
  {
    id: 'wechat',
    label: '微信公众号',
    icon: '/assets/wechat.png',
    description: '公众号图文推送与服务号内容分发',
    status: 'unbound',
    accountName: '',
    accountId: '',
    contact: '',
    remark: '',
    enablePublishing: false,
    enableTracking: true,
    lastSyncAt: ''
  },
  {
    id: 'bilibili',
    label: 'bilibili',
    icon: '/assets/bilibili.png',
    description: '长视频内容沉淀与创作向账号运营',
    status: 'unbound',
    accountName: '',
    accountId: '',
    contact: '',
    remark: '',
    enablePublishing: false,
    enableTracking: true,
    lastSyncAt: ''
  }
]
