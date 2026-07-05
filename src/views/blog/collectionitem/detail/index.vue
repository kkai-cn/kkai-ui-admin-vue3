<template>
  <ContentWrap v-loading="loading">
    <div class="mb-15px flex items-center justify-between">
      <span class="text-lg font-bold">博客合集条目详情</span>
      <div>
        <el-button @click="handleBack">返 回</el-button>
        <el-button
          type="primary"
          @click="openForm('update', detailData.id)"
          v-hasPermi="['blog:collection-item:update']"
        >
          编 辑
        </el-button>
      </div>
    </div>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="编号">
        {{ detailData.id ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="合集编号">
        {{ detailData.collectionId ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="博客编号">
        {{ detailData.blogId ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="排序，大在前">
        {{ detailData.sort ?? '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ formatDate(detailData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="更新者">
        {{ detailData.updater ?? '-' }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <CollectionItemForm ref="formRef" @success="getDetail" />
</template>
<script setup lang="ts">
import { CollectionItemApi, CollectionItemVO } from '@/api/blog/collectionitem'
import { formatDate } from '@/utils/formatTime'
import CollectionItemForm from '../CollectionItemForm.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

/** 博客合集条目 详情 */
defineOptions({ name: 'CollectionItemDetail' })

const route = useRoute()
const { push, currentRoute } = useRouter()
const message = useMessage()
const { delView } = useTagsViewStore()

const loading = ref(true)
const detailData = ref<CollectionItemVO>({} as CollectionItemVO)
const id = computed(() => Number(route.params.id))

/** 获取详情 */
const getDetail = async () => {
  if (!id.value) {
    return
  }
  loading.value = true
  try {
    detailData.value = await CollectionItemApi.getCollectionItem(id.value)
  } finally {
    loading.value = false
  }
}

/** 返回列表 */
const handleBack = () => {
  delView(unref(currentRoute))
  push({ name: 'CollectionItem' })
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