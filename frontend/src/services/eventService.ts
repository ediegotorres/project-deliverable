import type { CalendarEvent } from '../types/Event'

const API_BASE = '/api/calendar'

export async function addEvent(event: CalendarEvent): Promise<string> {
  const payload = {
    title: event.title,
    itemType: event.type,
    startDate: new Date(event.date).toISOString(),
    notes: event.description,
    // Provide defaults for backend
    courseId: null,
    weightPercentage: 0
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
  
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    date: item.startDate.split('T')[0],
    type: item.itemType,
    description: item.notes || '',
    priority: 'medium', // Default fallback
  }));
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
