export interface CalendarEvent {
  id?: string
  title: string
  date: string   // format: YYYY-MM-DD
  start?: string // format: HH:MM
  end?: string   // format: HH:MM
  type: 'assignment' | 'exam' | 'class' | 'personal'
  priority: 'low' | 'medium' | 'high'
  description?: string
  createdAt?: any
}
