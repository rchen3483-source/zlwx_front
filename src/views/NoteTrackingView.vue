<template>
  <AppLayout mainClass="note-tracking-page">
    <AppTopbar title="笔记数据跟踪" flat />

    <section class="note-tracking-shell">
      <div class="block-head">
        <h2>平台选择</h2>
      </div>

      <div class="note-platform-grid" role="radiogroup" aria-label="选择查看平台">
        <label v-for="platform in platforms" :key="platform.value" class="note-platform-card">
          <input v-model="selectedPlatform" type="radio" name="note-platform" :value="platform.value" />
          <div class="note-platform-meta">
            <img class="note-platform-logo" :src="platform.icon" :alt="`${platform.label}图标`" />
            <strong>{{ platform.label }}</strong>
          </div>
          <span class="note-platform-check" aria-hidden="true"></span>
        </label>
      </div>

      <article class="card note-overview-card">
        <div class="section-head">
          <div>
            <h2>全笔记数据</h2>
            <p class="note-section-copy">{{ currentPeriodData.range }}</p>
          </div>
          <div class="pill-group" role="tablist" aria-label="选择统计周期">
            <button
              v-for="period in periods"
              :key="period.value"
              class="pill"
              :class="{ active: selectedPeriod === period.value }"
              type="button"
              @click="selectedPeriod = period.value"
            >
              {{ period.label }}
            </button>
          </div>
        </div>

        <div class="note-overview-grid">
          <div v-for="item in currentPeriodData.overview" :key="item.label" class="note-overview-item">
            <span class="note-overview-label">{{ item.label }}</span>
            <strong class="note-overview-value">{{ item.value }}</strong>
            <small class="note-overview-meta">{{ item.meta }}</small>
          </div>
        </div>

        <div class="note-line-chart-card">
          <div class="note-line-chart-head">
            <div>
              <h3>数据趋势可视化</h3>
              <p class="note-section-copy">浏览量、点赞与评论随周期变化的表现曲线</p>
            </div>
            <div class="note-line-chart-legend">
              <button
                v-for="series in chartSeriesOptions"
                :key="series.key"
                class="note-legend-item note-legend-button"
                :class="[
                  `is-${series.tone}`,
                  { 'is-active': selectedSeries === series.key, 'is-muted': selectedSeries !== series.key }
                ]"
                type="button"
                @click="selectChartSeries(series.key)"
              >
                <i class="note-legend-dot" :class="`note-legend-dot-${series.tone}`"></i>
                {{ series.label }}
              </button>
            </div>
          </div>

          <div class="note-line-chart-shell" :class="{ 'is-dragging': chartDragActive }" @pointerdown="startChartDrag">
            <div
              class="note-chart-focus-badge"
              :class="`is-${selectedSeriesMeta.tone}`"
              :style="{
                left: `${focusBadgePosition.left}%`,
                top: `${focusBadgePosition.top}%`
              }"
            >
              <span class="note-chart-focus-date">{{ focusLabel }}</span>
              <div class="note-chart-focus-values">
                <span class="note-chart-focus-value" :class="`note-chart-focus-value-${selectedSeriesMeta.tone}`">
                  {{ selectedSeriesMeta.label }} {{ formatChartValue(focusValue) }}
                </span>
              </div>
            </div>

            <svg ref="chartSvgRef" class="note-line-chart" viewBox="0 0 720 220" aria-label="笔记数据趋势图">
              <defs>
                <pattern id="note-chart-dots" width="46" height="28" patternUnits="userSpaceOnUse">
                  <circle cx="23" cy="14" r="2.2" fill="#edf0f5" />
                </pattern>
                <linearGradient id="note-area-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#388dff" stop-opacity="0.22" />
                  <stop offset="100%" stop-color="#388dff" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="note-area-pink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ff63b0" stop-opacity="0.24" />
                  <stop offset="100%" stop-color="#ff63b0" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="note-area-orange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ffb24d" stop-opacity="0.2" />
                  <stop offset="100%" stop-color="#ffb24d" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="note-line-focus-gradient" x1="54" y1="0" x2="688" y2="0" gradientUnits="userSpaceOnUse">
                  <stop :offset="focusMaskStops.edgeStart" stop-color="white" stop-opacity="0.14" />
                  <stop :offset="focusMaskStops.innerStart" stop-color="white" stop-opacity="0.42" />
                  <stop :offset="focusMaskStops.center" stop-color="white" stop-opacity="1" />
                  <stop :offset="focusMaskStops.innerEnd" stop-color="white" stop-opacity="0.42" />
                  <stop :offset="focusMaskStops.edgeEnd" stop-color="white" stop-opacity="0.14" />
                </linearGradient>
                <mask id="note-line-focus-mask" maskUnits="userSpaceOnUse" x="54" y="0" width="634" height="220">
                  <rect x="54" y="0" width="634" height="220" fill="url(#note-line-focus-gradient)" />
                </mask>
                <filter id="note-chart-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blurred" />
                  <feMerge>
                    <feMergeNode in="blurred" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect class="note-chart-dots-panel" x="54" y="12" width="634" height="156" rx="24" fill="url(#note-chart-dots)" />

              <text
                v-for="tick in yAxisTicks"
                :key="`label-${tick.value}`"
                class="note-chart-y-label"
                x="42"
                :y="tick.y + 4"
                text-anchor="end"
              >
                {{ formatChartValue(tick.value) }}
              </text>

              <path
                class="note-chart-area note-chart-area-blue"
                :class="{ 'is-muted': selectedSeries !== 'views', 'is-active': selectedSeries === 'views' }"
                :d="chartAreas.views"
                :mask="selectedSeries === 'views' ? 'url(#note-line-focus-mask)' : null"
                @pointerdown.stop="startChartDrag($event, 'views')"
              />
              <path
                class="note-chart-area note-chart-area-pink"
                :class="{ 'is-muted': selectedSeries !== 'likes', 'is-active': selectedSeries === 'likes' }"
                :d="chartAreas.likes"
                :mask="selectedSeries === 'likes' ? 'url(#note-line-focus-mask)' : null"
                @pointerdown.stop="startChartDrag($event, 'likes')"
              />
              <path
                class="note-chart-area note-chart-area-orange"
                :class="{ 'is-muted': selectedSeries !== 'comments', 'is-active': selectedSeries === 'comments' }"
                :d="chartAreas.comments"
                :mask="selectedSeries === 'comments' ? 'url(#note-line-focus-mask)' : null"
                @pointerdown.stop="startChartDrag($event, 'comments')"
              />

              <path
                class="note-chart-line-glow note-chart-line-glow-blue"
                :class="{ 'is-muted': selectedSeries !== 'views', 'is-active': selectedSeries === 'views' }"
                :d="chartSeries.views"
                :mask="selectedSeries === 'views' ? 'url(#note-line-focus-mask)' : null"
                @pointerdown.stop="startChartDrag($event, 'views')"
              />
              <path
                class="note-chart-line-glow note-chart-line-glow-pink"
                :class="{ 'is-muted': selectedSeries !== 'likes', 'is-active': selectedSeries === 'likes' }"
                :d="chartSeries.likes"
                :mask="selectedSeries === 'likes' ? 'url(#note-line-focus-mask)' : null"
                @pointerdown.stop="startChartDrag($event, 'likes')"
              />
              <path
                class="note-chart-line-glow note-chart-line-glow-orange"
                :class="{ 'is-muted': selectedSeries !== 'comments', 'is-active': selectedSeries === 'comments' }"
                :d="chartSeries.comments"
                :mask="selectedSeries === 'comments' ? 'url(#note-line-focus-mask)' : null"
                @pointerdown.stop="startChartDrag($event, 'comments')"
              />

              <path
                class="note-chart-line note-chart-line-blue"
                :class="{ 'is-muted': selectedSeries !== 'views', 'is-active': selectedSeries === 'views' }"
                :d="chartSeries.views"
                :mask="selectedSeries === 'views' ? 'url(#note-line-focus-mask)' : null"
                @pointerdown.stop="startChartDrag($event, 'views')"
              />
              <path
                class="note-chart-line note-chart-line-pink"
                :class="{ 'is-muted': selectedSeries !== 'likes', 'is-active': selectedSeries === 'likes' }"
                :d="chartSeries.likes"
                :mask="selectedSeries === 'likes' ? 'url(#note-line-focus-mask)' : null"
                @pointerdown.stop="startChartDrag($event, 'likes')"
              />
              <path
                class="note-chart-line note-chart-line-orange"
                :class="{ 'is-muted': selectedSeries !== 'comments', 'is-active': selectedSeries === 'comments' }"
                :d="chartSeries.comments"
                :mask="selectedSeries === 'comments' ? 'url(#note-line-focus-mask)' : null"
                @pointerdown.stop="startChartDrag($event, 'comments')"
              />

              <line
                class="note-chart-focus-line"
                :class="`is-${selectedSeriesMeta.tone}`"
                :x1="focusPoint.x"
                :x2="focusPoint.x"
                :y1="focusPoint.y + 14"
                :y2="chartFrame.height - chartFrame.bottom + 8"
              />

              <circle
                class="note-chart-focus-ring"
                :class="`note-chart-focus-ring-${selectedSeriesMeta.tone}`"
                :cx="focusPoint.x"
                :cy="focusPoint.y"
                r="8.5"
                @pointerdown.stop="startChartDrag($event, selectedSeries)"
              />

              <circle
                class="note-chart-focus-core"
                :class="`note-chart-focus-core-${selectedSeriesMeta.tone}`"
                :cx="focusPoint.x"
                :cy="focusPoint.y"
                r="5.5"
                @pointerdown.stop="startChartDrag($event, selectedSeries)"
              />
            </svg>
          </div>

          <div class="note-chart-axis-pill">
            <span
              v-for="point in xAxisPoints"
              :key="`axis-${point.label}`"
              class="note-chart-axis-label"
              :class="{ 'is-active': point.label === focusLabel }"
            >
              {{ point.label }}
            </span>
          </div>
        </div>
      </article>

    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { noteTrackingData } from '@/api/mockData.js'

