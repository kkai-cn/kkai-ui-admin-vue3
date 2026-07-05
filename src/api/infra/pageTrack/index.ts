import request from '@/config/axios'

export interface PageTrackSummaryVO {
  pv: number
  uv: number
}

export interface PageTrackPageStatVO {
  pagePath: string
  pageName?: string
  pv: number
  uv: number
}

export interface PageTrackTrendVO {
  statDate: string
  pv: number
  uv: number
}

export interface PageTrackIpStatVO {
  userIp: string
  ipLocation?: string
  pv: number
  uv: number
}

export interface PageViewLogVO {
  id: number
  pagePath: string
  pageName?: string
  userId?: number
  visitorId: string
  platform?: string
  userIp?: string
  ipLocation?: string
  createTime: string
}

export const getPageTrackSummary = async (params) => {
  return await request.get({ url: '/infra/page-track/stat/summary', params })
}

export const getPageTrackPageRank = async (params) => {
  return await request.get({ url: '/infra/page-track/stat/page-rank', params })
}

export const getPageTrackTrend = async (params) => {
  return await request.get({ url: '/infra/page-track/stat/trend', params })
}

export const getPageViewLogPage = async (params) => {
  return await request.get({ url: '/infra/page-track/log/page', params })
}

export const getPageTrackIpStat = async (params) => {
  return await request.get({ url: '/infra/page-track/stat/ip-stat', params })
}
