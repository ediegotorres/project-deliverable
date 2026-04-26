import type { CalendarEvent } from '../types/Event'

const API_BASE = '/api/calendar'

export async function addEvent(event: CalendarEvent): Promise<string> {
  const startDate = event.start
    ? new Date(`${event.date}T${event.start}`).toISOString()
    : new Date(`${event.date}T08:00`).toISOString() // default to 8 AM local, avoids UTC midnight date shift
  const endDate = event.end
    ? new Date(`${event.date}T${event.end}`).toISOString()
    : null

  const priorityMap: Record<string, number> = { low: 1, medium: 2, high: 3 }

  const payload = {
    title: event.title,
    itemType: event.type,
    startDate,
    endDate,
    notes: event.description,
    courseId: null,
    weightPercentage: 0,
    priorityScore: priorityMap[event.priority] ?? 2,
  }
  
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!res.ok) throw new Error('Failed to add event');
  const data = await res.json();
  return data.id;
}

export async function getEvents(): Promise<CalendarEvent[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch events');
  const data = await res.json();
  
  return data.map((item: any) => {
    const start = new Date(item.startDate)
    const end   = item.endDate ? new Date(item.endDate) : null
    return {
      id:          item.id,
      title:       item.title,
      date:        start.toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
      startTime:   start,
      endTime:     end,
      type:        item.itemType?.toLowerCase() ?? 'event',
      description: item.notes || '',
      priority:    item.priorityScore == null ? 'medium' : item.priorityScore <= 1 ? 'low' : item.priorityScore >= 3 ? 'high' : 'medium',
    }
  });
}

export async function updateEvent(id: string, event: Partial<CalendarEvent>): Promise<void> {
  const payload: any = {};
  if (event.title) payload.title = event.title;
  if (event.type) payload.itemType = event.type;
  if (event.date) payload.startDate = new Date(event.date).toISOString();
  if (event.description !== undefined) payload.notes = event.description;
  
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update event');
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete event');
}
