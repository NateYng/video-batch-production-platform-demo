// Mock data aligned with prototype screenshots

export const overviewMetrics = {
  todayGenerated: 8420,
  todayGeneratedTrend: 18.6,
  pendingAudit: 316,
  pendingAuditTrend: 7.2,
  publishSuccessRate: 96.8,
  publishSuccessRateTrend: 2.1,
  failedRetry: 214,
  failedRetryTrend: -3.4,
  totalGenerated: 1246280,
  totalCount: 1246280,
  totalCompute: 2842650,
  estimatedCost: 28426.5,
  concurrentTasks: 85,
  avgDuration: '2m 18s',
}

export const channelEffects = [
  { name: '抖音', published: 186, views: '256.8w', successRate: 96.2 },
  { name: '视频号', published: 142, views: '128.6w', successRate: 97.1 },
  { name: '官网', published: 28, views: '32.4w', successRate: 100 },
]

export const riskQueue = [
  { id: 'VID-20250520-0001', title: '科技新品宣传 | 智能未来', risk: '敏感词', riskLevel: 'high', time: '2025-05-20 14:30' },
  { id: 'VID-20250520-0002', title: '企业新闻播报 | 季度财报', risk: '涉黄风险', riskLevel: 'high', time: '2025-05-20 13:15' },
  { id: 'VID-20250520-0003', title: '科普短视频 | 航天探索', risk: '形象风险', riskLevel: 'medium', time: '2025-05-20 12:00' },
]

export const dashboardTasks = [
  { id: 'TASK-202507-0018', name: '7月科普短视频批产', type: '批量任务', count: 10000, progress: 68, status: 'running', risk: 'high', priority: '高', startTime: '2025-07-08 09:00', cost: 1254.6 },
  { id: 'TASK-202507-0015', name: '企业新闻播报_0520', type: '模板创作', count: 5000, progress: 100, status: 'completed', risk: 'medium', priority: '中', startTime: '2025-07-07 14:00', cost: 892.3 },
  { id: 'TASK-202507-0012', name: '品牌宣传片Q3', type: '智能体编排', count: 3000, progress: 45, status: 'partial_fail', risk: 'high', priority: '高', startTime: '2025-07-06 10:30', cost: 2100.8 },
  { id: 'TASK-202507-0010', name: '数字人讲解系列', type: '批量任务', count: 2000, progress: 0, status: 'cancelled', risk: 'low', priority: '低', startTime: '2025-07-05 16:00', cost: 0 },
]

export const batchTasks = [
  { id: 'TASK-202507-0018', name: '7月科普短视频批产', videoType: '科普视频', total: 10000, completionRate: 68, risk: 'high', cost: 1254.6, status: 'running' },
  { id: 'TASK-202507-0015', name: '企业新闻播报_0520', videoType: '企业新闻播报', total: 8000, completionRate: 100, risk: 'medium', cost: 892.3, status: 'completed' },
  { id: 'TASK-202507-0012', name: '品牌宣传片Q3', videoType: '宣传片', total: 3000, completionRate: 45, risk: 'high', cost: 2100.8, status: 'partial_fail' },
  { id: 'TASK-202507-0011', name: '数字人讲解系列', videoType: '数字人讲解', total: 2000, completionRate: 0, risk: 'low', cost: 0, status: 'queued' },
  { id: 'TASK-202507-0010', name: '宣传视频春季活动', videoType: '宣传视频', total: 5000, completionRate: 82, risk: 'medium', cost: 1560.2, status: 'running' },
]

