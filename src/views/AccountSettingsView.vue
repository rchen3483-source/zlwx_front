<template>
  <AppLayout mainClass="account-settings-page">
    <AppTopbar title="账号设置" flat />

    <section class="account-settings-shell">
      <article class="card account-summary-card">
        <div class="section-head">
          <div>
            <h2>平台账号总览</h2>
            <p class="note-section-copy">支持四个平台账号绑定、同步发布与数据跟踪配置</p>
          </div>
        </div>

        <div class="account-summary-grid">
          <div v-for="item in summaryItems" :key="item.label" class="account-summary-item">
            <span class="account-summary-label">{{ item.label }}</span>
            <strong class="account-summary-value">{{ item.value }}</strong>
            <small class="account-summary-meta">{{ item.meta }}</small>
          </div>
        </div>
      </article>

      <div class="block-head block-head-spaced">
        <h2>平台绑定管理</h2>
      </div>

      <div class="account-layout">
        <article class="card account-platform-panel">
          <div class="account-platform-grid">
            <article
              v-for="platform in bindings"
              :key="platform.id"
              class="account-bind-card"
              :class="{ 'is-active': selectedPlatformId === platform.id }"
              role="button"
              tabindex="0"
              @click="selectPlatform(platform.id)"
              @keyup.enter="selectPlatform(platform.id)"
              @keyup.space.prevent="selectPlatform(platform.id)"
            >
              <div class="account-bind-top">
                <div class="account-platform-copy">
                  <div class="account-platform-icon-wrap">
                    <img :src="platform.icon" :alt="`${platform.label}图标`" class="account-platform-icon" />
                  </div>
                  <div>
                    <strong>{{ platform.label }}</strong>
                    <p>{{ platform.description }}</p>
                  </div>
                </div>
                <span
                  class="account-status-chip"
                  :class="platform.status === 'bound' ? 'is-bound' : 'is-unbound'"
                >
                  {{ platform.status === 'bound' ? '已绑定' : '待绑定' }}
                </span>
              </div>

              <div class="account-platform-meta">
                <template v-if="platform.status === 'bound'">
                  <strong>{{ platform.accountName }}</strong>
                  <span>ID：{{ platform.accountId }}</span>
                  <span>最近同步：{{ formatDateTime(platform.lastSyncAt) }}</span>
                </template>
                <template v-else>
                  <strong class="account-platform-empty">尚未绑定账号</strong>
                  <span>点击右侧面板填写账号信息后即可完成绑定</span>
                </template>
              </div>

              <div class="account-action-row">
                <button class="primary-btn small" type="button" @click.stop="selectPlatform(platform.id)">
                  {{ platform.status === 'bound' ? '编辑绑定' : '开始绑定' }}
                </button>
                <button
                  v-if="platform.status === 'bound'"
                  class="account-secondary-action"
                  type="button"
                  @click.stop="unbindPlatform(platform.id)"
                >
                  解除绑定
                </button>
              </div>
            </article>
          </div>
        </article>

        <article class="card account-editor-card">
          <div class="section-head">
            <div>
              <h2>{{ selectedPlatform?.label }}账号信息</h2>
              <p class="note-section-copy">可配置展示账号、发布同步和数据回传能力</p>
            </div>
            <span
              class="account-status-chip"
              :class="selectedPlatform?.status === 'bound' ? 'is-bound' : 'is-unbound'"
            >
              {{ selectedPlatform?.status === 'bound' ? '已绑定' : '待绑定' }}
            </span>
          </div>

          <div class="account-editor-form">
            <div class="account-field-grid">
              <label class="account-field">
                <span>账号名称</span>
                <input v-model.trim="draft.accountName" type="text" placeholder="请输入平台展示账号名称" />
              </label>

              <label class="account-field">
                <span>账号 ID</span>
                <input v-model.trim="draft.accountId" type="text" placeholder="请输入平台唯一账号 ID" />
              </label>
            </div>

            <div class="account-field-grid">
              <label class="account-field">
                <span>联系人手机号</span>
                <input v-model.trim="draft.contact" type="text" placeholder="用于接收平台提醒与验证信息" />
              </label>

              <label class="account-field">
                <span>最近同步</span>
                <input :value="selectedPlatform?.lastSyncAt ? formatDateTime(selectedPlatform.lastSyncAt) : '尚未同步'" type="text" disabled />
              </label>
            </div>

            <label class="account-field">
              <span>账号备注</span>
              <textarea
                v-model.trim="draft.remark"
                rows="5"
                placeholder="可填写该账号的内容定位、运营职责或权限说明"
              ></textarea>
            </label>

            <div class="account-switch-grid">
              <label class="account-switch-item">
                <input v-model="draft.enablePublishing" type="checkbox" />
                <div>
                  <strong>开启同步发布</strong>
                  <span>在创作流程中允许直接发布到该平台账号</span>
                </div>
              </label>

              <label class="account-switch-item">
                <input v-model="draft.enableTracking" type="checkbox" />
                <div>
                  <strong>开启数据回传</strong>
                  <span>在笔记数据跟踪中自动汇总该平台的互动表现</span>
                </div>
              </label>
            </div>

            <p v-if="feedbackMessage" class="account-feedback" :class="feedbackTone">{{ feedbackMessage }}</p>

            <div class="account-editor-actions">
              <button class="primary-btn" type="button" @click="saveBinding">
                {{ selectedPlatform?.status === 'bound' ? '保存设置' : '确认绑定' }}
              </button>
              <button class="account-secondary-action" type="button" @click="resetDraft">恢复当前信息</button>
              <button
                v-if="selectedPlatform?.status === 'bound'"
                class="account-secondary-action"
                type="button"
                @click="unbindPlatform(selectedPlatform.id)"
              >
                解除绑定
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { accountBindingPresets } from '@/api/mockData.js'

