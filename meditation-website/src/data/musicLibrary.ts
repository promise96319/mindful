export interface Track {
  id: string
  title: string
  titleZh: string
  category: string
  duration: number // seconds
  gradient: string // tailwind gradient for thumbnail
}

export const tracks: Track[] = [
  // Nature category (4 tracks)
  { id: 'nature-1', title: 'Morning Rain', titleZh: '晨雨', category: 'nature', duration: 300, gradient: 'from-green-400 to-blue-500' },
  { id: 'nature-2', title: 'Ocean Waves', titleZh: '海浪', category: 'nature', duration: 420, gradient: 'from-cyan-400 to-blue-600' },
  { id: 'nature-3', title: 'Forest Birds', titleZh: '林间鸟鸣', category: 'nature', duration: 360, gradient: 'from-emerald-400 to-green-600' },
  { id: 'nature-4', title: 'Flowing Stream', titleZh: '溪流', category: 'nature', duration: 480, gradient: 'from-teal-400 to-cyan-600' },

  // Ambient category (3 tracks)
  { id: 'ambient-1', title: 'Crystal Bowls', titleZh: '水晶碗', category: 'ambient', duration: 600, gradient: 'from-purple-400 to-indigo-600' },
  { id: 'ambient-2', title: 'Ethereal Pads', titleZh: '空灵音垫', category: 'ambient', duration: 540, gradient: 'from-violet-400 to-purple-600' },
  { id: 'ambient-3', title: 'Deep Drone', titleZh: '深沉嗡鸣', category: 'ambient', duration: 720, gradient: 'from-indigo-400 to-blue-700' },

  // Meditation category (3 tracks)
  { id: 'meditation-1', title: 'Tibetan Bells', titleZh: '藏式铃声', category: 'meditation', duration: 480, gradient: 'from-amber-400 to-orange-600' },
  { id: 'meditation-2', title: 'Om Chanting', titleZh: 'Om 吟诵', category: 'meditation', duration: 600, gradient: 'from-yellow-400 to-amber-600' },
  { id: 'meditation-3', title: 'Zen Garden', titleZh: '禅意花园', category: 'meditation', duration: 540, gradient: 'from-orange-400 to-red-500' },

  // Sleep category (3 tracks)
  { id: 'sleep-1', title: 'Night Whispers', titleZh: '夜语低喃', category: 'sleep', duration: 900, gradient: 'from-slate-500 to-gray-700' },
  { id: 'sleep-2', title: 'Lullaby Waves', titleZh: '摇篮曲浪', category: 'sleep', duration: 720, gradient: 'from-blue-800 to-indigo-900' },
  { id: 'sleep-3', title: 'Starlit Calm', titleZh: '星光宁静', category: 'sleep', duration: 840, gradient: 'from-gray-600 to-slate-800' },
]

export const categories = ['nature', 'ambient', 'meditation', 'sleep'] as const
export type Category = typeof categories[number]
