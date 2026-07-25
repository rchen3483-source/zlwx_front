<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const xiaohongshu = ref(false)
const douyin = ref(false)
const wechat = ref(false)
const bilibili = ref(false)
</script>

<template>
  <AppLayout mainClass="publish-page">
    <AppTopbar title="图文发布" :showCommandBtn="false" />

    <section class="composer-panel">
      <div class="block-head">
        <h2>平台选择</h2>
      </div>

      <div class="channel-grid">
        <label class="channel-card">
          <div class="channel-meta">
            <img class="channel-logo-image" src="/assets/xiaohongshu.png" alt="小红书图标" />
            <strong>小红书</strong>
          </div>
          <input type="checkbox" v-model="xiaohongshu" />
        </label>
        <label class="channel-card">
          <div class="channel-meta">
            <img class="channel-logo-image" src="/assets/douyin.png" alt="抖音图标" />
            <strong>抖音</strong>
          </div>
          <input type="checkbox" v-model="douyin" />
        </label>
        <label class="channel-card">
          <div class="channel-meta">
            <img class="channel-logo-image" src="/assets/wechat.png" alt="微信公众号图标" />
            <strong>微信公众号</strong>
          </div>
          <input type="checkbox" v-model="wechat" />
        </label>
        <label class="channel-card">
          <div class="channel-meta">
            <img class="channel-logo-image" src="/assets/bilibili.png" alt="bilibili图标" />
            <strong>bilibili</strong>
          </div>
          <input type="checkbox" v-model="bilibili" />
        </label>
      </div>

      <div class="block-head block-head-spaced">
        <h2>平台选择</h2>
      </div>

      <section class="search-panel card">
        <div class="search-input">
          <span class="search-icon">⌕</span>
          <span>这是八达岭长城，希望展示长城的宏伟壮丽......</span>
        </div>

        <div class="search-thumbs">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div class="search-actions">
          <button class="primary-btn">开始检索</button>
        </div>
      </section>

      <div class="keyword-row">
        <span class="keyword-label">推荐关键词：</span>
        <span class="keyword-chip">故宫博物院</span>
        <span class="keyword-chip">西湖断桥</span>
        <span class="keyword-chip">丽江古城</span>
        <span class="keyword-chip">黄山云海</span>
        <span class="keyword-chip">稻城亚丁</span>
      </div>

      <div class="section-head trend-head">
        <h2>热榜推荐</h2>
        <a href="#">查看更多</a>
      </div>

      <div class="trend-grid">
        <article class="trend-card card">
          <div class="trend-top">
            <span>#经典景点</span>
            <strong>Top 1</strong>
          </div>

          <div class="trend-media">
            <div class="play-badge">▶</div>
            <div class="trend-summary">
              <h3>打卡万里长城啦！</h3>
              <p>32.5万人参与，15.3亿浏览</p>
            </div>
          </div>

          <p class="trend-copy">
            说明：适用于xxxxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxxxx推广，
          </p>

          <img class="trend-photo" src="/assets/reference-photo.png" alt="参考图" />

          <div class="trend-actions">
            <button class="secondary-btn">查看详情</button>
            <a class="primary-btn small button-link" href="./inspiration-create.html">借鉴创作</a>
          </div>
        </article>

        <article class="trend-card card">
          <div class="trend-top">
            <span>#经典景点</span>
            <strong>Top 2</strong>
          </div>
          <div class="trend-media">
            <div class="play-badge">▶</div>
            <div class="trend-summary">
              <h3>打卡万里长城啦！</h3>
              <p>32.5万人参与，15.3亿浏览</p>
            </div>
          </div>
          <p class="trend-copy">
            说明：适用于xxxxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxxxx推广，
          </p>
          <img class="trend-photo" src="/assets/reference-photo.png" alt="参考图" />
          <div class="trend-actions">
            <button class="secondary-btn">查看详情</button>
            <a class="primary-btn small button-link" href="./inspiration-create.html">借鉴创作</a>
          </div>
        </article>

        <article class="trend-card card">
          <div class="trend-top">
            <span>#经典景点</span>
            <strong>Top 3</strong>
          </div>
          <div class="trend-media">
            <div class="play-badge">▶</div>
            <div class="trend-summary">
              <h3>打卡万里长城啦！</h3>
              <p>32.5万人参与，15.3亿浏览</p>
            </div>
          </div>
          <p class="trend-copy">
            说明：适用于xxxxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxxxx推广，
          </p>
          <img class="trend-photo" src="/assets/reference-photo.png" alt="参考图" />
          <div class="trend-actions">
            <button class="secondary-btn">查看详情</button>
            <a class="primary-btn small button-link" href="./inspiration-create.html">借鉴创作</a>
          </div>
        </article>

        <article class="trend-card card">
          <div class="trend-top">
            <span>#经典景点</span>
            <strong>Top 4</strong>
          </div>
          <div class="trend-media">
            <div class="play-badge">▶</div>
            <div class="trend-summary">
              <h3>打卡万里长城啦！</h3>
              <p>32.5万人参与，15.3亿浏览</p>
            </div>
          </div>
          <p class="trend-copy">
            说明：适用于xxxxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxx推广，此处填写视频文案方使用户选择。适用于xxxxxxxx推广，
          </p>
          <img class="trend-photo" src="/assets/reference-photo.png" alt="参考图" />
          <div class="trend-actions">
            <button class="secondary-btn">查看详情</button>
            <a class="primary-btn small button-link" href="./inspiration-create.html">借鉴创作</a>
          </div>
        </article>
      </div>
    </section>
  </AppLayout>
</template>