const ACCOUNT_STORAGE_KEY = 'zlwx-account-bindings'

const clone = (value) => JSON.parse(JSON.stringify(value))

const createDefaultBindings = () => clone(accountBindingPresets)

const readBindings = () => {
  const saved = localStorage.getItem(ACCOUNT_STORAGE_KEY)
  if (!saved) {
    return createDefaultBindings()
  }

  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed) || !parsed.length) {
      return createDefaultBindings()
    }

    return createDefaultBindings().map((preset) => {
      const matched = parsed.find((item) => item.id === preset.id)
      return matched ? { ...preset, ...matched } : preset
    })
  } catch (_error) {
    return createDefaultBindings()
  }
}

const createDraftFromPlatform = (platform) => ({
  accountName: platform?.accountName ?? '',
  accountId: platform?.accountId ?? '',
  contact: platform?.contact ?? '',
  remark: platform?.remark ?? '',
  enablePublishing: Boolean(platform?.enablePublishing),
  enableTracking: platform?.enableTracking !== false
})

const bindings = ref(readBindings())
const selectedPlatformId = ref(bindings.value[0]?.id ?? 'xiaohongshu')
const draft = ref(createDraftFromPlatform(bindings.value[0]))
const feedbackMessage = ref('')
const feedbackTone = ref('is-success')

const persistBindings = () => {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(bindings.value))
}

const formatDateTime = (value) => {
  if (!value) {
    return '尚未同步'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '尚未同步'
  }

  const pad = (num) => String(num).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const selectedPlatform = computed(() => {
  return bindings.value.find((platform) => platform.id === selectedPlatformId.value) ?? bindings.value[0] ?? null
})

watch(
  selectedPlatform,
  (platform) => {
    draft.value = createDraftFromPlatform(platform)
    feedbackMessage.value = ''
  },
  { immediate: true }
)

const boundPlatforms = computed(() => bindings.value.filter((item) => item.status === 'bound'))

const summaryItems = computed(() => {
  const primaryPlatform = boundPlatforms.value.find((item) => item.enablePublishing) ?? boundPlatforms.value[0]
  const latestSync = [...boundPlatforms.value]
    .filter((item) => item.lastSyncAt)
    .sort((left, right) => new Date(right.lastSyncAt) - new Date(left.lastSyncAt))[0]

  return [
    {
      label: '已绑定平台',
      value: `${boundPlatforms.value.length}/4`,
      meta: boundPlatforms.value.length >= 3 ? '多平台联动已就绪' : '建议至少绑定 3 个主流平台'
    },
    {
      label: '主运营平台',
      value: primaryPlatform?.label ?? '未设置',
      meta: primaryPlatform?.accountName ?? '可在下方开启同步发布'
    },
    {
      label: '最近同步',
      value: latestSync ? formatDateTime(latestSync.lastSyncAt).slice(11) : '--:--',
      meta: latestSync ? `${latestSync.label} 已完成同步` : '暂无同步记录'
    },
    {
      label: '安全状态',
      value: `${bindings.value.filter((item) => item.enableTracking).length} 项开启`,
      meta: '建议同时开启发布与数据回传能力'
    }
  ]
})

const selectPlatform = (platformId) => {
  selectedPlatformId.value = platformId
}

const resetDraft = () => {
  draft.value = createDraftFromPlatform(selectedPlatform.value)
  feedbackMessage.value = ''
}

const saveBinding = () => {
  if (!selectedPlatform.value) {
    return
  }

  if (!draft.value.accountName || !draft.value.accountId) {
    feedbackTone.value = 'is-error'
    feedbackMessage.value = '请至少填写账号名称和账号 ID 后再保存。'
    return
  }

  bindings.value = bindings.value.map((platform) => {
    if (platform.id !== selectedPlatform.value.id) {
      return platform
    }

    return {
      ...platform,
      ...draft.value,
      status: 'bound',
      lastSyncAt: new Date().toISOString()
    }
  })

  persistBindings()
  feedbackTone.value = 'is-success'
  feedbackMessage.value = `${selectedPlatform.value.label} 账号信息已保存，可在创作与数据模块中直接使用。`
}

const unbindPlatform = (platformId) => {
  const preset = accountBindingPresets.find((item) => item.id === platformId)
  if (!preset) {
    return
  }

  bindings.value = bindings.value.map((platform) => (platform.id === platformId ? clone(preset) : platform))
  persistBindings()

  if (selectedPlatformId.value === platformId) {
    draft.value = createDraftFromPlatform(preset)
  }

  feedbackTone.value = 'is-success'
  feedbackMessage.value = `${preset.label} 已解除绑定，当前仅保留平台基础配置。`
}
</script>
