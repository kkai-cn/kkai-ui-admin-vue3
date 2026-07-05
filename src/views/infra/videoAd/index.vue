<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="投放位置" prop="placement">
        <el-input
          v-model="queryParams.placement"
          placeholder="请输入投放位置"
          clearable
          class="!w-220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="广告标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入广告标题"
          clearable
          class="!w-220px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-select
          v-model="queryParams.enabled"
          placeholder="请选择状态"
          clearable
          class="!w-160px"
        >
          <el-option label="启用" :value="true" />
          <el-option label="停用" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['infra:video-ad:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="编号" align="center" prop="id" width="80" />
      <el-table-column label="投放位置" align="center" prop="placement" width="110" />
      <el-table-column label="标题" align="center" prop="title" min-width="160" />
      <el-table-column
        label="描述"
        align="center"
        prop="subtitle"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column label="素材" align="center" width="96">
        <template #default="scope">
          <el-image
            v-if="scope.row.imageUrl"
            :src="scope.row.imageUrl"
            fit="cover"
            class="h-46px w-72px rounded"
            :preview-src-list="[scope.row.imageUrl]"
            preview-teleported
          />
          <span v-else class="text-gray-400">无</span>
        </template>
      </el-table-column>
      <el-table-column
        label="跳转地址"
        align="center"
        prop="actionUrl"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column label="时长" align="center" prop="durationSeconds" width="90">
        <template #default="scope">{{ scope.row.durationSeconds }} 秒</template>
      </el-table-column>
      <el-table-column label="跳过延迟" align="center" prop="skipAfterSeconds" width="100">
        <template #default="scope">
          {{ scope.row.skipAfterSeconds > 0 ? `${scope.row.skipAfterSeconds} 秒` : '立即' }}
        </template>
      </el-table-column>
      <el-table-column label="插入点" align="center" prop="cuePoints" width="100" />
      <el-table-column label="投放比例" align="center" prop="deliveryRatio" width="100">
        <template #default="scope">{{ scope.row.deliveryRatio }}%</template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" width="90" />
      <el-table-column label="状态" align="center" prop="enabled" width="90">
        <template #default="scope">
          <el-tag :type="scope.row.enabled ? 'success' : 'info'">
            {{ scope.row.enabled ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="有效期" align="center" min-width="280">
        <template #default="scope">
          <span>{{ scope.row.startTime || '立即' }} ~ {{ scope.row.endTime || '长期' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" fixed="right" width="140">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['infra:video-ad:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['infra:video-ad:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <VideoAdForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as VideoAdApi from '@/api/infra/videoAd'
import VideoAdForm from './VideoAdForm.vue'

defineOptions({ name: 'InfraVideoAd' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const total = ref(0)
const list = ref<VideoAdApi.VideoAdVO[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  placement: undefined,
  title: undefined,
  enabled: undefined,
  createTime: []
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await VideoAdApi.getVideoAdPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await VideoAdApi.deleteVideoAd(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