const platforms = [
  { value: 'xiaohongshu', label: '小红书', icon: '/assets/xiaohongshu.png' },
  { value: 'douyin', label: '抖音', icon: '/assets/douyin.png' },
  { value: 'wechat', label: '微信公众号', icon: '/assets/wechat.png' },
  { value: 'bilibili', label: 'bilibili', icon: '/assets/bilibili.png' }
]

const periods = [
  { value: '7d', label: '近7日' },
  { value: '30d', label: '近30日' }
]

const emptyPeriodData = {
  range: '',
  overview: [],
  trendChart: {
    labels: [],
    views: [],
    likes: [],
    comments: []
  },
  notes: []
}

const chartSeriesOptions = [
  { key: 'views', label: '浏览量', tone: 'blue' },
  { key: 'likes', label: '点赞', tone: 'pink' },
  { key: 'comments', label: '评论', tone: 'orange' }
]

const selectedPlatform = ref('xiaohongshu')
const selectedPeriod = ref('7d')
const selectedSeries = ref('views')
const chartFocusIndex = ref(0)
const chartDragActive = ref(false)
const chartSvgRef = ref(null)

const currentPeriodData = computed(() => {
  return noteTrackingData[selectedPlatform.value]?.periods?.[selectedPeriod.value] ?? emptyPeriodData
})

