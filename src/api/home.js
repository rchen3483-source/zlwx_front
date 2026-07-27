import request from './request'
import { platformData } from './mockData'

const USE_MOCK = true

export const getPlatformStats = (platform) => {
  if (USE_MOCK) {
    return Promise.resolve(platformData[platform])
  }
  return request.get(`/stats/${platform}`)
}

export const getHotNotes = () => {
  if (USE_MOCK) {
    return Promise.resolve([
      { name: 'Admin', count: 211, thumbClass: 'thumb-1' },
      { name: 'Worker', count: 79, thumbClass: 'thumb-2' },
      { name: 'Auditor', count: 65, thumbClass: 'thumb-3' },
      { name: 'Director', count: 23, thumbClass: 'thumb-4' }
    ])
  }
  return request.get('/hot-notes')
}

export const getHotVideos = () => {
  if (USE_MOCK) {
    return Promise.resolve([
      { ip: '236.22.124.62', count: 454 },
      { ip: '31.23.122.14', count: 232 },
      { ip: '73.155.238.124', count: 121 },
      { ip: '230.80.117.8', count: 89 }
    ])
  }
  return request.get('/hot-videos')
}
