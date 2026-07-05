<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="720px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="110px"
    >
      <el-form-item label="投放位置" prop="placement">
        <el-input v-model="formData.placement" placeholder="请输入投放位置，例如 video" />
      </el-form-item>
      <el-form-item label="广告标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入广告标题" />
      </el-form-item>
      <el-form-item label="广告描述" prop="subtitle">
        <el-input v-model="formData.subtitle" placeholder="请输入广告描述" />
      </el-form-item>
      <el-form-item label="素材图片" prop="imageUrl">
        <el-input
          v-model="formData.imageUrl"
          placeholder="请输入图片地址，支持相对路径或完整 URL"
        />
      </el-form-item>
      <el-form-item label="跳转地址" prop="actionUrl">
        <el-input v-model="formData.actionUrl" placeholder="请输入点击跳转地址" />
      </el-form-item>
      <el-form-item label="展示时长" prop="durationSeconds">
        <el-input-number v-model="formData.durationSeconds" :min="1" :max="999" />
        <span class="ml-8px text-12px text-gray-500">秒</span>
      </el-form-item>
      <el-form-item label="跳过延迟" prop="skipAfterSeconds">
        <el-input-number v-model="formData.skipAfterSeconds" :min="0" :max="999" />
        <span class="ml-8px text-12px text-gray-500">秒后显示「跳过广告」按钮，0 表示立即显示</span>
      </el-form-item>
      <el-form-item label="插入点" prop="cuePoints">
        <el-input v-model="formData.cuePoints" placeholder="例如 0,30；0 表示片头广告" />
      </el-form-item>
      <el-form-item label="投放比例" prop="deliveryRatio">
        <el-input-number v-model="formData.deliveryRatio" :min="1" :max="100" />
        <span class="ml-8px text-12px text-gray-500">%（按视频 ID 末两位决定是否展示）</span>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="0" />
      </el-form-item>
      <el-form-item label="启用状态" prop="enabled">
        <el-switch v-model="formData.enabled" active-text="启用" inactive-text="停用" />
      </el-form-item>
      <el-form-item label="有效期">
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          class="!w-420px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import * as VideoAdApi from '@/api/infra/videoAd'

defineOptions({ name: 'InfraVideoAdForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const timeRange = ref<string[]>([])
const formData = ref<VideoAdApi.VideoAdVO>({
  id: undefined,
  placement: 'video',
  title: '',
  subtitle: '',
  imageUrl: '',
  actionUrl: '',
  durationSeconds: 5,
  skipAfterSeconds: 3,
  cuePoints: '0,30',
  deliveryRatio: 100,
  enabled: true,
  sort: 100,
  startTime: undefined,
  endTime: undefined
})
const formRules = reactive<FormRules>({
  placement: [{ required: true, message: '投放位置不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '广告标题不能为空', trigger: 'blur' }],
  durationSeconds: [{ required: true, message: '展示时长不能为空', trigger: 'blur' }],
  skipAfterSeconds: [{ required: true, message: '跳过延迟不能为空', trigger: 'blur' }],
  cuePoints: [{ required: true, message: '插入点不能为空', trigger: 'blur' }],
  deliveryRatio: [{ required: true, message: '投放比例不能为空', trigger: 'blur' }],
  enabled: [{ required: true, message: '启用状态不能为空', trigger: 'change' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
})
const formRef = ref()

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      const data = await VideoAdApi.getVideoAd(id)
      formData.value = data
      timeRange.value = data.startTime && data.endTime ? [data.startTime, data.endTime] : []
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    const data = {
      ...formData.value,
      startTime: timeRange.value?.[0],
      endTime: timeRange.value?.[1]
    } as VideoAdApi.VideoAdVO
    if (formType.value === 'create') {
      await VideoAdApi.createVideoAd(data)
      message.success(t('common.createSuccess'))
    } else {
      await VideoAdApi.updateVideoAd(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  timeRange.value = []
  formData.value = {
    id: undefined,
    placement: 'video',
    title: '',
    subtitle: '',
    imageUrl: '',
    actionUrl: '',
    durationSeconds: 5,
    skipAfterSeconds: 3,
    cuePoints: '0,30',
    deliveryRatio: 100,
    enabled: true,
    sort: 100,
    startTime: undefined,
    endTime: undefined
  }
  formRef.value?.resetFields()
}
</script>
