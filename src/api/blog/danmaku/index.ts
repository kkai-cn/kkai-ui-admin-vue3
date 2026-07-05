import request from '@/config/axios'

// 博客视频弹幕 VO
export interface DanmakuVO {
  id: number // 编号
  blogId: number // 博客编号
  userId: number // 发布人会员编号
  content: string // 弹幕内容
  positionMillis: number // 视频播放位置（毫秒）
  creator: string // 创建者
  createTime: Date // 创建时间
  updater: string // 更新者
  updateTime: Date // 更新时间
}

// 博客视频弹幕 API
export const DanmakuApi = {
  // 查询博客视频弹幕分页
  getDanmakuPage: async (params: any) => {
    return await request.get({ url: `/blog/danmaku/page`, params })
  },

  // 查询博客视频弹幕详情
  getDanmaku: async (id: number) => {
    return await request.get({ url: `/blog/danmaku/get?id=` + id })
  },

  // 新增博客视频弹幕
  createDanmaku: async (data: DanmakuVO) => {
    return await request.post({ url: `/blog/danmaku/create`, data })
  },

  // 修改博客视频弹幕
  updateDanmaku: async (data: DanmakuVO) => {
    return await request.put({ url: `/blog/danmaku/update`, data })
  },

  // 删除博客视频弹幕
  deleteDanmaku: async (id: number) => {
    return await request.delete({ url: `/blog/danmaku/delete?id=` + id })
  },

  // 导出博客视频弹幕 Excel
  exportDanmaku: async (params) => {
    return await request.download({ url: `/blog/danmaku/export-excel`, params })
  }
}