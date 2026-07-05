import request from '@/config/axios'

// 博客评论 VO
export interface CommentVO {
  id: number // 编号
  blogId: number // 博客编号
  userId: number // 评论人会员编号
  content: string // 评论内容
  parentId: number // 父评论编号，0 表示一级评论
  rootId: number // 根评论编号（一级评论为自身 id）
  replyUserId: number // 被回复的会员编号
  pinned: boolean // 是否作者置顶（仅一级评论）
  pinTime: Date // 置顶时间
  createTime: Date // 创建时间
}

// 博客评论 API
export const CommentApi = {
  // 查询博客评论分页
  getCommentPage: async (params: any) => {
    return await request.get({ url: `/blog/comment/page`, params })
  },

  // 查询博客评论详情
  getComment: async (id: number) => {
    return await request.get({ url: `/blog/comment/get?id=` + id })
  },

  // 新增博客评论
  createComment: async (data: CommentVO) => {
    return await request.post({ url: `/blog/comment/create`, data })
  },

  // 修改博客评论
  updateComment: async (data: CommentVO) => {
    return await request.put({ url: `/blog/comment/update`, data })
  },

  // 删除博客评论
  deleteComment: async (id: number) => {
    return await request.delete({ url: `/blog/comment/delete?id=` + id })
  },

  // 导出博客评论 Excel
  exportComment: async (params) => {
    return await request.download({ url: `/blog/comment/export-excel`, params })
  }
}