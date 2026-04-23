export interface CalendarEvent {
  id?: string
  title: string
  date: string // format: YYYY-MM-DD
  type: 'assignment' | 'exam' | 'class' | 'personal'
  priority: 'low' | 'medium' | 'high'
  description?: string
  createdAt?: any
}
