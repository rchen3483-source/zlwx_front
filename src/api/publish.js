import request from './request'

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

export const generateInspiration = (params) => {
  return request.post('/inspiration/generate', params)
}
