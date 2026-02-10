import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { JournalEntry } from '../types/journal'

// ==================== Practice Records ====================

export interface FirestorePracticeRecord {
  id?: string
  date: string
  tool: string
  duration: number
  createdAt: Timestamp | Date
}

export async function addPracticeRecord(uid: string, tool: string, duration: number) {
  const record = {
    date: new Date().toISOString().split('T')[0],
    tool,
    duration,
    createdAt: serverTimestamp(),
  }
  const ref = await addDoc(collection(db, 'users', uid, 'practiceRecords'), record)

  // Update total practice seconds on user doc
  await updateDoc(doc(db, 'users', uid), {
    totalPracticeSeconds: increment(duration),
  })

  return ref.id
}

export async function getPracticeRecords(uid: string): Promise<FirestorePracticeRecord[]> {
  const q = query(
    collection(db, 'users', uid, 'practiceRecords'),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestorePracticeRecord))
}

export async function getPracticeRecordsByDateRange(
  uid: string,
  startDate: string,
  endDate: string
): Promise<FirestorePracticeRecord[]> {
  const q = query(
    collection(db, 'users', uid, 'practiceRecords'),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestorePracticeRecord))
}

// ==================== Journals ====================

export async function addJournal(uid: string, entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) {
  const data = {
    ...entry,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  const ref = await addDoc(collection(db, 'users', uid, 'journals'), data)
  return ref.id
}

export async function getJournals(uid: string, maxResults = 50): Promise<(JournalEntry & { id: string })[]> {
  const q = query(
    collection(db, 'users', uid, 'journals'),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as JournalEntry & { id: string }))
}

export async function getJournal(uid: string, journalId: string): Promise<(JournalEntry & { id: string }) | null> {
  const ref = doc(db, 'users', uid, 'journals', journalId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as JournalEntry & { id: string }
}

export async function updateJournal(uid: string, journalId: string, updates: Partial<JournalEntry>) {
  const ref = doc(db, 'users', uid, 'journals', journalId)
  await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() })
}

export async function deleteJournal(uid: string, journalId: string) {
  const ref = doc(db, 'users', uid, 'journals', journalId)
  await deleteDoc(ref)
}

// ==================== User ====================

export async function getUserData(uid: string) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data()
}

export async function updateUserSettings(uid: string, settings: Record<string, unknown>) {
  const ref = doc(db, 'users', uid)
  await updateDoc(ref, { settings })
}
