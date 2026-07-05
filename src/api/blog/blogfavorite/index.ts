import request from '@/config/axios'

// 博客收藏 VO
export interface FavoriteVO {
  id: number // 编号
  userId: number // 收藏人
  blogId: number // 博客编号
}

// 博客收藏 API
export const FavoriteApi = {
  // 查询博客收藏分页
  getFavoritePage: async (params: any) => {
    return await request.get({ url: `/blog/favorite/page`, params })
  },

  // 查询博客收藏详情
  getFavorite: async (id: number) => {
    return await request.get({ url: `/blog/favorite/get?id=` + id })
  },

  // 新增博客收藏
  createFavorite: async (data: FavoriteVO) => {
    return await request.post({ url: `/blog/favorite/create`, data })
  },

  // 修改博客收藏
  updateFavorite: async (data: FavoriteVO) => {
    return await request.put({ url: `/blog/favorite/update`, data })
  },

  // 删除博客收藏
  deleteFavorite: async (id: number) => {
    return await request.delete({ url: `/blog/favorite/delete?id=` + id })
  },

  // 导出博客收藏 Excel
  exportFavorite: async (params) => {
    return await request.download({ url: `/blog/favorite/export-excel`, params })
  }
}