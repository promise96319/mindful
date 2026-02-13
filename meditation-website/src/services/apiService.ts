import { apiFetch } from '../lib/api'
import type { JournalEntry } from '../types/journal'
import type { AppUser } from '../types/user'

// ==================== Practice Records ====================

export interface PracticeRecordResponse {
  id: string
  date: string
  tool: string
  duration: number
  createdAt: string
}

export async function addPracticeRecord(tool: string, duration: number): Promise<PracticeRecordResponse> {
  return apiFetch<PracticeRecordResponse>('/api/practice-records', {
    method: 'POST',
    body: JSON.stringify({ tool, duration }),
  })
}

export async function getPracticeRecords(): Promise<PracticeRecordResponse[]> {
  return apiFetch<PracticeRecordResponse[]>('/api/practice-records')
}

export async function getPracticeRecordsByDateRange(
  startDate: string,
  endDate: string,
): Promise<PracticeRecordResponse[]> {
  return apiFetch<PracticeRecordResponse[]>(
    `/api/practice-records?startDate=${startDate}&endDate=${endDate}`,
  )
}

// ==================== Journals ====================

export interface PublicJournal {
  id: string
  userId: string
  userName: string
  userPhotoURL?: string
  isAnonymous: boolean
  date: string
  toolUsed: string
  duration: number
  mood: number
  focus: number
  bodyTags: string[]
  mindTags: string[]
  freeText: string
  likes: number
  isLiked: boolean
  commentsCount: number
  createdAt: string
}

