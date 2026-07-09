<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { roles, systemChannels, operationLogs } from '@/mock'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const auditRules = ref({
  highRiskRequired: true,
  mediumRiskSample: true,
  mediumRiskPercent: 20,
  officialNewsRequired: true,
  brandPromoRequired: true,
  aiThreshold: 70,
})

const modelConfig = ref({
  provider: '阿里云通义千问',
  apiKey: 'sk-********',
  model: '通义千问-Max',
  scenarios: ['脚本生成', '标题优化', '字幕纠错', '风险检测'],
  connected: true,
})

const scenarioOptions = ['脚本生成', '标题优化', '字幕纠错', '风险检测', '配音文案', '标签匹配']

const alarmStats = [
  { label: '今日告警', value: 3, type: 'warning' },
  { label: '未处理', value: 1, type: 'danger' },
  { label: '已恢复', value: 12, type: 'success' },
]

const costSummary = {
  today: 4820.36,
  todayTrend: -12.6,
  month: 86230.12,
  budget: 150000,
  remaining: 63769.88,
  usagePercent: 57.4,
}

const budgetLimits = ref({
  dailyLimit: 10000,
  taskLimit: 5000,
  warningThreshold: 80,
})

const costBreakdown = [
  { name: '视频生成', value: 52.3 },
  { name: '智能配音', value: 18.6 },
  { name: '数字人', value: 14.2 },
  { name: '合规检测', value: 9.8 },
  { name: '其他', value: 5.1 },
]

const costDonutOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['50%', '50%'],
    data: costBreakdown,
    label: { show: false },
    color: ['#0ea5e9', '#22c55e', '#8b5cf6', '#f59e0b', '#64748b'],
  }],
}))

const logResultType = (result) => (result === '成功' ? 'success' : 'danger')

function testConnection() {
  ElMessage.success('模型 API 连接测试成功')
}

function saveAuditRules() {
  ElMessage.success('审核规则已保存')
}

function saveBudget() {
  ElMessage.success('预算控制配置已保存')
}
</script>

