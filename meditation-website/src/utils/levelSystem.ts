export interface Level {
  level: number
  nameZh: string
  nameEn: string
  minSeconds: number
  maxSeconds: number
}

const LEVELS: Level[] = [
  { level: 1, nameZh: '初心者', nameEn: 'Beginner', minSeconds: 0, maxSeconds: 3600 },           // 0-1h
  { level: 2, nameZh: '静心者', nameEn: 'Practitioner', minSeconds: 3600, maxSeconds: 18000 },    // 1-5h
  { level: 3, nameZh: '觉察者', nameEn: 'Observer', minSeconds: 18000, maxSeconds: 72000 },       // 5-20h
  { level: 4, nameZh: '定心者', nameEn: 'Focused', minSeconds: 72000, maxSeconds: 180000 },       // 20-50h
  { level: 5, nameZh: '慧心者', nameEn: 'Wise', minSeconds: 180000, maxSeconds: 360000 },         // 50-100h
  { level: 6, nameZh: '明心者', nameEn: 'Enlightened', minSeconds: 360000, maxSeconds: Infinity }, // 100h+
]

export function getLevel(totalSeconds: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalSeconds >= LEVELS[i].minSeconds) {
      return LEVELS[i]
    }
  }
  return LEVELS[0]
}

export function getLevelProgress(totalSeconds: number): number {
  const level = getLevel(totalSeconds)
  if (level.maxSeconds === Infinity) return 100
  const range = level.maxSeconds - level.minSeconds
  const progress = totalSeconds - level.minSeconds
  return Math.min(100, Math.round((progress / range) * 100))
}

export function getNextLevel(totalSeconds: number): Level | null {
  const current = getLevel(totalSeconds)
  if (current.level >= LEVELS.length) return null
  return LEVELS[current.level] // next level index = current.level since levels are 1-indexed
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
