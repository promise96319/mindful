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
