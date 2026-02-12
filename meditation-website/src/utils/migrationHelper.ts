import { migrateLocalRecords } from '../services/apiService'
import type { PracticeRecord } from '../hooks/usePracticeStats'

const MIGRATION_KEY = 'mindful_data_migrated'

export async function migrateLocalData(): Promise<void> {
  if (localStorage.getItem(MIGRATION_KEY)) return

  const raw = localStorage.getItem('practiceHistory')
  if (!raw) {
    localStorage.setItem(MIGRATION_KEY, 'true')
    return
  }

  let records: PracticeRecord[]
  try {
    records = JSON.parse(raw)
  } catch {
    localStorage.setItem(MIGRATION_KEY, 'true')
    return
  }

  if (!records.length) {
    localStorage.setItem(MIGRATION_KEY, 'true')
    return
  }

  await migrateLocalRecords(records)
  localStorage.setItem(MIGRATION_KEY, 'true')
}
