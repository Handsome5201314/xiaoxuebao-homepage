/* --- Content data for the homepage ---
 * Replace values here to update the site
 * without touching component code.
 */

import {
  BookOpen,
  Handshake,
  ShieldCheck,
  Lock,
  HardDrives,
  GithubLogo,
} from '@phosphor-icons/react'
import type { IconProps } from '@phosphor-icons/react'
import type { ComponentType } from 'react'

type PhosphorIcon = ComponentType<IconProps>

export interface Capability {
  icon: PhosphorIcon
  title: string
  description: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  avatar?: string
}

export interface Acknowledgment {
  target: string
  message: string
}

export interface NavItem {
  label: string
  href: string
}

/* --- Navigation --- */
export const navItems: NavItem[] = [
  { label: '项目介绍', href: '#intro' },
  { label: '核心能力', href: '#capabilities' },
  { label: '技术架构', href: '#architecture' },
  { label: '团队', href: '#team' },
  { label: '致谢', href: '#acknowledgments' },
  { label: '开源', href: '#disclaimer' },
]

/* --- Hero --- */
export const heroContent = {
  title: '小雪宝',
  subtitle: '给儿童白血病家庭的一位温暖 AI 关爱伙伴',
  description:
    '小雪宝连接医学知识、家庭照护、儿童友好解释和医生审核流程，帮助家属在漫长治疗路上获得更安心的陪伴。',
  ctaPrimary: { label: '查看能力仓库', href: 'https://github.com/Handsome5201314/xiaoxuebao-ability-pack' },
  ctaSecondary: { label: '了解项目', href: '#intro' },
  ctaTertiary: { label: '联系团队', href: '#team' },
  mascotAlt: '小雪宝——一个蓝白相间的雪人吉祥物，戴着护士帽，胸前佩戴橙色关爱丝带',
}

/* --- Introduction --- */
export const introContent = {
  paragraphs: [
    '小雪宝诞生于一个朴素的愿望：让正在经历白血病治疗的孩子和家长，不那么孤单、不那么慌张。',
    '在中国，每年有数千个家庭面对儿童白血病的诊断。漫长的治疗周期、海量的医学信息、反复的住院和居家护理——家属常常在焦虑中寻找答案，而孩子们也需要用自己的方式去理解"我怎么了"。',
    '小雪宝想做的，不是替代医生，而是成为家庭照护路上的一位安静陪伴者。它可以把复杂的医学知识变成孩子能听懂的话，帮家长回答居家护理中的常见问题，让每一条信息都有来源可追溯、有医生可审核。',
    '我们相信，好的医疗 AI 不是更聪明的搜索引擎，而是在对的时间、用对的方式，给人一点安心。',
  ],
}

/* --- Capabilities --- */
export const capabilities: Capability[] = [
  {
    icon: BookOpen,
    title: '儿童友好科普',
    description:
      '把复杂的医学知识转成孩子和家属更容易理解的话。用温暖的语言和类比，帮助小患者理解自己的治疗过程。',
  },
  {
    icon: Handshake,
    title: '家庭照护问答',
    description:
      '围绕发热、饮食、用药提醒、情绪安抚等日常场景，为家庭提供及时、可靠的护理参考。',
  },
  {
    icon: ShieldCheck,
    title: '医生审核友好',
    description:
      '知识条目保留来源标注、审核状态和审核备注，方便医护人员快速验证内容准确性。',
  },
  {
    icon: Lock,
    title: '多家庭隔离',
    description:
      '公共能力可复用，但家庭记忆、运行态和私有资料严格隔离，保障每个家庭的数据安全。',
  },
  {
    icon: HardDrives,
    title: 'Hermes 后端接入',
    description:
      '支持家庭 profile 和 container 的运行态管理，提供稳定的服务端能力调度。',
  },
  {
    icon: GithubLogo,
    title: '开源能力包',
    description:
      '技能、知识库样例、工作流、评测集和适配模板均可复用，欢迎社区共建和二次开发。',
  },
]

/* --- Architecture --- */
export interface ArchStep {
  label: string
  sublabel: string
}

export const architectureSteps: ArchStep[] = [
  { label: '用户 / 家庭', sublabel: '患儿、家长、医护人员' },
  { label: '前端入口', sublabel: 'Web / 小程序界面' },
  { label: 'Hermes 后端', sublabel: '运行态管理与调度' },
  { label: '小雪宝能力包', sublabel: '技能 / 工作流 / 知识库' },
  { label: '服务层', sublabel: '模型服务 / 医生审核 / 评测' },
]

/* --- Team --- */
export const teamMembers: TeamMember[] = [
  {
    name: '李帅帅',
    role: '项目发起人',
    bio: '儿科医生，小雪宝项目的构想者和推动者，致力于用 AI 技术帮助白血病家庭。',
  },
  {
    name: '待补充',
    role: '医学内容顾问',
    bio: '负责医学知识的准确性审核，确保科普内容符合最新诊疗指南。',
  },
  {
    name: '待补充',
    role: 'AI / 后端工程',
    bio: '负责能力包架构、Hermes 后端接入和模型服务调度。',
  },
  {
    name: '待补充',
    role: '前端与视觉设计',
    bio: '负责用户界面和视觉体验，让技术产品传递温暖感。',
  },
  {
    name: '社区共创者',
    role: '志愿者与共创者',
    bio: '来自开源社区和医疗领域的志愿者，共同参与小雪宝的建设。',
  },
]

/* --- Acknowledgments --- */
export const acknowledgments: Acknowledgment[] = [
  {
    target: '患儿家庭',
    message:
      '感谢每一位勇敢面对治疗的家庭。你们的真实需求和反馈，是小雪宝存在的原因。',
  },
  {
    target: '医护工作者',
    message:
      '感谢医生、护士和医学内容审核者。你们的专业守护，让技术有了可靠的根基。',
  },
  {
    target: '开源社区',
    message:
      '感谢开源社区的工具和灵感。开放的协作让一个小小的想法有机会长成真正的项目。',
  },
  {
    target: 'AI 工具支持者',
    message:
      '感谢 AI 基础设施的构建者。没有你们的努力，小雪宝不会有今天的模样。',
  },
  {
    target: '共创参与者',
    message:
      '感谢每一位参与测试、提建议、分享经验的人。小雪宝属于所有关心它的人。',
  },
]

/* --- Disclaimer --- */
export const disclaimerText =
  '小雪宝提供的内容仅用于医学科普、照护支持和情绪陪伴，不能替代医生诊断、治疗方案或紧急医疗处置。如出现发热、感染、出血、呼吸困难等紧急情况，请立即联系主管医生或就医。'

/* --- Open Source --- */
export const openSourceLink = {
  label: 'GitHub 能力仓库',
  url: 'https://github.com/Handsome5201314/xiaoxuebao-ability-pack',
}
