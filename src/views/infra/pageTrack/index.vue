<template>
  <ContentWrap>
    <el-form class="-mb-15px" :inline="true" label-width="80px">
      <el-form-item label="页面路径">
        <el-input
          v-model="queryParams.pagePath"
          placeholder="支持模糊搜索"
          clearable
          class="!w-220px"
          @keyup.enter="loadData"
        />
      </el-form-item>
      <el-form-item label="平台">
        <el-input
          v-model="queryParams.platform"
          placeholder="如 ios / android / web"
          clearable
          class="!w-160px"
          @keyup.enter="loadData"
        />
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="dateRange"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-280px"
          @change="loadData"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="loadData"><Icon icon="ep:search" class="mr-5px" /> 查询</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <el-row :gutter="16" class="mb-16px">
    <el-col :md="12" :sm="24">
      <el-card shadow="never">
        <div class="text-14px text-gray-500">页面浏览量 (PV)</div>
        <div class="mt-8px text-28px font-bold">{{ summary.pv ?? 0 }}</div>
      </el-card>
    </el-col>
    <el-col :md="12" :sm="24">
      <el-card shadow="never">
        <div class="text-14px text-gray-500">独立访客 (UV)</div>
        <div class="mt-8px text-28px font-bold">{{ summary.uv ?? 0 }}</div>
      </el-card>
    </el-col>
  </el-row>

  <ContentWrap>
    <el-card shadow="never" class="mb-16px">
      <template #header>
        <span>访问趋势</span>
      </template>
      <Echart :options="trendOption" :height="320" />
    </el-card>

    <el-card shadow="never" class="mb-16px">
      <template #header>
        <div class="flex items-center justify-between">
          <span>IP 访问分析</span>
          <span class="text-13px text-gray-500 font-normal">
            共 {{ ipStatList.length }} 个 IP · Top1 占比 {{ ipTopShareText }}
          </span>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="ipStatList"
        max-height="420"
        :default-sort="{ prop: 'pv', order: 'descending' }"
      >
        <el-table-column type="index" label="#" width="56" align="center" />
        <el-table-column label="IP 地址" prop="userIp" min-width="140" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.userIp || '未知 IP' }}
          </template>
        </el-table-column>
        <el-table-column label="归属地" prop="ipLocation" min-width="180" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.ipLocation || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="PV" prop="pv" width="100" align="center" sortable />
        <el-table-column label="UV" prop="uv" width="100" align="center" sortable />
        <el-table-column label="PV 占比" prop="pvShare" width="110" align="center" sortable :sort-method="sortByPvShare">
          <template #default="scope">
            {{ formatPercent(scope.row.pvShare) }}
          </template>
        </el-table-column>
        <el-table-column label="访问深度" prop="depth" width="110" align="center" sortable :sort-method="sortByDepth">
          <template #default="scope">
            {{ formatDepth(scope.row.depth) }}
          </template>
        </el-table-column>
        <el-table-column label="说明" min-width="140" show-overflow-tooltip>
          <template #default="scope">
            {{ ipBehaviorHint(scope.row) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never" class="mb-16px">
      <template #header>
        <span>页面 PV / UV 排行</span>
      </template>
      <el-table v-loading="loading" :data="pageRankList">
        <el-table-column label="页面路径" prop="pagePath" min-width="220" show-overflow-tooltip />
        <el-table-column label="页面名称" min-width="140" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.pageName || scope.row.pagePath || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="PV" prop="pv" width="120" align="center" sortable />
        <el-table-column label="UV" prop="uv" width="120" align="center" sortable />
      </el-table>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <span>访问明细</span>
      </template>
      <el-table v-loading="logLoading" :data="logList">
        <el-table-column label="编号" prop="id" width="90" align="center" />
        <el-table-column label="页面路径" prop="pagePath" min-width="180" show-overflow-tooltip />
        <el-table-column label="页面名称" min-width="120" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.pageName || scope.row.pagePath || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="用户编号" prop="userId" width="100" align="center" />
        <el-table-column label="访客标识" prop="visitorId" min-width="160" show-overflow-tooltip />
        <el-table-column label="平台" prop="platform" width="100" align="center" />
        <el-table-column label="IP" prop="userIp" width="130" show-overflow-tooltip />
        <el-table-column label="归属地" prop="ipLocation" min-width="160" show-overflow-tooltip />
        <el-table-column
          label="访问时间"
          prop="createTime"
          width="180"
          align="center"
          :formatter="dateFormatter"
        />
      </el-table>
      <Pagination
        :total="logTotal"
        v-model:page="logQuery.pageNo"
        v-model:limit="logQuery.pageSize"
        @pagination="loadLogs"
      />
    </el-card>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { beginOfDay, dateFormatter, endOfDay, formatDate } from '@/utils/formatTime'
import * as PageTrackApi from '@/api/infra/pageTrack'
import type {
  PageTrackIpStatVO,
  PageTrackPageStatVO,
  PageTrackSummaryVO,
  PageTrackTrendVO,
  PageViewLogVO
} from '@/api/infra/pageTrack'

defineOptions({ name: 'InfraPageTrack' })

type IpStatRow = PageTrackIpStatVO & {
  pvShare: number
  depth: number | null
}

const loading = ref(false)
const logLoading = ref(false)
const summary = ref<PageTrackSummaryVO>({ pv: 0, uv: 0 })
const pageRankList = ref<PageTrackPageStatVO[]>([])
const ipStatList = ref<IpStatRow[]>([])
const logList = ref<PageViewLogVO[]>([])
const logTotal = ref(0)

const dateRange = ref<[string, string]>([
  formatDate(beginOfDay(new Date(Date.now() - 3600 * 1000 * 24 * 6))),
  formatDate(endOfDay(new Date()))
])

const queryParams = reactive({
  pagePath: '',
  platform: ''
})

const logQuery = reactive({
  pageNo: 1,
  pageSize: 10,
  pagePath: '',
  platform: '',
  createTime: [] as string[]
})

const trendOption = reactive({
  legend: {
    data: ['PV', 'UV']
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: [] as string[]
  },
  yAxis: {
    minInterval: 1
  },
  series: [
    {
      name: 'PV',
      type: 'line',
      smooth: true,
      data: [] as number[]
    },
    {
      name: 'UV',
      type: 'line',
      smooth: true,
      data: [] as number[]
    }
  ]
})

const ipTopShareText = computed(() => {
  if (!ipStatList.value.length || !summary.value.pv) {
    return '0%'
  }
  return formatPercent(ipStatList.value[0].pvShare)
})

const formatPercent = (value?: number | null) => {
  if (value == null || Number.isNaN(value)) {
    return '0%'
  }
  return `${value.toFixed(1)}%`
}

const formatDepth = (value?: number | null) => {
  if (value == null || Number.isNaN(value)) {
    return '-'
  }
  return value.toFixed(1)
}

const buildIpStatRows = (data: PageTrackIpStatVO[], totalPv: number): IpStatRow[] => {
  return data.map((item) => {
    const pv = item.pv ?? 0
    const uv = item.uv ?? 0
    return {
      ...item,
      pvShare: totalPv > 0 ? (pv / totalPv) * 100 : 0,
      depth: uv > 0 ? pv / uv : null
    }
  })
}

const sortByPvShare = (a: IpStatRow, b: IpStatRow) => a.pvShare - b.pvShare
const sortByDepth = (a: IpStatRow, b: IpStatRow) => (a.depth ?? 0) - (b.depth ?? 0)

const ipBehaviorHint = (row: IpStatRow) => {
  const depth = row.depth
  if (depth == null) {
    return '暂无 UV'
  }
  if (depth >= 8) {
    return '高频访问，建议关注'
  }
  if (depth >= 4) {
    return '活跃访问'
  }
  if (depth <= 1.2) {
    return '浅访问'
  }
  return '正常访问'
}

const buildStatParams = () => {
  const [beginTime, endTime] = dateRange.value
  return {
    pagePath: queryParams.pagePath || undefined,
    platform: queryParams.platform || undefined,
    beginTime,
    endTime
  }
}

const loadSummaryAndRank = async () => {
  loading.value = true
  try {
    const params = buildStatParams()
    const [summaryData, rankData, trendData, ipStatData] = await Promise.all([
      PageTrackApi.getPageTrackSummary(params),
      PageTrackApi.getPageTrackPageRank(params),
      PageTrackApi.getPageTrackTrend(params),
      PageTrackApi.getPageTrackIpStat(params)
    ])
    summary.value = summaryData
    pageRankList.value = rankData
    ipStatList.value = buildIpStatRows(ipStatData, summaryData.pv ?? 0)
    updateTrendChart(trendData)
  } finally {
    loading.value = false
  }
}

const updateTrendChart = (trendData: PageTrackTrendVO[]) => {
  trendOption.xAxis.data = trendData.map((item) => item.statDate)
  trendOption.series[0].data = trendData.map((item) => item.pv)
  trendOption.series[1].data = trendData.map((item) => item.uv)
}

const loadLogs = async () => {
  logLoading.value = true
  try {
    const [beginTime, endTime] = dateRange.value
    logQuery.pagePath = queryParams.pagePath
    logQuery.platform = queryParams.platform
    logQuery.createTime = [beginTime, endTime]
    const data = await PageTrackApi.getPageViewLogPage(logQuery)
    logList.value = data.list
    logTotal.value = data.total
  } finally {
    logLoading.value = false
  }
}

const loadData = async () => {
  logQuery.pageNo = 1
  await Promise.all([loadSummaryAndRank(), loadLogs()])
}

const resetQuery = () => {
  queryParams.pagePath = ''
  queryParams.platform = ''
  dateRange.value = [
    formatDate(beginOfDay(new Date(Date.now() - 3600 * 1000 * 24 * 6))),
    formatDate(endOfDay(new Date()))
  ]
  loadData()
}

onMounted(() => {
  loadData()
})
</script>
