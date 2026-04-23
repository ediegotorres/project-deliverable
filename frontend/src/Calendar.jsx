import { useState, useEffect } from 'react'
import './Calendar.css'
import { addEvent, deleteEvent, getEvents } from './services/eventService'

// ─── constants ────────────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOUR_HEIGHT = 60
const START_HOUR = 7
const HOURS = Array.from({ length: 15 }, (_, i) => {
  const h = START_HOUR + i
  return h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`
})

const TYPE_COLORS = {
  assignment: '#6c63ff',
  exam: '#ef4444',
  class: '#10b981',
  personal: '#f59e0b',
}

function getWeekDates() {
  const today = new Date()
  const day = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - day)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

// Convert a YYYY-MM-DD date string to the Mon/Tue/… day label for this week
function dateToWeekDay(dateStr) {
  const weekDates = getWeekDates()
  const idx = weekDates.findIndex(
    (d) => d.toISOString().slice(0, 10) === dateStr
  )
  return idx >= 0 ? DAYS[idx] : null
}

// ─── MiniCalendar ─────────────────────────────────────────────────────────────
function MiniCalendar() {
  const [cursor, setCursor] = useState(new Date())
  const today = new Date()
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))}>‹</button>
        <span>{cursor.toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))}>›</button>
      </div>
      <div className="mini-cal-grid">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <span key={i} className="mini-cal-dow">{d}</span>
        ))}
        {cells.map((d, i) => {
          const isToday =
            d && d === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
          return (
            <span key={i} className={`mini-cal-day ${d ? '' : 'empty'} ${isToday ? 'today' : ''}`}>
              {d || ''}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ─── AddEventModal ─────────────────────────────────────────────────────────────
const TYPE_OPTIONS = ['assignment', 'exam', 'class', 'personal']
const PRIORITY_OPTIONS = ['low', 'medium', 'high']
const TAG_OPTIONS = ['assignment', 'exam', 'class', 'personal']

function AddEventModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'class',
    priority: 'medium',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.date) { setError('Date is required.'); return }
    setError('')
    setLoading(true)
    try {
      await addEvent({
        title: form.title.trim(),
        date: form.date,
        type: form.type,
        priority: form.priority,
        description: form.description.trim(),
      })
      setForm({ title: '', date: new Date().toISOString().slice(0, 10), type: 'class', priority: 'medium', description: '' })
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error('Failed to save event:', err)
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Add Event</h3>

        {error && <p style={{ color: '#ef4444', marginBottom: 8, fontSize: 13 }}>{error}</p>}

        <div className="form-row">
          <label>Event Title</label>
          <input
            id="event-title"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            autoFocus
            placeholder="e.g. CS 471 Final Exam"
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Date</label>
          <input
            id="event-date"
            type="date"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>Type</label>
          <div className="tag-box">
            {TYPE_OPTIONS.map(t => (
              <span
                key={t}
                id={`type-${t}`}
                className={`tag ${form.type === t ? 'tag-active' : ''}`}
                onClick={() => !loading && set('type', t)}
              >{t}</span>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Priority</label>
          <div className="priority-row">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p}
                id={`priority-${p}`}
                className={`priority-dot ${form.priority === p ? 'priority-active' : ''}`}
                onClick={() => !loading && set('priority', p)}
                title={p}
                disabled={loading}
              />
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Description (optional)</label>
          <input
            id="event-description"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Any extra notes…"
            disabled={loading}
          />
        </div>

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button
            id="save-event-btn"
            className="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Calendar (main) ──────────────────────────────────────────────────────────
export default function Calendar() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [activeTags, setActiveTags] = useState([])
  const [events, setEvents] = useState([])

  const fetchData = async () => {
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (err) {
      console.error('Failed to load events:', err)
    }
  }

  // Fetch events on mount
  useEffect(() => {
    fetchData()
  }, [])

  const toggleTagFilter = tag =>
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )

  // Map Firestore events to week-grid format
  const weekDates = getWeekDates()
  const firestoreEventsByDay = {}
  DAYS.forEach(d => { firestoreEventsByDay[d] = [] })

  events.forEach(ev => {
    const dayLabel = dateToWeekDay(ev.date)
    if (!dayLabel) return
    const dayEvents = firestoreEventsByDay[dayLabel]
    const stackIndex = dayEvents.length
    firestoreEventsByDay[dayLabel].push({
      id: ev.id,
      title: ev.title,
      top: (8 - START_HOUR) * HOUR_HEIGHT + stackIndex * (HOUR_HEIGHT * 1.2),
      height: HOUR_HEIGHT * 1,
      color: TYPE_COLORS[ev.type] || '#6c63ff',
      tags: [ev.type],
      eventId: ev.id,
    })
  })

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      await deleteEvent(id)
      fetchData()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="cal-wrapper">
      <div className="cal-header">
        <button id="add-event-btn" className="add-btn" onClick={() => setShowModal(true)}>+ Add event</button>
        <div className="search-bar">
          <input
            id="search-events"
            placeholder="Search events"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="search-icon">&#128269;</span>
        </div>
      </div>

      <div className="cal-body">
        <div className="sidebar">
          <MiniCalendar />

          <div className="filter-section">
            <span className="filter-title">Filter by Tag</span>
            <div className="filter-tags">
              {TAG_OPTIONS.map(tag => (
                <span
                  key={tag}
                  className={`filter-tag ${activeTags.includes(tag) ? 'filter-tag-active' : ''}`}
                  onClick={() => toggleTagFilter(tag)}
                >{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
              ))}
            </div>
            {activeTags.length > 0 && (
              <button className="filter-clear" onClick={() => setActiveTags([])}>Clear</button>
            )}
          </div>

          {/* Firestore event list */}
          <ul className="task-list">
            {events.length === 0 && (
              <li style={{ opacity: 0.5, fontSize: 12 }}>No events yet — add one!</li>
            )}
            {events.map(ev => (
              <li key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <span className="checkbox" />
                  {ev.title}
                  <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.6 }}>({ev.date})</span>
                </span>
                <button
                  id={`delete-${ev.id}`}
                  onClick={e => handleDelete(ev.id, e)}
                  style={{
                    background: 'none', border: 'none', color: '#ef4444',
                    cursor: 'pointer', fontSize: 13, padding: '0 4px',
                  }}
                  title="Delete event"
                >✕</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="week-section">
          <div className="week-header">
            <div className="time-gutter-spacer" />
            {weekDates.map((date, i) => {
              const isToday = date.toDateString() === new Date().toDateString()
              return (
                <div key={i} className="day-label">
                  <span className="day-name">{DAYS[i]}</span>
                  <span className={`day-num ${isToday ? 'day-num-today' : ''}`}>{date.getDate()}</span>
                </div>
              )
            })}
          </div>

          <div className="week-scroll">
            <div className="time-gutter">
              {HOURS.map((label, i) => (
                <div key={i} className="time-slot">
                  <span className="time-label">{label}</span>
                </div>
              ))}
            </div>
            <div className="week-days">
              {DAYS.map(day => (
                <div key={day} className="day-col">
                  <div className="day-events" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                    {HOURS.map((_, i) => (
                      <div key={i} className="hour-line" style={{ top: i * HOUR_HEIGHT }} />
                    ))}
                    {(firestoreEventsByDay[day] || [])
                      .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
                      .filter(e => activeTags.length === 0 || activeTags.some(tag => e.tags.includes(tag)))
                      .map(e => (
                        <div
                          key={e.id}
                          id={`event-block-${e.id}`}
                          className="event-block"
                          style={{ top: e.top, height: e.height, background: e.color, cursor: 'pointer' }}
                        >
                          <span>{e.title}</span>
                          <button
                            onClick={ev => handleDelete(e.eventId, ev)}
                            style={{
                              background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
                              cursor: 'pointer', fontSize: 11, float: 'right', padding: 0,
                            }}
                            title="Delete"
                          >✕</button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && <AddEventModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchData(); }} />}
    </div>
  )
}
