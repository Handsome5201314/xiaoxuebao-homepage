/**
 * 聊天首页内容数据
 * 修改此文件可更新首页的快捷话题、模拟对话等内容
 */

import {
  ForkKnife,
  Thermometer,
  Heart,
  Pill,
} from '@phosphor-icons/react'
import type { IconProps } from '@phosphor-icons/react'
import type { ComponentType } from 'react'

type PhosphorIcon = ComponentType<IconProps>

export interface QuickTopic {
  icon: PhosphorIcon
  label: string
  color: string
  bgColor: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatDemo {
  id: number
  messages: ChatMessage[]
}

/* --- 快捷话题卡片 --- */
export const quickTopics: QuickTopic[] = [
  {
    icon: ForkKnife,
    label: '化疗期间吃什么',
    color: '#E8943A',
    bgColor: '#FFF3E0',
  },
  {
    icon: Thermometer,
    label: '发烧了怎么办',
    color: '#E53E3E',
    bgColor: '#FFF5F5',
  },
  {
    icon: Heart,
    label: '今天心情不好',
    color: '#D53F8C',
    bgColor: '#FFF0F7',
  },
  {
    icon: Pill,
    label: '用药提醒',
    color: '#5BA4D9',
    bgColor: '#E8F4FD',
  },
]

/* --- 模拟对话展示 --- */
export const chatDemos: ChatDemo[] = [
  {
    id: 1,
    messages: [
      {
        role: 'user',
        content: '孩子化疗后不想吃饭，有什么好办法吗？',
      },
      {
        role: 'assistant',
        content:
          '化疗后食欲下降是很常见的反应，不用太担心。可以试试这几个方法：少量多餐，每次少吃一点但多吃几次；准备一些孩子平时喜欢的食物，温度不要太烫；可以在两餐之间补充营养奶昔。如果孩子连续两天几乎不进食，建议联系主管医生。',
      },
    ],
  },
  {
    id: 2,
    messages: [
      {
        role: 'user',
        content: '宝宝发烧38度，在家应该怎么处理？',
      },
      {
        role: 'assistant',
        content:
          '38度属于低热范围。建议先观察孩子的精神状态，如果精神还可以，可以先物理降温：用温水擦拭额头、腋下和手脚，保持室内通风，让孩子多喝水。但请注意，如果孩子正在化疗期间或免疫力较低，即使低热也建议及时联系主管医生，不要自行使用退烧药。',
      },
    ],
  },
  {
    id: 3,
    messages: [
      {
        role: 'user',
        content: '孩子问我"我为什么会生病"，怎么跟他解释？',
      },
      {
        role: 'assistant',
        content:
          '这是一个很重要的问题。可以用孩子能理解的方式告诉他："你的身体里有一些小细胞变得不太听话，医生叔叔阿姨正在帮你把它们变回来。这不是你的错，也不是因为你做错了什么。"可以配合绘本或画画来解释，让孩子感到安全而不是害怕。',
      },
    ],
  },
]

/* --- 问候语 --- */
export const greeting = {
  title: '你好，我是小雪宝',
  subtitle: '你的儿童白血病 AI 关爱伙伴',
  placeholder: '问问小雪宝任何问题……',
  voiceLabel: '语音通话',
}

/* --- 底部免责声明（简版） --- */
export const disclaimerShort =
  '小雪宝提供的内容仅用于医学科普和照护支持，不能替代医生诊断。紧急情况请立即就医。'