const selectedSeriesMeta = computed(() => {
  return chartSeriesOptions.find((item) => item.key === selectedSeries.value) ?? chartSeriesOptions[0]
})

const chartFrame = {
  width: 720,
  height: 220,
  left: 54,
  right: 32,
  top: 18,
  bottom: 42
}

const chartData = computed(() => currentPeriodData.value.trendChart ?? emptyPeriodData.trendChart)

const chartMax = computed(() => {
  const values = [...chartData.value.views, ...chartData.value.likes, ...chartData.value.comments]
  const maxValue = Math.max(...values, 0)

  if (maxValue <= 10) {
    return 10
  }

  const roughStep = maxValue / 4
  const magnitude = 10 ** Math.floor(Math.log10(roughStep))
  const normalizedStep = Math.ceil(roughStep / magnitude) * magnitude
  return normalizedStep * 4
})

const drawableWidth = chartFrame.width - chartFrame.left - chartFrame.right
const drawableHeight = chartFrame.height - chartFrame.top - chartFrame.bottom

const getX = (index, length) => {
  if (length <= 1) {
    return chartFrame.left + drawableWidth / 2
  }

  return chartFrame.left + (drawableWidth / (length - 1)) * index
}

const getY = (value) => {
  if (!chartMax.value) {
    return chartFrame.height - chartFrame.bottom
  }

  return chartFrame.top + ((chartMax.value - value) / chartMax.value) * drawableHeight
}

const makePoints = (values) => {
  return values.map((value, index) => ({
    x: getX(index, values.length),
    y: getY(value),
    label: chartData.value.labels[index] ?? `${index + 1}`,
    value
  }))
}

const chartPoints = computed(() => ({
  views: makePoints(chartData.value.views),
  likes: makePoints(chartData.value.likes),
  comments: makePoints(chartData.value.comments)
}))

