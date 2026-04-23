import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { CalendarEvent } from '../types/Event'

const COLLECTION = 'events'

/**
 * Add a new event to Firestore.
 * Returns the new document id.
 */
export async function addEvent(event: CalendarEvent): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...event,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

/**
 * Fetch all events from Firestore (one-time read).
 */
export async function getEvents(): Promise<CalendarEvent[]> {
  const snapshot = await getDocs(collection(db, COLLECTION))
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<CalendarEvent, 'id'>),
  }))
}

/**
 * Update an existing event by its Firestore document id.
 */
export async function updateEvent(
  id: string,
  data: Partial<CalendarEvent>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data as Record<string, unknown>)
}

/**
 * Delete an event by its Firestore document id.
 */
export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}

/**
 * Real-time listener on the events collection.
 * Calls `callback` with the updated array whenever data changes.
 * Returns the unsubscribe function for cleanup.
 */
export function subscribeToEvents(
  callback: (events: CalendarEvent[]) => void
): () => void {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const events: CalendarEvent[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<CalendarEvent, 'id'>),
    }))
    callback(events)
  })
  return unsubscribe
}
