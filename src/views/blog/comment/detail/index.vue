<template>
  <ContentWrap v-loading="loading">
    <div class="mb-15px flex items-center justify-between">
      <span class="text-lg font-bold">博客评论详情</span>
      <div>
        <el-button @click="handleBack">返 回</el-button>
        <el-button
          type="primary"
          @click="openForm('update', detailData.id)"
          v-hasPermi="['blog:comment:update']"
        >
          编 辑
        </el-button>
      </div>
    </div>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="编号">
        {{ detailData.id ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="博客编号">
        {{ detailData.blogId ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="评论人会员编号">
        {{ detailData.userId ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="评论内容" :span="2">
        <div v-dompurify-html="detailData.content || '-'"></div>
      </el-descriptions-item>
      <el-descriptions-item label="父评论编号，0 表示一级评论">
        {{ detailData.parentId ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="根评论编号（一级评论为自身 id）">
        {{ detailData.rootId ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="被回复的会员编号">
        {{ detailData.replyUserId ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="是否作者置顶（仅一级评论）">
        {{ detailData.pinned ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="置顶时间">
        {{ formatDate(detailData.pinTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <CommentForm ref="formRef" @success="getDetail" />
</template>
<script setup lang="ts">
import { CommentApi, CommentVO } from '@/api/blog/comment'
import { formatDate } from '@/utils/formatTime'
import CommentForm from '../CommentForm.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

/** 博客评论 详情 */
defineOptions({ name: 'CommentDetail' })

const route = useRoute()
const { push, currentRoute } = useRouter()
const message = useMessage()
const { delView } = useTagsViewStore()

const loading = ref(true)
const detailData = ref<CommentVO>({} as CommentVO)
const id = computed(() => Number(route.params.id))

/** 获取详情 */
const getDetail = async () => {
  if (!id.value) {
    return
  }
  loading.value = true
  try {
    detailData.value = await CommentApi.getComment(id.value)
  } finally {
    loading.value = false
  }
}

/** 返回列表 */
const handleBack = () => {
  delView(unref(currentRoute))
  push({ name: 'Comment' })
}

/** 编辑 */
const formRef = ref()
const openForm = (type: string, recordId?: number) => {
  formRef.value.open(type, recordId)
}

/** 初始化 */
onMounted(async () => {
  if (!id.value) {
    message.warning('参数错误，编号不能为空！')
    handleBack()
    return
  }
  await getDetail()
})
</script>