<script setup>
import { ref, computed } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart, PieChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import MetricCard from '@/components/MetricCard.vue'

use([BarChart, PieChart, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer])

const activeTab = ref('生产效率')
const timeRange = ref('近7天')
const sideTab = ref('suggest')
const tabs = ['生产效率', '内容质量', '发布效果', '资产复用']

const kpiCards = [
  { label: '生成成功率', value: '93.6%', trend: 2.4, accent: 'emerald' },
  { label: '高风险占比', value: '4.2%', trend: -0.8, color: '#ef4444', accent: 'rose' },
  { label: '近7日播放', value: '128万', trend: 18.6, accent: 'cyan' },
  { label: '模板复用', value: '62%', trend: 5.2, accent: 'indigo' },
  { label: '平均耗时', value: '2m18s', trend: -6.3, accent: 'violet' },
  { label: '单条成本', value: '¥1.86', trend: -3.1, accent: 'amber' },
]

const productionTrendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['生成量', '成功量', '失败量'], bottom: 0, textStyle: { fontSize: 11 } },
  grid: { left: 40, right: 16, top: 24, bottom: 36 },
  xAxis: {
    type: 'category',
    data: ['07-03', '07-04', '07-05', '07-06', '07-07', '07-08', '07-09'],
    axisLabel: { fontSize: 11 },
  },
  yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
  series: [
    { name: '生成量', type: 'bar', data: [8200, 9100, 7800, 10200, 9600, 11200, 8420], itemStyle: { color: '#00b4d8' } },
    { name: '成功量', type: 'bar', data: [7680, 8520, 7320, 9580, 9020, 10480, 7880], itemStyle: { color: '#22c55e' } },
    { name: '失败量', type: 'bar', data: [520, 580, 480, 620, 580, 720, 540], itemStyle: { color: '#ef4444' } },
  ],
}))

const pieLegend = {
  orient: 'vertical',
  right: 0,
  top: 'middle',
  itemWidth: 8,
  itemHeight: 8,
  itemGap: 6,
  textStyle: { fontSize: 10, color: '#64748b' },
}

const failureReasonOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
  legend: {
    ...pieLegend,
    data: ['素材加载', '视频合成', '语音合成', '字幕生成', '风险拦截', '其他'],
  },
  series: [{
    type: 'pie',
    radius: ['28%', '48%'],
    center: ['30%', '50%'],
    data: [
      { name: '素材加载', value: 32.6 },
      { name: '视频合成', value: 27.8 },
      { name: '语音合成', value: 16.2 },
      { name: '字幕生成', value: 12.5 },
      { name: '风险拦截', value: 6.1 },
      { name: '其他', value: 4.8 },
    ],
    label: { show: false },
    color: ['#00b4d8', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e', '#64748b'],
  }],
}))

const riskLevelOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: {
    ...pieLegend,
    data: ['高风险', '中风险', '低风险'],
  },
  series: [{
    type: 'pie',
    radius: ['28%', '48%'],
    center: ['30%', '50%'],
    data: [
      { name: '高风险', value: 420 },
      { name: '中风险', value: 1860 },
      { name: '低风险', value: 7720 },
    ],
    label: { show: false },
    color: ['#ef4444', '#f59e0b', '#22c55e'],
  }],
}))

const channelCompareOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['播放量(万)', '完播率(%)', '互动率(%)'], bottom: 0, textStyle: { fontSize: 11 } },
  grid: { left: 40, right: 16, top: 24, bottom: 36 },
  xAxis: { type: 'category', data: ['抖音', '视频号', '官网'], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
  series: [
    { name: '播放量(万)', type: 'bar', data: [256.8, 128.6, 32.4], itemStyle: { color: '#00b4d8' } },
    { name: '完播率(%)', type: 'bar', data: [42.3, 38.6, 56.2], itemStyle: { color: '#22c55e' } },
    { name: '互动率(%)', type: 'bar', data: [8.6, 6.2, 4.8], itemStyle: { color: '#f59e0b' } },
  ],
}))

const completionDistOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 16, top: 16, bottom: 28 },
  xAxis: {
    type: 'category',
    data: ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'],
    axisLabel: { fontSize: 11 },
  },
  yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
  series: [{
    type: 'bar',
    data: [1280, 2860, 4520, 6280, 8420],
    itemStyle: {
      color: (params) => ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e'][params.dataIndex],
      borderRadius: [4, 4, 0, 0],
    },
  }],
}))

const templateTop5Option = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 100, right: 24, top: 8, bottom: 8 },
  xAxis: { type: 'value', axisLabel: { fontSize: 11 } },
  yAxis: {
    type: 'category',
    data: ['营销活动宣传', '品牌宣传片', '科普短视频', '企业新闻播报', '数字人讲解'].reverse(),
    axisLabel: { fontSize: 11 },
  },
  series: [{
    type: 'bar',
    data: [86, 128, 186, 256, 428].reverse(),
    itemStyle: { color: '#00b4d8', borderRadius: [0, 4, 4, 0] },
  }],
}))

const aiSuggestions = [
  { type: '优化', text: '科普短视频模板完播率偏低，建议优化前3秒 Hook 与配音节奏' },
  { type: '加量', text: '数字人讲解模板互动率最高，建议本周加量 20%' },
  { type: '成本', text: '单条成本连续3日下降，当前 ¥1.86 处于健康区间' },
]

