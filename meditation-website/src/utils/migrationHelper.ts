import { collection, addDoc, getDocs, query, limit, doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { PracticeRecord } from '../hooks/usePracticeStats'

const MIGRATION_KEY = 'mindful_data_migrated'

export async function migrateLocalData(uid: string): Promise<void> {
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

  // Check if user already has cloud records (don't duplicate)
  const existingSnap = await getDocs(query(collection(db, 'users', uid, 'practiceRecords'), limit(1)))
  if (!existingSnap.empty) {
    localStorage.setItem(MIGRATION_KEY, 'true')
    return
  }

  // Migrate records to Firestore
  const recordsRef = collection(db, 'users', uid, 'practiceRecords')
  let totalSeconds = 0

  for (const record of records) {
    await addDoc(recordsRef, {
      date: record.date,
      tool: record.tool,
      duration: record.duration,
      createdAt: new Date(record.date),
    })
    totalSeconds += record.duration
  }

  // Update total practice seconds
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    totalPracticeSeconds: increment(totalSeconds),
  })

  localStorage.setItem(MIGRATION_KEY, 'true')
}
