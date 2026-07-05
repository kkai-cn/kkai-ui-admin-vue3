import request from '@/config/axios'

export interface VideoAdVO {
  id?: number
  placement: string
  title: string
  subtitle?: string
  imageUrl?: string
  actionUrl?: string
  durationSeconds: number
  skipAfterSeconds: number
  cuePoints: string
  deliveryRatio: number
  enabled: boolean
  sort: number
  startTime?: string
  endTime?: string
  createTime?: Date
}

// 查询视频广告分页
export const getVideoAdPage = (params: PageParam) => {
  return request.get({ url: '/infra/video-ad/page', params })
}

// 查询视频广告详情
export const getVideoAd = (id: number) => {
  return request.get({ url: '/infra/video-ad/get?id=' + id })
}

// 新增视频广告
export const createVideoAd = (data: VideoAdVO) => {
  return request.post({ url: '/infra/video-ad/create', data })
}

// 修改视频广告
export const updateVideoAd = (data: VideoAdVO) => {
  return request.put({ url: '/infra/video-ad/update', data })
}

// 删除视频广告
export const deleteVideoAd = (id: number) => {
  return request.delete({ url: '/infra/video-ad/delete?id=' + id })
}
