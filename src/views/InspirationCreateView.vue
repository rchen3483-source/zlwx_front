<template>
  <AppLayout mainClass="inspiration-page">
    <AppTopbar title="图文发布" :show-command-btn="false" flat />

    <section class="inspiration-shell">
      <div class="inspiration-heading">
        <h1>借鉴创作</h1>
        <p>基于参考内容生成完整小红书旅游图文方案</p>
      </div>

      <div class="inspiration-main">
        <section class="phone-preview" aria-label="小红书旅游封面预览">
          <img class="phone-reference" src="/assets/dali-phone-preview.png" alt="云南大理四天三晚漫游攻略封面" />
        </section>

        <section class="inspiration-detail card">
          <div class="detail-title-row">
            <h2>云南大理四天三晚漫游攻略</h2>
            <div class="detail-actions-inline">
              <button class="detail-icon-btn detail-icon-note" aria-label="备注"></button>
              <button class="detail-icon-btn detail-icon-search" aria-label="搜索"></button>
            </div>
          </div>

          <div class="detail-chip-row">
            <span class="outline-chip">旅行灵感</span>
            <span class="outline-chip">大理必打卡</span>
            <span class="outline-chip">轻松出行</span>
          </div>

          <p class="detail-paragraph">
            从洱海到苍山，从古城到喜洲，这条路线适合第一次来大理的人。白天看海，傍晚追日落，晚上逛古城小吃街，节奏轻松说不无聊。推荐安排洱海骑行、喜洲麦田、苍山索道、双廊咖啡和古城夜游，拍照点点，美食也很集中。
          </p>

          <div class="thumb-strip">
            <img src="/assets/dali-thumb-1.png" alt="洱海风景 1" />
            <img src="/assets/dali-thumb-2.png" alt="洱海风景 2" />
            <img src="/assets/dali-thumb-3.png" alt="洱海风景 3" />
            <img src="/assets/dali-thumb-4.png" alt="大理建筑 1" />
            <img src="/assets/dali-thumb-5.png" alt="大理建筑 2" />
            <img src="/assets/dali-thumb-6.png" alt="大理建筑 3" />
            <img src="/assets/dali-thumb-7.png" alt="大理建筑 4" />
          </div>

          <div class="topic-chip-row">
            <span class="topic-chip topic-chip-active">大理旅行</span>
            <span class="topic-chip topic-chip-soft">旅途</span>
            <span class="topic-chip">云南旅游</span>
            <span class="topic-chip">四天三晚</span>
            <span class="topic-chip">洱海攻略</span>
            <span class="topic-chip">周末出游</span>
          </div>
        </section>
      </div>

      <section class="prompt-panel card">
        <div class="prompt-heading">修改指令</div>

        <div class="prompt-row">
          <textarea class="prompt-box" placeholder="补充目的地、出行天数、风格调性或重点景点"></textarea>

          <div class="prompt-buttons">
            <button class="ghost-action">保存草稿箱</button>
            <button class="ghost-action">再次生成</button>
            <button class="confirm-action">确认发布 <span>›</span></button>
          </div>
        </div>
      </section>
    </section>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
</script>
