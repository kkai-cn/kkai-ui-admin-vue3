import request from '@/config/axios'

// 博客合集条目 VO
export interface CollectionItemVO {
  id: number // 编号
  collectionId: number // 合集编号
  blogId: number // 博客编号
  sort: number // 排序，大在前
  createTime: Date // 创建时间
  updater: string // 更新者
}

// 博客合集条目 API
export const CollectionItemApi = {
  // 查询博客合集条目分页
  getCollectionItemPage: async (params: any) => {
    return await request.get({ url: `/blog/collection-item/page`, params })
  },

  // 查询博客合集条目详情
  getCollectionItem: async (id: number) => {
    return await request.get({ url: `/blog/collection-item/get?id=` + id })
  },

  // 新增博客合集条目
  createCollectionItem: async (data: CollectionItemVO) => {
    return await request.post({ url: `/blog/collection-item/create`, data })
  },

  // 修改博客合集条目
  updateCollectionItem: async (data: CollectionItemVO) => {
    return await request.put({ url: `/blog/collection-item/update`, data })
  },

  // 删除博客合集条目
  deleteCollectionItem: async (id: number) => {
    return await request.delete({ url: `/blog/collection-item/delete?id=` + id })
  },

  // 导出博客合集条目 Excel
  exportCollectionItem: async (params) => {
    return await request.download({ url: `/blog/collection-item/export-excel`, params })
  }
}