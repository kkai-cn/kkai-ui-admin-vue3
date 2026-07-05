<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="广场id" prop="squareId">
        <el-input
          v-model="queryParams.squareId"
          placeholder="请输入广场id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="话题id列表" prop="topicIds">
        <el-input
          v-model="queryParams.topicIds"
          placeholder="请输入话题id列表"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="分类，1:普通，2:求助，3:助力" prop="categary">
        <el-input
          v-model="queryParams.categary"
          placeholder="请输入分类，1:普通，2:求助，3:助力"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="类型，1:图文，2:视频" prop="blogType">
        <el-select
          v-model="queryParams.blogType"
          placeholder="请选择类型，1:图文，2:视频"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="资源列表" prop="resources">
        <el-input
          v-model="queryParams.resources"
          placeholder="请输入资源列表"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="背景音乐地址" prop="backgroundMusicUrl">
        <el-input
          v-model="queryParams.backgroundMusicUrl"
          placeholder="请输入背景音乐地址"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="声音播放模式" prop="soundMode">
        <el-select
          v-model="queryParams.soundMode"
          placeholder="请选择声音播放模式"
          clearable
          class="!w-240px"
        >
          <el-option label="视频原声" :value="1" />
          <el-option label="背景音乐" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="地区" prop="addressId">
        <el-input
          v-model="queryParams.addressId"
          placeholder="请输入地区"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="共享类型。1:公开，2:私密，3:仅朋友可看" prop="shareType">
        <el-select
          v-model="queryParams.shareType"
          placeholder="请选择共享类型。1:公开，2:私密，3:仅朋友可看"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
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
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['blog:blog:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['blog:blog:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="广场id" align="center" prop="squareId" />
      <el-table-column label="话题id列表" align="center" prop="topicIds" />
      <el-table-column label="分类，1:普通，2:求助，3:助力" align="center" prop="categary" />
      <el-table-column label="类型，1:图文，2:视频" align="center" prop="blogType" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="资源列表" align="center" prop="resources" />
      <el-table-column label="背景音乐地址" align="center" prop="backgroundMusicUrl" />
      <el-table-column label="背景音乐名称" align="center" prop="backgroundMusicName" />
      <el-table-column label="声音播放模式" align="center" prop="soundMode" />
      <el-table-column label="地区" align="center" prop="addressId" />
      <el-table-column label="共享类型。1:公开，2:私密，3:仅朋友可看" align="center" prop="shareType" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['blog:blog:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['blog:blog:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <BlogForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { BlogApi, BlogVO } from '@/api/blog/blog'
import download from '@/utils/download'
import BlogForm from './BlogForm.vue'

/** 博客 列表 */
defineOptions({ name: 'Blog' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<BlogVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  squareId: undefined,
  topicIds: undefined,
  categary: undefined,
  blogType: undefined,
  title: undefined,
  content: undefined,
  resources: undefined,
  backgroundMusicUrl: undefined,
  soundMode: undefined,
  addressId: undefined,
  shareType: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BlogApi.getBlogPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await BlogApi.deleteBlog(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await BlogApi.exportBlog(queryParams)
    download.excel(data, '博客.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