export const taskDetail = {
  id: 'TASK-202507-0018',
  name: '7月科普短视频批产',
  status: 'running',
  creator: '张晓明',
  createdAt: '2025-07-08 08:30',
  startedAt: '2025-07-08 09:00',
  total: 10000,
  completed: 7280,
  failed: 214,
  pendingAudit: 526,
  pendingPublish: 1980,
  remaining: '1小时42分',
  progress: 72.8,
  elapsed: '3h 18m',
  estimated: '4h 50m',
  stages: [
    { name: '队列等待', status: 'done', time: '09:00', duration: '5m' },
    { name: '脚本生成', status: 'done', time: '09:05', duration: '28m' },
    { name: '视频合成', status: 'done', time: '09:33', duration: '1h 45m' },
    { name: '机器质检', status: 'done', time: '11:18', duration: '42m' },
    { name: '人工审核', status: 'active', time: '12:00', duration: '进行中' },
    { name: '发布打包', status: 'pending', time: '-', duration: '-' },
  ],
  batches: [
    { id: 'Batch-001', status: 'completed', count: 2000, progress: 100, duration: '45m', failed: 0, reason: '-' },
    { id: 'Batch-002', status: 'completed', count: 2000, progress: 100, duration: '48m', failed: 12, reason: '视频合成失败' },
    { id: 'Batch-003', status: 'running', count: 2000, progress: 65, duration: '32m', failed: 86, reason: '素材加载失败' },
    { id: 'Batch-004', status: 'pending_audit', count: 2000, progress: 100, duration: '50m', failed: 0, reason: '-' },
    { id: 'Batch-005', status: 'pending_publish', count: 2000, progress: 100, duration: '46m', failed: 0, reason: '-' },
  ],
  failureReasons: [
    { name: '视频合成失败', value: 86, percent: 40.2 },
    { name: '素材加载失败', value: 64, percent: 29.9 },
    { name: '音频合成失败', value: 32, percent: 15.0 },
    { name: '字幕生成失败', value: 18, percent: 8.4 },
    { name: '其他', value: 14, percent: 6.5 },
  ],
  costs: [
    { name: '视频合成', value: 2156.8 },
    { name: '数字人播报', value: 1280.5 },
    { name: '语音合成', value: 856.2 },
    { name: '素材处理', value: 527.0 },
  ],
  totalCost: 4820.36,
  concurrency: { avg: 128, peak: 256, current: 142, utilization: 68 },
}

export const templates = [
  { id: 'TPL-001', name: '企业新闻播报模板 v3', type: '企业新闻播报', status: 'published', badge: '已发布', tags: ['企业新闻', '正式'], uses: 1286, completion: 78.5, updated: '2025-05-18', duration: '45-60秒', resolution: '1080*1920' },
  { id: 'TPL-002', name: '数字人讲解', type: '数字人讲解', status: 'published', badge: '高复用', tags: ['数字人', '讲解'], uses: 2456, completion: 82.3, updated: '2025-05-17', duration: '45-60秒', resolution: '1080*1920' },
  { id: 'TPL-003', name: '科普短视频标准版', type: '科普视频', status: 'published', badge: '已发布', tags: ['科普', '教育'], uses: 892, completion: 71.2, updated: '2025-05-16', duration: '30-45秒', resolution: '1080*1920' },
  { id: 'TPL-004', name: '品牌宣传片模板', type: '宣传片', status: 'draft', badge: '草稿', tags: ['品牌', '宣传'], uses: 0, completion: 0, updated: '2025-05-15', duration: '60-90秒', resolution: '1920*1080' },
  { id: 'TPL-005', name: '营销活动宣传', type: '宣传视频', status: 'optimize', badge: '待优化', tags: ['营销', '活动'], uses: 456, completion: 65.8, updated: '2025-05-14', duration: '15-30秒', resolution: '1080*1920' },
]

export const templateRecords = [
  { taskId: 'TASK-202507-0015', template: '企业新闻播报模板 v3', count: 5000, success: 4986, completion: 78.5, trend: 2.3, channels: ['抖音', '视频号'], status: 'completed', time: '2025-07-07 18:30' },
  { taskId: 'TASK-202507-0012', template: '数字人讲解', count: 3000, success: 2856, completion: 82.3, trend: -1.2, channels: ['抖音'], status: 'partial_fail', time: '2025-07-06 22:15' },
]

