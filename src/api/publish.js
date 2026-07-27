import request from './request'

/**
 * 生成小红书文案
 *
 * 后端接口协议对齐 scenic-viral-content-generator：
 * 输入：符合 scenic-content-request/v1 schema 的请求体
 * 输出：符合 scenic-generated-post/v1 schema 的响应体
 *
 * @param {Object} payload
 * @param {string} payload.topic            必填。文案主题
 * @param {string[]} payload.keywords       必填。关键词列表
 * @param {string} [payload.platform='xhs'] 平台，xhs / douyin / kuaishou
 * @param {string} [payload.guide_text]     官方景区/产品介绍文本
 * @param {Object} [payload.reference]      参考帖子（用于风格分析）
 * @param {string} [payload.reference.title]
 * @param {string} [payload.reference.content]
 * @param {number} [payload.reference.likes]
 * @param {number} [payload.reference.comments]
 * @param {string} [payload.audience]       目标受众
 * @param {string} [payload.intent]         生成意图
 * @returns {Promise<GeneratedPost>}
 *
 * @typedef {Object} GeneratedPost
 * @property {string} candidate_id
 * @property {string} title
 * @property {string} body
 * @property {string[]} hashtags
 * @property {string[]} used_fact_ids
 * @property {string} hook
 * @property {ImageBrief[]} image_briefs
 * @property {string[]} revision_notes
 * @property {string} schema_version   // scenic-generated-post/v1
 * @property {string} platform
 * @property {string} topic
 * @property {string} generated_at     // ISO 8601
 * @property {string} text_provider    // mock / openai / dashscope ...
 *
 * @typedef {Object} ImageBrief
 * @property {string} purpose
 * @property {string} subject
 * @property {string} composition
 */
export const generateContent = (payload) => {
  return request.post('/content/generate', payload)
}

/**
 * 获取生成过程中的配图提示词（scenic-image-prompts/v1）
 * 由后端在生成完成后异步产出，通过 candidate_id 检索。
 *
 * @param {string} candidateId
 * @returns {Promise<ImagePromptPack>}
 *
 * @typedef {Object} ImagePromptPack
 * @property {string} schema_version   // scenic-image-prompts/v1
 * @property {string} generated_at
 * @property {ImagePromptItem[]} items
 *
 * @typedef {Object} ImagePromptItem
 * @property {string} image_id
 * @property {string} purpose
 * @property {string} prompt
 * @property {string} negative_prompt
 * @property {string} size             // e.g. "1024x1365"
 * @property {string} ratio            // e.g. "3:4"
 */
export const getImagePrompts = (candidateId) => {
  return request.get(`/content/${candidateId}/image-prompts`)
}

/**
 * 获取生成的验证报告（scenic-validation-report/v1）
 * 事实准确性、平台规范、原创性检查
 *
 * @param {string} candidateId
 * @returns {Promise<Object>}
 */
export const getValidationReport = (candidateId) => {
  return request.get(`/content/${candidateId}/validation`)
}

// ==== 以下为占位接口，后端未实现时保留 ====

export const publishArticle = (data) => {
  return request.post('/articles/publish', data)
}

export const saveDraft = (data) => {
  return request.post('/articles/draft', data)
}

export const uploadImage = (formData) => {
  return request.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
