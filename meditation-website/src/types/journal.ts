export interface JournalEntry {
  id?: string
  date: string
  toolUsed: string
  duration: number
  mood: number // 1-5
  focus: number // 1-5
  bodyTags: string[]
  mindTags: string[]
  freeText: string
  isPublic: boolean
  isAnonymous: boolean
  createdAt?: string
  updatedAt?: string
}

export const BODY_TAGS_ZH = [
  '放松', '沉重', '温暖', '轻盈', '麻木',
  '刺痛', '紧绷', '疼痛', '舒适', '酸痛',
  '发热', '凉爽', '柔软', '僵硬', '流动',
]

export const BODY_TAGS_EN = [
  'Relaxed', 'Heavy', 'Warm', 'Light', 'Numb',
  'Tingling', 'Tense', 'Pain', 'Comfortable', 'Sore',
  'Hot', 'Cool', 'Soft', 'Stiff', 'Flowing',
]

export const MIND_TAGS_ZH = [
  '平静', '专注', '散乱', '焦虑', '清明',
  '昏沉', '愉悦', '感恩', '释然', '困惑',
  '坚定', '柔和', '空旷', '充实', '安宁',
]

export const MIND_TAGS_EN = [
  'Calm', 'Focused', 'Scattered', 'Anxious', 'Clear',
  'Drowsy', 'Joyful', 'Grateful', 'Relieved', 'Confused',
  'Determined', 'Gentle', 'Spacious', 'Fulfilled', 'Peaceful',
]

// Mood icons: weather metaphors (1=stormy to 5=sunny)
export const MOOD_ICONS = ['⛈️', '🌧️', '☁️', '🌤️', '☀️'] as const
export const MOOD_LABELS_ZH = ['暴风雨', '小雨', '多云', '晴间多云', '晴朗']
export const MOOD_LABELS_EN = ['Stormy', 'Rainy', 'Cloudy', 'Partly Sunny', 'Sunny']