export const videos = [
  { id: 'VID-20250520-0001', title: '科技新品宣传 | 智能未来', template: '企业新闻播报', risk: 'high', auditStatus: 'pending', publishStatus: 'pending', duration: '1:28', version: 'v2', time: '2025-05-20 14:30', batch: 'Batch-003' },
  { id: 'VID-20250520-0002', title: '科普短视频 | 航天探索奥秘', template: '科普短视频标准版', risk: 'medium', auditStatus: 'auditing', publishStatus: 'pending', duration: '0:45', version: 'v1', time: '2025-05-20 13:15', batch: 'Batch-003' },
  { id: 'VID-20250520-0003', title: '数字人讲解 | AI技术前沿', template: '数字人讲解', risk: 'low', auditStatus: 'passed', publishStatus: 'published', duration: '1:05', version: 'v3', time: '2025-05-20 12:00', batch: 'Batch-002' },
  { id: 'VID-20250520-0004', title: '品牌宣传片 | 季度回顾', template: '品牌宣传片模板', risk: 'high', auditStatus: 'rejected', publishStatus: 'failed', duration: '2:10', version: 'v1', time: '2025-05-20 11:30', batch: 'Batch-001' },
  { id: 'VID-20250520-0005', title: '营销活动 | 夏季促销', template: '营销活动宣传', risk: 'low', auditStatus: 'passed', publishStatus: 'published', duration: '0:30', version: 'v2', time: '2025-05-20 10:45', batch: 'Batch-001' },
]

export const auditItems = [
  { id: 'VID-20250520-0001', title: '科技新品宣传 0507', type: '宣传片', risks: ['画面文字违规'], score: 62, rules: ['R-01 违禁词检测', 'R-08 夸大宣传'], suggest: '打回修改', auditor: '张晓明', deadline: '超时2小时', riskLevel: 'high' },
  { id: 'VID-20250520-0002', title: '企业新闻播报 0506', type: '企业新闻', risks: ['营销夸大风险'], score: 65, rules: ['R-08 夸大宣传'], suggest: '修改后重提', auditor: '系统', deadline: '剩余4小时', riskLevel: 'high' },
  { id: 'VID-20250520-0003', title: '科普短视频 0505', type: '科普视频', risks: ['医疗功效展示'], score: 78, rules: ['R-03 医疗功效'], suggest: '可修改通过', auditor: '李审核', deadline: '剩余6小时', riskLevel: 'medium' },
  { id: 'VID-20250520-0004', title: '品牌宣传 0504', type: '宣传片', risks: ['背景音乐版权'], score: 82, rules: ['R-07 版权检测'], suggest: '通过', auditor: '系统', deadline: '剩余8小时', riskLevel: 'medium' },
  { id: 'VID-20250520-0005', title: '数字人讲解 0503', type: '数字人讲解', risks: ['字幕错别字'], score: 90, rules: ['R-12 字幕纠错'], suggest: '通过', auditor: '系统', deadline: '剩余12小时', riskLevel: 'low' },
]

export const auditRules = [
  { name: '官网新闻必审', scope: '官网 · 新闻播报', rule: '100% 必审', time: '2025-01-01 起' },
  { name: '抖音科普抽检20%', scope: '抖音 · 科普', rule: '抽检 20%', time: '2025-03-01 起' },
  { name: '品牌宣传片必审', scope: '抖音 · 视频号 · 官网', rule: '100% 必审', time: '2025-01-01 起' },
]

export const publishChannels = [
  { channel: '抖音', account: '抖音矩阵号A', pending: 2400, successRate: 96.2, status: 'queuing', failReason: '', nextTime: '14:00' },
  { channel: '抖音', account: '抖音矩阵号B', pending: 1200, successRate: 95.8, status: 'publishing', failReason: '', nextTime: '进行中' },
  { channel: '视频号', account: '视频号品牌主号', pending: 1860, successRate: 97.1, status: 'ready', failReason: '', nextTime: '18:00' },
  { channel: '官网', account: '官网发布栏目', pending: 120, successRate: 100, status: 'partial_fail', failReason: '内容违规 12条', nextTime: '10:00' },
]

export const publishSchedule = [
  { channel: '抖音', time: '10:00', title: '科普知识系列 第23期', count: 200, status: 'ready' },
  { channel: '抖音', time: '14:00', title: '科技新品宣传合集', count: 150, status: 'queuing' },
  { channel: '视频号', time: '18:00', title: '企业新闻周报', count: 86, status: 'ready' },
  { channel: '官网', time: '10:00', title: '季度财报解读', count: 28, status: 'ready' },
]

