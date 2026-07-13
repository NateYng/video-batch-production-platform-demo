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
    color: ['#635bff', '#8f88ff', '#b8b3ff', '#d5d2ff', '#8792a2'],
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

const configTab = ref('roles')
</script>

<template>
  <div class="page-shell system-config">
    <el-tabs v-model="configTab" class="compact-tabs config-tabs">
      <el-tab-pane label="角色权限" name="roles" />
      <el-tab-pane label="模型 API" name="model" />
      <el-tab-pane label="审核规则" name="audit" />
      <el-tab-pane label="发布渠道" name="channel" />
      <el-tab-pane label="操作日志" name="logs" />
      <el-tab-pane label="成本控制" name="cost" />
    </el-tabs>

    <div class="config-tab-panel page-card fill-card">
      <div v-show="configTab === 'roles'" class="tab-content">
        <div class="section-title">
          <h3>自定义角色</h3>
          <el-button type="primary" size="small">新增角色</el-button>
        </div>
        <div class="table-flex">
          <el-table :data="roles" stripe size="small">
            <el-table-column prop="name" label="角色" width="100" />
            <el-table-column prop="desc" label="描述" min-width="160" show-overflow-tooltip />
            <el-table-column label="权限" width="70" align="right">
              <template #default="{ row }">{{ row.permissions }}</template>
            </el-table-column>
            <el-table-column prop="scope" label="数据范围" width="120" />
            <el-table-column label="成员" width="60" align="right">
              <template #default="{ row }">{{ row.members }}</template>
            </el-table-column>
            <el-table-column label="状态" width="70">
              <template #default="{ row }">
                <el-tag :type="row.status === 'enabled' ? 'success' : 'info'" size="small">{{ row.status === 'enabled' ? '启用' : '停用' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div v-show="configTab === 'model'" class="tab-content model-tab">
        <div class="model-layout">
          <el-form label-width="80px" size="small" class="model-form">
            <el-form-item label="供应商">
              <el-select v-model="modelConfig.provider" style="width: 100%">
                <el-option label="阿里云通义千问" value="阿里云通义千问" />
                <el-option label="OpenAI" value="OpenAI" />
              </el-select>
            </el-form-item>
            <el-form-item label="API Key">
              <el-input v-model="modelConfig.apiKey" show-password />
            </el-form-item>
            <el-form-item label="模型">
              <el-select v-model="modelConfig.model" style="width: 100%">
                <el-option label="通义千问-Max" value="通义千问-Max" />
              </el-select>
            </el-form-item>
            <el-form-item label="场景">
              <el-checkbox-group v-model="modelConfig.scenarios">
                <el-checkbox v-for="s in scenarioOptions.slice(0, 4)" :key="s" :value="s" :label="s" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="testConnection">测试连接</el-button>
            </el-form-item>
          </el-form>
          <aside class="connection-sidebar">
            <h4>连接状态</h4>
            <div class="conn-status" :class="{ ok: modelConfig.connected }">
              <el-icon :size="22"><CircleCheckFilled v-if="modelConfig.connected" /><CircleCloseFilled v-else /></el-icon>
              <span>{{ modelConfig.connected ? '连接正常' : '连接异常' }}</span>
            </div>
            <ul class="conn-meta">
              <li>延迟 <strong>128ms</strong></li>
              <li>今日调用 <strong>12,860</strong></li>
              <li>成功率 <strong>99.6%</strong></li>
            </ul>
          </aside>
        </div>
      </div>

      <div v-show="configTab === 'audit'" class="tab-content">
        <div class="section-title">
          <h3>审核规则配置</h3>
          <el-button type="primary" size="small" @click="saveAuditRules">保存</el-button>
        </div>
        <div class="rules-grid">
          <div class="rule-item">
            <div class="rule-info">
              <div class="rule-name">高风险必审</div>
              <div class="rule-desc">100% 人工审核</div>
            </div>
            <el-switch v-model="auditRules.highRiskRequired" />
          </div>
          <div class="rule-item">
            <div class="rule-info">
              <div class="rule-name">中风险抽检 {{ auditRules.mediumRiskPercent }}%</div>
              <div class="rule-desc">按比例抽检</div>
            </div>
            <div class="rule-controls">
              <el-switch v-model="auditRules.mediumRiskSample" />
              <el-slider v-model="auditRules.mediumRiskPercent" :min="5" :max="50" :step="5" style="width: 100px" />
            </div>
          </div>
          <div class="rule-item">
            <div class="rule-info">
              <div class="rule-name">官网新闻必审</div>
              <div class="rule-desc">新闻类 100% 必审</div>
            </div>
            <el-switch v-model="auditRules.officialNewsRequired" />
          </div>
          <div class="rule-item">
            <div class="rule-info">
              <div class="rule-name">AI 质检阈值</div>
              <div class="rule-desc">低于阈值进人工队列</div>
            </div>
            <div class="rule-controls">
              <el-slider v-model="auditRules.aiThreshold" :min="50" :max="95" style="width: 140px" />
              <span class="threshold-val">{{ auditRules.aiThreshold }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-show="configTab === 'channel'" class="tab-content">
        <div class="section-title">
          <h3>发布渠道配置</h3>
          <el-button type="primary" size="small">新增渠道</el-button>
        </div>
        <div class="table-flex">
          <el-table :data="systemChannels" stripe size="small">
            <el-table-column prop="channel" label="渠道" width="80" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="account" label="账号" min-width="130" />
            <el-table-column label="状态" width="70">
              <template #default="{ row }">
                <el-tag type="success" size="small">{{ row.status === 'normal' ? '正常' : row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="scope" label="权限" width="120" />
            <el-table-column prop="token" label="Token" width="120" show-overflow-tooltip />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">编辑</el-button>
                <el-button link size="small">测试</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div v-show="configTab === 'logs'" class="tab-content">
        <div class="section-title">
          <h3>操作日志</h3>
          <div class="alarm-stats">
            <el-tag v-for="a in alarmStats" :key="a.label" :type="a.type" effect="plain" size="small">{{ a.label }} {{ a.value }}</el-tag>
          </div>
        </div>
        <div class="table-flex">
          <el-table :data="operationLogs" stripe size="small">
            <el-table-column prop="time" label="时间" width="140" />
            <el-table-column prop="operator" label="操作人" width="80" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="target" label="对象" min-width="140" show-overflow-tooltip />
            <el-table-column label="结果" width="70">
              <template #default="{ row }">
                <el-tag :type="logResultType(row.result)" size="small">{{ row.result }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="IP" width="120" />
          </el-table>
        </div>
      </div>

      <div v-show="configTab === 'cost'" class="tab-content cost-tab">
        <div class="section-title">
          <h3>成本控制</h3>
          <el-button type="primary" size="small" @click="saveBudget">保存预算</el-button>
        </div>
        <div class="cost-layout">
          <div class="cost-cards">
            <div class="cost-card-item">
              <div class="cc-label">今日成本</div>
              <div class="cc-value">¥{{ costSummary.today.toLocaleString() }}</div>
              <div class="cc-trend down">↓ {{ Math.abs(costSummary.todayTrend) }}%</div>
            </div>
            <div class="cost-card-item">
              <div class="cc-label">本月成本</div>
              <div class="cc-value">¥{{ costSummary.month.toLocaleString() }}</div>
              <div class="cc-sub">使用 {{ costSummary.usagePercent }}%</div>
            </div>
            <div class="cost-card-item">
              <div class="cc-label">剩余预算</div>
              <div class="cc-value">¥{{ costSummary.remaining.toLocaleString() }}</div>
            </div>
          </div>
          <div class="cost-chart">
            <h4>成本占比</h4>
            <VChart :option="costDonutOption" style="height: 140px" autoresize />
          </div>
          <div class="budget-limits">
            <h4>预算控制</h4>
            <el-form label-width="110px" size="small">
              <el-form-item label="单日上限">
                <el-input-number v-model="budgetLimits.dailyLimit" :min="1000" :step="1000" size="small" />
              </el-form-item>
              <el-form-item label="单任务上限">
                <el-input-number v-model="budgetLimits.taskLimit" :min="500" :step="500" size="small" />
              </el-form-item>
              <el-form-item label="预警阈值">
                <el-slider v-model="budgetLimits.warningThreshold" :min="50" :max="95" style="width: 140px" />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-tabs {
  flex-shrink: 0;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-title h3 {
  font-size: 13px;
  font-weight: 600;
}

.model-layout {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 12px;
}

.model-form {
  max-width: 480px;
}

.connection-sidebar {
  padding: 10px;
  background: rgba(148, 155, 175, 0.05);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.connection-sidebar h4 {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.conn-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  background: rgba(192, 18, 60, 0.06);
  color: var(--danger);
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 500;
}

.conn-status.ok {
  background: rgba(33, 122, 75, 0.07);
  color: var(--success);
}

.conn-meta {
  list-style: none;
  font-size: 11px;
  color: var(--text-secondary);
}

.conn-meta li {
  padding: 3px 0;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.rule-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: var(--bg-fill);
  border-radius: 6px;
  border: 1px solid var(--border);
}

.rule-name {
  font-size: 12px;
  font-weight: 500;
}

.rule-desc {
  font-size: 10px;
  color: var(--text-secondary);
}

.rule-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.threshold-val {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
}

.alarm-stats {
  display: flex;
  gap: 6px;
}

.cost-layout {
  display: grid;
  grid-template-columns: 1fr 220px 240px;
  gap: 12px;
}

.cost-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cost-card-item {
  padding: 10px;
  background: var(--bg-fill);
  border-radius: 6px;
  border: 1px solid var(--border);
}

.cc-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.cc-value {
  font-size: 18px;
  font-weight: 700;
  margin: 2px 0;
}

.cc-trend.down { color: var(--success); font-size: 11px; }
.cc-sub { font-size: 11px; color: var(--text-secondary); }

.cost-chart h4,
.budget-limits h4 {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}
</style>