export async function addJournal(
  entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<JournalEntry & { id: string }> {
  return apiFetch<JournalEntry & { id: string }>('/api/journals', {
    method: 'POST',
    body: JSON.stringify(entry),
  })
}

export async function getJournals(maxResults = 50): Promise<(JournalEntry & { id: string })[]> {
  return apiFetch<(JournalEntry & { id: string })[]>(`/api/journals?limit=${maxResults}`)
}

export async function getPublicJournals(
  page = 0,
  limit = 20,
  filter?: 'all' | 'following',
  searchQuery?: string
): Promise<PublicJournal[]> {
  let endpoint = `/api/journals/public?page=${page}&limit=${limit}`
  if (filter && filter !== 'all') {
    endpoint += `&filter=${filter}`
  }
  if (searchQuery) {
    endpoint += `&search=${encodeURIComponent(searchQuery)}`
  }
  return apiFetch<PublicJournal[]>(endpoint)
}

export async function getJournal(journalId: string): Promise<JournalEntry & { id: string }> {
  return apiFetch<JournalEntry & { id: string }>(`/api/journals/${journalId}`)
}

export async function updateJournal(
  journalId: string,
  updates: Partial<JournalEntry>,
): Promise<JournalEntry & { id: string }> {
  return apiFetch<JournalEntry & { id: string }>(`/api/journals/${journalId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export async function deleteJournal(journalId: string): Promise<void> {
  await apiFetch(`/api/journals/${journalId}`, { method: 'DELETE' })
}

// ==================== User ====================

export async function getUserData(): Promise<AppUser> {
  return apiFetch<AppUser>('/api/users/me')
}

export async function updateUserSettings(
  settings: Record<string, unknown>,
): Promise<AppUser> {
  return apiFetch<AppUser>('/api/users/me/settings', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  })
}

// ==================== Migration ====================

export async function migrateLocalRecords(records: { date: string; tool: string; duration: number }[]): Promise<void> {
  for (const record of records) {
    await addPracticeRecord(record.tool, record.duration)
  }
}

// ==================== Social - Follow/Followers ====================

export interface FollowResponse {
  following: boolean
  followersCount: number
  followingCount: number
}

export async function followUser(userId: string): Promise<FollowResponse> {
  return apiFetch<FollowResponse>(`/api/social/follow/${userId}`, {
    method: 'POST',
  })
}

export async function unfollowUser(userId: string): Promise<FollowResponse> {
  return apiFetch<FollowResponse>(`/api/social/follow/${userId}`, {
    method: 'DELETE',
  })
}

export async function getFollowing(userId?: string): Promise<string[]> {
  const endpoint = userId ? `/api/social/following/${userId}` : '/api/social/following'
  return apiFetch<string[]>(endpoint)
}

export async function getFollowers(userId?: string): Promise<string[]> {
  const endpoint = userId ? `/api/social/followers/${userId}` : '/api/social/followers'
  return apiFetch<string[]>(endpoint)
}

export async function checkFollowing(userId: string): Promise<boolean> {
  const result = await apiFetch<{ following: boolean }>(`/api/social/following/${userId}/check`)
  return result.following
}

// ==================== Social - Likes ====================

export interface LikeResponse {
  liked: boolean
  likesCount: number
}

export async function likeJournal(journalId: string): Promise<LikeResponse> {
  return apiFetch<LikeResponse>(`/api/social/likes/journal/${journalId}`, {
    method: 'POST',
  })
}

export async function unlikeJournal(journalId: string): Promise<LikeResponse> {
  return apiFetch<LikeResponse>(`/api/social/likes/journal/${journalId}`, {
    method: 'DELETE',
  })
}

export async function getLikedJournals(): Promise<string[]> {
  return apiFetch<string[]>('/api/social/liked-journals')
}

export async function checkLiked(journalId: string): Promise<boolean> {
  const result = await apiFetch<{ liked: boolean }>(`/api/social/journals/${journalId}/liked`)
  return result.liked
}

// ==================== Social - Comments ====================

export interface Comment {
  id: string
  journalId: string
  userId: string
  userName: string
  userPhotoURL?: string
  text: string
  createdAt: string
  updatedAt: string
}

export interface AddCommentRequest {
  text: string
}

export async function getComments(journalId: string): Promise<Comment[]> {
  return apiFetch<Comment[]>(`/api/social/comments/journal/${journalId}`)
}

export async function addComment(journalId: string, text: string): Promise<Comment> {
  return apiFetch<Comment>(`/api/social/comments/journal/${journalId}`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}

export async function deleteComment(commentId: string): Promise<void> {
  await apiFetch(`/api/social/comments/${commentId}`, {
    method: 'DELETE',
  })
}

// ==================== Stats - Heatmap ====================

export interface HeatmapDataPoint {
  date: string
  value: number
  tool?: string
}

export async function getHeatmapData(
  year: number,
  viewMode: 'all' | 'tool' = 'all',
  tool?: string,
): Promise<HeatmapDataPoint[]> {
  let endpoint = `/api/stats/heatmap?year=${year}&viewMode=${viewMode}`
  if (tool && viewMode === 'tool') {
    endpoint += `&tool=${encodeURIComponent(tool)}`
  }
  return apiFetch<HeatmapDataPoint[]>(endpoint)
}

// ==================== Stats - Emotion Calendar ====================

export interface EmotionCalendarDataPoint {
  date: string
  mood: number
  focus: number
}

export async function getEmotionCalendarData(month: string): Promise<EmotionCalendarDataPoint[]> {
  return apiFetch<EmotionCalendarDataPoint[]>(`/api/stats/emotion-calendar?month=${month}`)
}

// ==================== Stats - User Statistics ====================

export interface UserStatistics {
  totalSessions: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  averageSessionDuration: number
  favoriteTools: Array<{ tool: string; count: number; totalMinutes: number }>
  moodDistribution: Array<{ mood: number; count: number }>
  focusDistribution: Array<{ focus: number; count: number }>
  practiceByDayOfWeek: Array<{ day: number; count: number; totalMinutes: number }>
  practiceByTimeOfDay: Array<{ hour: number; count: number }>
}

export async function getUserStatistics(userId?: string): Promise<UserStatistics> {
  const endpoint = userId ? `/api/stats/user/${userId}` : '/api/stats/user'
  return apiFetch<UserStatistics>(endpoint)
}