export const assets = [
  { id: 'AST-20250520-0001', name: '企业Logo标准版', type: '品牌资产', tags: ['LOGO', '品牌'], copyright: '自有版权', audit: 'passed', refs: 1248, updated: '2025-05-20' },
  { id: 'AST-20250520-0002', name: '自然风光素材包', type: '媒体素材', tags: ['自然风光', 'B-roll'], copyright: '商用授权', audit: 'passed', refs: 856, updated: '2025-05-19' },
  { id: 'AST-20250520-0003', name: '数字人-小妍', type: '数字人资产', tags: ['数字人', '口型同步'], copyright: '平台授权', audit: 'passed', refs: 2345, updated: '2025-05-18' },
  { id: 'AST-20250520-0004', name: '产品技术白皮书', type: '知识库', tags: ['产品', '技术'], copyright: '自有版权', audit: 'pending', refs: 428, updated: '2025-05-17' },
  { id: 'AST-20250520-0005', name: '抖音矩阵号A授权', type: '账号与渠道', tags: ['抖音', '渠道'], copyright: '平台授权', audit: 'passed', refs: 186, updated: '2025-05-16' },
]

export const assetRankings = {
  hotAssets: [
    { name: '企业片头动画', refs: 1248 },
    { name: '科技背景视频', refs: 986 },
    { name: '品牌Logo动效', refs: 756 },
  ],
  topTemplates: [
    { name: '数字人讲解', refs: 2456 },
    { name: '企业新闻播报', refs: 1286 },
    { name: '科普短视频', refs: 892 },
  ],
  topDigitalHumans: [
    { name: '小妍', refs: 2345 },
    { name: '瑞哥', refs: 1856 },
    { name: '晓智', refs: 1234 },
  ],
}

export const roles = [
  { name: '超级管理员', desc: '拥有所有系统权限', permissions: 128, scope: '全部数据', members: 3, status: 'enabled' },
  { name: '市场运营', desc: '内容生产与发布管理', permissions: 86, scope: '本部门及以下', members: 12, status: 'enabled' },
  { name: '短视频团队', desc: '脚本/模板/视频制作', permissions: 64, scope: '本部门', members: 28, status: 'enabled' },
  { name: '内容审核员', desc: '视频审核与质检', permissions: 38, scope: '本部门及以下', members: 18, status: 'enabled' },
  { name: '数据分析师', desc: '数据看板与报表', permissions: 24, scope: '本部门', members: 6, status: 'enabled' },
]

export const systemChannels = [
  { channel: '抖音', type: '短视频', account: '抖音矩阵号A', status: 'normal', scope: '发布 · 数据读取', token: '有效 · 剩余28天' },
  { channel: '视频号', type: '官方平台', account: '视频号品牌主号', status: 'normal', scope: '发布 · 数据读取', token: '有效 · 剩余15天' },
  { channel: '官网', type: '自有平台', account: '官网发布栏目', status: 'normal', scope: '发布', token: '有效 · 剩余60天' },
]

export const operationLogs = [
  { time: '2025-05-20 14:35:21', operator: '张晓明', type: '创建批量任务', target: 'TASK-202507-0018', result: '成功', ip: '192.168.1.100' },
  { time: '2025-05-20 14:30:15', operator: '李审核', type: '审核通过', target: 'VID-20250520-0005', result: '成功', ip: '192.168.1.101' },
  { time: '2025-05-20 14:25:08', operator: '系统', type: '机器质检', target: 'Batch-003', result: '成功', ip: '-' },
  { time: '2025-05-20 14:20:00', operator: '王运营', type: '导出成本报表', target: '成本中心', result: '成功', ip: '192.168.1.102' },
  { time: '2025-05-20 14:15:33', operator: '张晓明', type: '回退审核', target: 'VID-20250520-0004', result: '失败', ip: '192.168.1.100' },
]

export const videoTypes = ['宣传片', '宣传视频', '科普视频', '数字人讲解', '企业新闻播报']

export const digitalHumans = [
  { id: 'dh1', name: '小妍（知性女声）', style: '正式沉稳' },
  { id: 'dh2', name: '瑞哥（科技男声）', style: '活力科技' },
  { id: 'dh3', name: '晓智（亲和女声）', style: '温暖亲切' },
]