<template>
  <div class="system-config">
    <div class="page-header">
      <div>
        <h1>系统配置</h1>
        <p>角色权限、模型 API、审核规则、发布渠道与成本控制</p>
      </div>
    </div>

    <div class="config-sections">
      <!-- 自定义角色 -->
      <section class="page-card config-section">
        <div class="section-title">
          <h3>自定义角色</h3>
          <el-button type="primary" size="small">新增角色</el-button>
        </div>
        <el-table :data="roles" stripe>
          <el-table-column prop="name" label="角色名称" width="120" />
          <el-table-column prop="desc" label="描述" min-width="180" />
          <el-table-column label="权限点" width="90" align="right">
            <template #default="{ row }">{{ row.permissions }}</template>
          </el-table-column>
          <el-table-column prop="scope" label="数据范围" width="130" />
          <el-table-column label="成员" width="80" align="right">
            <template #default="{ row }">{{ row.members }}</template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.status === 'enabled' ? 'success' : 'info'" size="small">
                {{ row.status === 'enabled' ? '启用' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default>
              <el-button link type="primary" size="small">编辑</el-button>
              <el-button link size="small">权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <!-- 模型 API 配置 -->
      <section class="page-card config-section model-section">
        <div class="section-title">
          <h3>模型 API 配置</h3>
        </div>
        <div class="model-layout">
          <el-form label-width="100px" class="model-form">
            <el-form-item label="供应商">
              <el-select v-model="modelConfig.provider" style="width: 100%">
                <el-option label="阿里云通义千问" value="阿里云通义千问" />
                <el-option label="OpenAI" value="OpenAI" />
                <el-option label="百度文心" value="百度文心" />
              </el-select>
            </el-form-item>
            <el-form-item label="API Key">
              <el-input v-model="modelConfig.apiKey" show-password />
            </el-form-item>
            <el-form-item label="模型">
              <el-select v-model="modelConfig.model" style="width: 100%">
                <el-option label="通义千问-Max" value="通义千问-Max" />
                <el-option label="通义千问-Plus" value="通义千问-Plus" />
              </el-select>
            </el-form-item>
            <el-form-item label="使用场景">
              <el-checkbox-group v-model="modelConfig.scenarios">
                <el-checkbox v-for="s in scenarioOptions" :key="s" :value="s" :label="s" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="testConnection">测试连接</el-button>
              <el-button>保存配置</el-button>
            </el-form-item>
          </el-form>
          <aside class="connection-sidebar page-card">
            <h4>连接状态</h4>
            <div class="conn-status" :class="{ ok: modelConfig.connected }">
              <el-icon :size="28"><CircleCheckFilled v-if="modelConfig.connected" /><CircleCloseFilled v-else /></el-icon>
              <span>{{ modelConfig.connected ? '连接正常' : '连接异常' }}</span>
            </div>
            <ul class="conn-meta">
              <li>延迟 <strong>128ms</strong></li>
              <li>今日调用 <strong>12,860</strong> 次</li>
              <li>成功率 <strong>99.6%</strong></li>
              <li>最近测试 <strong>2 分钟前</strong></li>
            </ul>
          </aside>
        </div>
      </section>

      <!-- 审核规则 -->
      <section class="page-card config-section">
        <div class="section-title">
          <h3>审核规则配置</h3>
          <el-button type="primary" size="small" @click="saveAuditRules">保存规则</el-button>
        </div>
        <div class="rules-grid">
          <div class="rule-item">
            <div class="rule-info">
              <div class="rule-name">高风险必审</div>
              <div class="rule-desc">高风险视频 100% 进入人工审核</div>
            </div>
            <el-switch v-model="auditRules.highRiskRequired" />
          </div>
          <div class="rule-item">
            <div class="rule-info">
              <div class="rule-name">中风险抽检 {{ auditRules.mediumRiskPercent }}%</div>
              <div class="rule-desc">中风险视频按比例抽检</div>
            </div>
            <div class="rule-controls">
              <el-switch v-model="auditRules.mediumRiskSample" />
              <el-slider v-model="auditRules.mediumRiskPercent" :min="5" :max="50" :step="5" style="width: 120px" />
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-info">
              <div class="rule-name">官网新闻必审</div>
              <div class="rule-desc">官网新闻播报类内容 100% 必审</div>
            </div>
            <el-switch v-model="auditRules.officialNewsRequired" />
          </div>
          <div class="rule-item">
            <div class="rule-info">
              <div class="rule-name">品牌宣传必审</div>
              <div class="rule-desc">品牌宣传片类内容 100% 必审</div>
            </div>
            <el-switch v-model="auditRules.brandPromoRequired" />
          </div>
          <div class="rule-item full">
            <div class="rule-info">
              <div class="rule-name">AI 质检阈值</div>
              <div class="rule-desc">低于阈值自动进入人工审核队列</div>
            </div>
            <div class="rule-controls">
              <el-slider v-model="auditRules.aiThreshold" :min="50" :max="95" style="width: 200px" />
              <span class="threshold-val">{{ auditRules.aiThreshold }} 分</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 发布渠道 -->
      <section class="page-card config-section">
        <div class="section-title">
          <h3>发布渠道配置</h3>
          <el-button type="primary" size="small">新增渠道</el-button>
        </div>
        <el-table :data="systemChannels" stripe>
          <el-table-column prop="channel" label="渠道" width="90" />
          <el-table-column prop="type" label="渠道类型" width="110" />
          <el-table-column prop="account" label="账号名称" min-width="140" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag type="success" size="small">{{ row.status === 'normal' ? '正常' : row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="scope" label="权限范围" width="140" />
          <el-table-column prop="token" label="Token 状态" width="140" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default>
              <el-button link type="primary" size="small">编辑</el-button>
              <el-button link size="small">测试</el-button>
              <el-button link size="small">更多</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <!-- 操作日志与告警 -->
      <section class="page-card config-section logs-section">
        <div class="section-title">
          <h3>操作日志</h3>
          <div class="alarm-stats">
            <el-tag v-for="a in alarmStats" :key="a.label" :type="a.type" effect="plain" size="small">
              {{ a.label }} {{ a.value }}
            </el-tag>
          </div>
        </div>
        <el-table :data="operationLogs" stripe size="small">
          <el-table-column prop="time" label="时间" width="160" />
          <el-table-column prop="operator" label="操作人" width="90" />
          <el-table-column prop="type" label="操作类型" width="120" />
          <el-table-column prop="target" label="操作对象" min-width="160" />
          <el-table-column label="结果" width="80">
            <template #default="{ row }">
              <el-tag :type="logResultType(row.result)" size="small">{{ row.result }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP" width="130" />
        </el-table>
      </section>

      <!-- 成本控制 -->
      <section class="page-card config-section cost-section">
        <div class="section-title">
          <h3>成本控制</h3>
          <el-button type="primary" size="small" @click="saveBudget">保存预算</el-button>
        </div>
        <div class="cost-layout">
          <div class="cost-cards">
            <div class="cost-card">
              <div class="cc-label">今日成本</div>
              <div class="cc-value">¥{{ costSummary.today.toLocaleString() }}</div>
              <div class="cc-trend down">↓ {{ Math.abs(costSummary.todayTrend) }}%</div>
            </div>
            <div class="cost-card">
              <div class="cc-label">本月成本</div>
              <div class="cc-value">¥{{ costSummary.month.toLocaleString() }}</div>
              <div class="cc-sub">预算使用 {{ costSummary.usagePercent }}%</div>
            </div>
            <div class="cost-card">
              <div class="cc-label">本月预算</div>
              <div class="cc-value">¥{{ costSummary.budget.toLocaleString() }}</div>
              <div class="cc-sub">剩余 ¥{{ costSummary.remaining.toLocaleString() }}</div>
            </div>
          </div>
          <div class="cost-chart page-card inner">
            <h4>成本占比</h4>
            <VChart :option="costDonutOption" style="height: 180px" autoresize />
            <div class="breakdown-legend">
              <div v-for="item in costBreakdown" :key="item.name" class="bl-item">
                <span>{{ item.name }}</span>
                <span>{{ item.value }}%</span>
              </div>
            </div>
          </div>
          <div class="budget-limits">
            <h4>预算控制</h4>
            <el-form label-width="130px" size="small">
              <el-form-item label="单日预算上限">
                <el-input-number v-model="budgetLimits.dailyLimit" :min="1000" :step="1000" />
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item label="单任务预算上限">
                <el-input-number v-model="budgetLimits.taskLimit" :min="500" :step="500" />
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item label="预算预警阈值">
                <el-slider v-model="budgetLimits.warningThreshold" :min="50" :max="95" style="width: 160px" />
                <span class="unit">{{ budgetLimits.warningThreshold }}%</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.system-config {
  min-height: 100%;
  padding-bottom: 24px;
}

.config-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-section {
  padding: 16px 20px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title h3 {
  font-size: 15px;
  font-weight: 600;
}

.model-layout {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 16px;
}

.model-form {
  max-width: 560px;
}

.connection-sidebar {
  padding: 16px;
  align-self: start;
}

.connection-sidebar h4 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
}

.conn-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: #fef2f2;
  color: #ef4444;
  margin-bottom: 12px;
  font-weight: 500;
}

.conn-status.ok {
  background: #f0fdf4;
  color: #22c55e;
}

.conn-meta {
  list-style: none;
  font-size: 12px;
  color: var(--text-secondary);
}

.conn-meta li {
  padding: 4px 0;
}

.conn-meta strong {
  color: var(--text-primary);
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.rule-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.rule-item.full {
  grid-column: span 2;
}

.rule-name {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.rule-desc {
  font-size: 11px;
  color: var(--text-secondary);
}

.rule-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.threshold-val {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  min-width: 48px;
}

.alarm-stats {
  display: flex;
  gap: 8px;
}

.cost-layout {
  display: grid;
  grid-template-columns: 1fr 260px 280px;
  gap: 16px;
  align-items: start;
}

.cost-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cost-card {
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.cc-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.cc-value {
  font-size: 22px;
  font-weight: 700;
  margin: 4px 0;
}

.cc-trend {
  font-size: 12px;
}

.cc-trend.down {
  color: #22c55e;
}

.cc-sub {
  font-size: 12px;
  color: var(--text-secondary);
}

.cost-chart.inner {
  padding: 12px;
  box-shadow: none;
}

.cost-chart h4,
.budget-limits h4 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
}

.breakdown-legend {
  margin-top: 4px;
}

.bl-item {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-secondary);
  padding: 2px 0;
}

.budget-limits .unit {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

@media (max-width: 1200px) {
  .model-layout,
  .cost-layout,
  .rules-grid {
    grid-template-columns: 1fr;
  }

  .rule-item.full {
    grid-column: span 1;
  }
}
</style>
