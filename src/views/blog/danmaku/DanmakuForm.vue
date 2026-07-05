<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="博客编号" prop="blogId">
        <el-input v-model="formData.blogId" placeholder="请输入博客编号" />
      </el-form-item>
      <el-form-item label="发布人会员编号" prop="userId">
        <el-input v-model="formData.userId" placeholder="请输入发布人会员编号" />
      </el-form-item>
      <el-form-item label="弹幕内容" prop="content">
        <Editor v-model="formData.content" height="150px" />
      </el-form-item>
      <el-form-item label="视频播放位置（毫秒）" prop="positionMillis">
        <el-input v-model="formData.positionMillis" placeholder="请输入视频播放位置（毫秒）" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DanmakuApi, DanmakuVO } from '@/api/blog/danmaku'

/** 博客视频弹幕 表单 */
defineOptions({ name: 'DanmakuForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  blogId: undefined,
  userId: undefined,
  content: undefined,
  positionMillis: undefined
})
const formRules = reactive({
  blogId: [{ required: true, message: '博客编号不能为空', trigger: 'blur' }],
  userId: [{ required: true, message: '发布人会员编号不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '弹幕内容不能为空', trigger: 'blur' }],
  positionMillis: [{ required: true, message: '视频播放位置（毫秒）不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await DanmakuApi.getDanmaku(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as DanmakuVO
    if (formType.value === 'create') {
      await DanmakuApi.createDanmaku(data)
      message.success(t('common.createSuccess'))
    } else {
      await DanmakuApi.updateDanmaku(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    blogId: undefined,
    userId: undefined,
    content: undefined,
    positionMillis: undefined
  }
  formRef.value?.resetFields()
}
</script>
