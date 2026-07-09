# 视频批量生产平台 · 可交互前端 Demo

基于 PRD 与高保真原型（12 张 FullPage 设计图）构建的企业级视频批量生产中台演示。

## 在线访问

部署后访问：**https://nateyng.github.io/video-batch-production-platform-demo/**

## 技术栈

- Vue 3 + Vite
- Element Plus
- Vue Router (hash)
- Pinia
- ECharts / vue-echarts
- Vue Flow（智能体编排画布）

## 页面清单（12 页）

| 路由 | 页面 | 主题 |
| --- | --- | --- |
| `/dashboard` | 工作台首页 | 浅色 |
| `/batch-tasks` | 批量任务中心 | 浅色 |
| `/create-task` | 创建批量任务（5 步向导） | 浅色 |
| `/templates` | 模板创作台 | 浅色 |
| `/agent-flow` | 智能体编排画布 | 浅色 |
| `/task/:id` | 任务详情 | 浅色 |
| `/videos` | 视频结果列表 | 深色 |
| `/audit` | 质检与审核台 | 深色 |
| `/publish` | 发布中心 | 浅色 |
| `/assets` | 资产中心 | 深色 |
| `/data` | 数据看板 | 浅色 |
| `/settings` | 系统配置 | 浅色 |

## 本地启动

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 交互说明

- 所有数据为前端 mock，操作即时生效（任务暂停/重试、审核通过/驳回、一键发布等）
- 创建任务提交后写入任务列表并跳转批量任务中心
- 视频结果批量提交审核会同步到审核中心
- 智能体编排支持节点拖拽、连线、运行流程模拟

## 上游文档

- PRD：`../PRD/视频批量生产平台-PRD规格说明书（完整版）.md`
- 设计参考：`../ProductDesignReferences/FullPage_00~11_*.png`
