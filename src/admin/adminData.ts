/**
 * 小雪宝管理后台 - 本地静态展示数据。
 * 用户、历史记录和管理员统计由服务端 API 提供。
 */

/* ====== 技能数据 ====== */
export interface Skill {
  id: string
  name: string
  description: string
  version: string
  status: 'active' | 'inactive'
  installed: boolean
  category: '医学' | '心理' | '生活' | '工具' | '护理'
}

export const skills: Skill[] = [
  { id: 's001', name: '化疗饮食指导', description: '针对化疗不同阶段的饮食建议，包括食谱推荐和禁忌提醒', version: 'v2.1.0', status: 'active', installed: true, category: '医学' },
  { id: 's002', name: '发热应急问答', description: '根据体温、症状和治疗阶段提供分级发热处理建议', version: 'v1.8.3', status: 'active', installed: true, category: '医学' },
  { id: 's003', name: '儿童心理安抚', description: '用孩子能理解的语言解释治疗过程，提供情绪支持策略', version: 'v1.5.0', status: 'active', installed: true, category: '心理' },
  { id: 's004', name: '用药提醒助手', description: '设置药品名称、时间和剂量提醒，跟踪服药记录', version: 'v0.9.0', status: 'inactive', installed: true, category: '工具' },
  { id: 's005', name: 'PICC管护理指导', description: '提供PICC管日常护理、异常处理和封管操作指导', version: 'v2.0.1', status: 'active', installed: true, category: '护理' },
  { id: 's006', name: '医保政策查询', description: '查询各省市儿童白血病医保报销政策和救助项目', version: 'v1.2.0', status: 'active', installed: true, category: '生活' },
  { id: 's007', name: '化疗方案解读', description: '用通俗语言解释化疗方案中的药物、剂量和周期', version: 'v1.0.0', status: 'inactive', installed: false, category: '医学' },
  { id: 's008', name: '志愿者匹配', description: '根据家庭需求和地理位置匹配适合的志愿者', version: 'v0.5.0', status: 'inactive', installed: false, category: '生活' },
]

/* ====== 知识库条目 ====== */
export interface KnowledgeItem {
  id: string
  name: string
  source: string
  status: '已审核' | '待审核' | '需更新'
  items: number
  lastUpdated: string
}

export const knowledgeBase: KnowledgeItem[] = [
  { id: 'k001', name: '儿童ALL诊疗指南', source: 'COG / CSCO 2025-2026', status: '已审核', items: 1240, lastUpdated: '2026-05-15' },
  { id: 'k002', name: '化疗药物手册', source: '国家药品监督管理局', status: '已审核', items: 356, lastUpdated: '2026-04-20' },
  { id: 'k003', name: '儿童营养食谱库', source: '中国营养学会', status: '已审核', items: 480, lastUpdated: '2026-03-10' },
  { id: 'k004', name: '心理干预案例集', source: '合作医院心理科', status: '待审核', items: 89, lastUpdated: '2026-06-01' },
  { id: 'k005', name: '护理操作规范', source: '中华护理学会', status: '需更新', items: 215, lastUpdated: '2025-12-08' },
]

/* ====== 系统监控数据 ====== */
export const apiCalls24h = [
  { hour: '00:00', calls: 12 }, { hour: '02:00', calls: 5 }, { hour: '04:00', calls: 3 },
  { hour: '06:00', calls: 18 }, { hour: '08:00', calls: 45 }, { hour: '10:00', calls: 67 },
  { hour: '12:00', calls: 52 }, { hour: '14:00', calls: 73 }, { hour: '16:00', calls: 58 },
  { hour: '18:00', calls: 41 }, { hour: '20:00', calls: 35 }, { hour: '22:00', calls: 22 },
]

export const modelUsage = [
  { name: 'qwen-plus', value: 45, color: '#5BA4D9' },
  { name: 'qwen-turbo', value: 35, color: '#E8943A' },
  { name: 'qwen3-vl-flash', value: 20, color: '#48BB78' },
]

export interface ErrorLog {
  id: string
  time: string
  type: 'warn' | 'error' | 'info'
  message: string
}

export const errorLogs: ErrorLog[] = [
  { id: 'e001', time: '2026-06-11 01:20', type: 'info', message: 'Web Gateway 已连接 Hermes 本机 API' },
  { id: 'e002', time: '2026-06-11 01:18', type: 'info', message: '阿里云百炼文本与视觉模型池已启用自动路由' },
  { id: 'e003', time: '2026-06-11 01:15', type: 'warn', message: 'HTTPS 尚未启用，当前按计划仅开放 HTTP 80' },
]

export const systemHealth = {
  status: 'healthy' as const,
  uptime: '15天 8小时',
  cpu: 42,
  memory: 68,
  disk: 35,
  apiLatency: '1.2s',
  totalApiCallsToday: 462,
}