const buildSmoothPath = (points) => {
  if (!points.length) {
    return ''
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index]
    const next = points[index + 1]
    const controlX = (current.x + next.x) / 2
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`
  }

  return path
}

const buildAreaPath = (points) => {
  if (!points.length) {
    return ''
  }

  const baselineY = chartFrame.height - chartFrame.bottom + 8
  return `${buildSmoothPath(points)} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`
}

const chartSeries = computed(() => ({
  views: buildSmoothPath(chartPoints.value.views),
  likes: buildSmoothPath(chartPoints.value.likes),
  comments: buildSmoothPath(chartPoints.value.comments)
}))

const chartAreas = computed(() => ({
  views: buildAreaPath(chartPoints.value.views),
  likes: buildAreaPath(chartPoints.value.likes),
  comments: buildAreaPath(chartPoints.value.comments)
}))

const xAxisPoints = computed(() => {
  return chartData.value.labels.map((label, index) => ({
    label,
    x: getX(index, chartData.value.labels.length)
  }))
})

const yAxisTicks = computed(() => {
  const tickCount = 4

  return Array.from({ length: tickCount + 1 }, (_, index) => {
    const value = (chartMax.value / tickCount) * (tickCount - index)
    return {
      value,
      y: chartFrame.top + (drawableHeight / tickCount) * index
    }
  })
})

const defaultChartFocusIndex = () => {
  if (!chartData.value.labels.length) {
    return 0
  }

  return Math.min(Math.max(1, Math.floor(chartData.value.labels.length * 0.6)), chartData.value.labels.length - 1)
}

const clampChartFocusIndex = (value) => {
  if (!chartData.value.labels.length) {
    return 0
  }

  return Math.min(Math.max(0, value), chartData.value.labels.length - 1)
}

const focusPoint = computed(() => {
  return chartPoints.value[selectedSeries.value]?.[chartFocusIndex.value] ?? { x: chartFrame.left, y: chartFrame.top }
})

const focusLabel = computed(() => chartData.value.labels[chartFocusIndex.value] ?? '')

const focusValue = computed(() => {
  return chartData.value[selectedSeries.value]?.[chartFocusIndex.value] ?? 0
})

const focusBadgePosition = computed(() => {
  const left = (focusPoint.value.x / chartFrame.width) * 100 + 3
  const top = (focusPoint.value.y / chartFrame.height) * 100 - 10

  return {
    left: Math.min(84, Math.max(18, left)),
    top: Math.min(54, Math.max(16, top))
  }
})

const focusMaskStops = computed(() => {
  const leftBound = chartFrame.left
  const rightBound = chartFrame.width - chartFrame.right
  const drawableRange = rightBound - leftBound || 1
  const centerPct = ((focusPoint.value.x - leftBound) / drawableRange) * 100
  const innerSpread = 13
  const outerSpread = 34
  const clampPct = (value) => `${Math.min(100, Math.max(0, value)).toFixed(2)}%`

  return {
    edgeStart: clampPct(centerPct - outerSpread),
    innerStart: clampPct(centerPct - innerSpread),
    center: clampPct(centerPct),
    innerEnd: clampPct(centerPct + innerSpread),
    edgeEnd: clampPct(centerPct + outerSpread)
  }
})

const syncChartFocus = () => {
  chartFocusIndex.value = defaultChartFocusIndex()
}

watch([selectedPlatform, selectedPeriod], syncChartFocus, { immediate: true })

const updateChartFocusFromClientX = (clientX) => {
  const svgElement = chartSvgRef.value
  if (!svgElement || !chartData.value.labels.length) {
    return
  }

  const rect = svgElement.getBoundingClientRect()
  if (!rect.width) {
    return
  }

  const relativeX = ((clientX - rect.left) / rect.width) * chartFrame.width
  const nearestIndex = xAxisPoints.value.reduce((closestIndex, point, index) => {
    const currentDistance = Math.abs(point.x - relativeX)
    const closestDistance = Math.abs(xAxisPoints.value[closestIndex].x - relativeX)
    return currentDistance < closestDistance ? index : closestIndex
  }, 0)

  chartFocusIndex.value = clampChartFocusIndex(nearestIndex)
}

const selectChartSeries = (seriesKey) => {
  selectedSeries.value = seriesKey
}

const startChartDrag = (event, seriesKey = selectedSeries.value) => {
  selectedSeries.value = seriesKey
  chartDragActive.value = true
  updateChartFocusFromClientX(event.clientX)
}

const handleWindowPointerMove = (event) => {
  if (!chartDragActive.value) {
    return
  }

  updateChartFocusFromClientX(event.clientX)
}

const endChartDrag = () => {
  chartDragActive.value = false
}

onMounted(() => {
  window.addEventListener('pointermove', handleWindowPointerMove)
  window.addEventListener('pointerup', endChartDrag)
  window.addEventListener('pointercancel', endChartDrag)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handleWindowPointerMove)
  window.removeEventListener('pointerup', endChartDrag)
  window.removeEventListener('pointercancel', endChartDrag)
})

const formatChartValue = (value) => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(value >= 100000 ? 0 : 1)}w`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
  }

  return `${Math.round(value)}`
}
</script>