const anomalyAlerts = [
  { level: 'high', text: 'Batch-003 素材加载失败率突增 18.6%' },
  { level: 'medium', text: '抖音矩阵号B 发布成功率降至 95.8%' },
  { level: 'low', text: '知识库资产引用下降 4.2%' },
]

const highEfficiencyAssets = [
  { name: '数字人-小妍', metric: '完播率 48.6%' },
  { name: '科技背景视频', metric: '复用 986 次' },
  { name: '企业新闻播报模板', metric: '成功率 98.2%' },
]

const lowEfficiencyAssets = [
  { name: '品牌宣传片模板', metric: '完播率 22.1%' },
  { name: '自然风光素材包', metric: '驳回率 12.4%' },
  { name: '营销活动宣传', metric: '成本 ¥3.28/条' },
]
</script>

<template>
  <div class="page-shell data-dashboard">
    <div class="page-toolbar with-actions dash-toolbar">
      <el-tabs v-model="activeTab" class="compact-tabs dash-tabs-inline">
        <el-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" />
      </el-tabs>
      <div class="page-toolbar-actions">
        <el-radio-group v-model="timeRange" size="small">
          <el-radio-button value="今日">今日</el-radio-button>
          <el-radio-button value="近7天">近7天</el-radio-button>
          <el-radio-button value="近30天">近30天</el-radio-button>
        </el-radio-group>
        <el-button size="small" type="primary" plain>导出</el-button>
      </div>
    </div>

    <div class="metric-grid dash-kpi kpi-6">
      <MetricCard
        v-for="card in kpiCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :trend="card.trend"
        :color="card.color"
        :accent="card.accent"
      />
    </div>

    <div class="page-split">
      <div class="page-split-main">
        <div class="charts-grid dash-charts">
          <div class="page-card chart-card dash-chart chart-wide chart-bar">
            <h4>生产量趋势</h4>
            <div class="chart-body"><VChart :option="productionTrendOption" autoresize /></div>
          </div>
          <div class="page-card chart-card dash-chart chart-pie">
            <h4>失败原因分布</h4>
            <div class="chart-body"><VChart :option="failureReasonOption" autoresize /></div>
          </div>
          <div class="page-card chart-card dash-chart chart-pie">
            <h4>风险等级分布</h4>
            <div class="chart-body"><VChart :option="riskLevelOption" autoresize /></div>
          </div>
          <div class="page-card chart-card dash-chart chart-wide chart-bar">
            <h4>渠道播放效果</h4>
            <div class="chart-body"><VChart :option="channelCompareOption" autoresize /></div>
          </div>
          <div class="page-card chart-card dash-chart chart-bar-sm">
            <h4>完播率分布</h4>
            <div class="chart-body"><VChart :option="completionDistOption" autoresize /></div>
          </div>
          <div class="page-card chart-card dash-chart chart-bar-sm">
            <h4>模板效果 TOP5</h4>
            <div class="chart-body"><VChart :option="templateTop5Option" autoresize /></div>
          </div>
        </div>
      </div>

      <aside class="page-split-side">
        <div class="page-card fill-card dash-side">
          <el-tabs v-model="sideTab" class="side-tabs compact-tabs">
            <el-tab-pane label="AI建议" name="suggest">
              <div v-for="(s, i) in aiSuggestions" :key="i" class="suggest-item">
                <el-tag size="small" :type="s.type === '加量' ? 'success' : s.type === '成本' ? 'info' : 'warning'">{{ s.type }}</el-tag>
                <p>{{ s.text }}</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="异常" name="alert">
              <div v-for="(a, i) in anomalyAlerts" :key="i" class="alert-item" :class="a.level">
                <el-icon><WarningFilled /></el-icon>
                <span>{{ a.text }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="高效" name="high">
              <div v-for="item in highEfficiencyAssets" :key="item.name" class="asset-row">
                <span class="ar-name">{{ item.name }}</span>
                <span class="ar-metric good">{{ item.metric }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="低效" name="low">
              <div v-for="item in lowEfficiencyAssets" :key="item.name" class="asset-row">
                <span class="ar-name">{{ item.name }}</span>
                <span class="ar-metric bad">{{ item.metric }}</span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.dash-toolbar {
  flex-shrink: 0;
}

.dash-tabs-inline {
  flex: 1;
  min-width: 0;
}

.dash-tabs-inline :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.dash-side {
  padding: 12px 14px;
}

.chart-body {
  width: 100%;
}

.chart-body :deep(.echarts) {
  width: 100% !important;
  height: 100% !important;
}

.chart-pie .chart-body {
  padding-right: 4px;
}

.suggest-item {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.suggest-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.suggest-item p {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
  line-height: 1.4;
}

.alert-item {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  font-size: 11px;
  padding: 5px 0;
  color: var(--text-secondary);
}

.alert-item.high { color: #ef4444; }
.alert-item.medium { color: #f59e0b; }

.asset-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  font-size: 11px;
  border-bottom: 1px solid var(--border);
}

.asset-row:last-child { border-bottom: none; }

.ar-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 6px;
}

.ar-metric.good { color: #22c55e; flex-shrink: 0; }
.ar-metric.bad { color: #ef4444; flex-shrink: 0; }
</style>
