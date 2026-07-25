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
  xiaohongshu: [
    {
      id: 1,
      title: '打卡万里长城啦！',
      meta: '32.5万人参与，15.3亿游览',
      date: '2026-07-25  19:49',
      desc:
        '说明：适用于xxxxxx推广，此处填写视频文案方使用广泛选择。适用于xxxxxx推广，此处填写视频文案方使用广泛选择。适用于xxxxxx推广，',
      stats: ['◉ 275', '◌ 6', '♡ 29', '☆ 2', '↗ 5']
    },
    {
      id: 2,
      title: '打卡万里长城啦！',
      meta: '32.5万人参与，15.3亿游览',
      date: '2026-07-25  19:49',
      desc:
        '说明：适用于xxxxxx推广，此处填写视频文案方使用广泛选择。适用于xxxxxx推广，此处填写视频文案方使用广泛选择。适用于xxxxxx推广，',
      stats: ['◉ 275', '◌ 6', '♡ 29', '☆ 2', '↗ 5']
    },
    {
      id: 3,
      title: '打卡万里长城啦！',
      meta: '32.5万人参与，15.3亿游览',
      date: '2026-07-25  19:49',
      desc:
        '说明：适用于xxxxxx推广，此处填写视频文案方使用广泛选择。适用于xxxxxx推广，此处填写视频文案方使用广泛选择。适用于xxxxxx推广，',
      stats: ['◉ 275', '◌ 6', '♡ 29', '☆ 2', '↗ 5']
    }
  ],
  douyin: [
    {
      id: 1,
      title: '长城日落机位攻略',
      meta: '16.2万人参与，8.7亿游览',
      date: '2026-07-24  20:15',
      desc:
        '说明：适用于抖音短视频推广，此处填写视频文案方使用广泛选择。适用于抖音短视频推广，此处填写视频文案方使用广泛选择。',
      stats: ['◉ 1.2k', '◌ 38', '♡ 312', '☆ 41', '↗ 88']
    },
    {
      id: 2,
      title: '夜游古城路线合集',
      meta: '12.8万人参与，6.4亿游览',
      date: '2026-07-23  18:40',
      desc:
        '说明：适用于抖音短视频推广，此处填写视频文案方使用广泛选择。适用于抖音短视频推广，此处填写视频文案方使用广泛选择。',
      stats: ['◉ 986', '◌ 22', '♡ 205', '☆ 36', '↗ 64']
    },
    {
      id: 3,
      title: '周末自驾看山海',
      meta: '9.6万人参与，4.3亿游览',
      date: '2026-07-22  17:08',
      desc:
        '说明：适用于抖音短视频推广，此处填写视频文案方使用广泛选择。适用于抖音短视频推广，此处填写视频文案方使用广泛选择。',
      stats: ['◉ 754', '◌ 19', '♡ 168', '☆ 23', '↗ 51']
    }
  ],
  wechat: [
    {
      id: 1,
      title: '北京文化漫游路线',
      meta: '3.8万人参与，248万游览',
      date: '2026-07-25  10:12',
      desc:
        '说明：适用于公众号图文推广，此处填写图文文案方使用广泛选择。适用于公众号图文推广，此处填写图文文案方使用广泛选择。',
      stats: ['◉ 428', '◌ 12', '♡ 86', '☆ 17', '↗ 33']
    },
    {
      id: 2,
      title: '夏日景区活动日历',
      meta: '2.9万人参与，196万游览',
      date: '2026-07-24  14:26',
      desc:
        '说明：适用于公众号图文推广，此处填写图文文案方使用广泛选择。适用于公众号图文推广，此处填写图文文案方使用广泛选择。',
      stats: ['◉ 365', '◌ 9', '♡ 74', '☆ 11', '↗ 28']
    },
    {
      id: 3,
      title: '城市夜游灵感手册',
      meta: '2.1万人参与，154万游览',
      date: '2026-07-23  09:03',
      desc:
        '说明：适用于公众号图文推广，此处填写图文文案方使用广泛选择。适用于公众号图文推广，此处填写图文文案方使用广泛选择。',
      stats: ['◉ 287', '◌ 6', '♡ 53', '☆ 8', '↗ 16']
    }
  ],
  bilibili: [
    {
      id: 1,
      title: '长城 Vlog 拍摄参考',
      meta: '7.2万人参与，521万游览',
      date: '2026-07-25  21:04',
      desc:
        '说明：适用于 B 站内容推广，此处填写视频文案方使用广泛选择。适用于 B 站内容推广，此处填写视频文案方使用广泛选择。',
      stats: ['◉ 842', '◌ 31', '♡ 274', '☆ 59', '↗ 73']
    },
    {
      id: 2,
      title: '古城夜景运镜模板',
      meta: '5.8万人参与，406万游览',
      date: '2026-07-24  16:32',
      desc:
        '说明：适用于 B 站内容推广，此处填写视频文案方使用广泛选择。适用于 B 站内容推广，此处填写视频文案方使用广泛选择。',
      stats: ['◉ 693', '◌ 24', '♡ 218', '☆ 46', '↗ 58']
    },
    {
      id: 3,
      title: '山海旅行合集脚本',
      meta: '4.4万人参与，318万游览',
      date: '2026-07-23  13:17',
      desc:
        '说明：适用于 B 站内容推广，此处填写视频文案方使用广泛选择。适用于 B 站内容推广，此处填写视频文案方使用广泛选择。',
      stats: ['◉ 511', '◌ 17', '♡ 184', '☆ 33', '↗ 44']
    }
  ]
}
