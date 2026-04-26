import { useState, useEffect } from 'react'
import './Calendar.css'
import { addEvent, deleteEvent, getEvents } from './services/eventService'

// constants
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOUR_HEIGHT = 60
const START_HOUR = 0
const HOURS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0)  return '12 AM'
  if (i < 12)   return `${i} AM`
  if (i === 12) return '12 PM'
  return `${i - 12} PM`
})

const TYPE_COLORS = {
  assignment: '#6c63ff',
  ASSIGNMENT: '#6c63ff',
  exam:       '#ef4444',
  EXAM:       '#ef4444',
  class:      '#10b981',
  CLASS:      '#10b981',
  personal:   '#f59e0b',
  EVENT:      '#f59e0b',
}

const TYPE_OPTIONS    = ['class', 'assignment', 'exam', 'personal']
const PRIORITY_OPTIONS = ['low', 'medium', 'high']
const TAG_OPTIONS     = ['class', 'assignment', 'exam', 'personal']

// Returns an array of 7 Date objects for the week at `offset` weeks from today.
// offset = 0 is the current week, offset = -1 is last week, offset = 1 is next week.
function getWeekDates(offset = 0) {
  const today = new Date()
  const day = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - day + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

// Takes a YYYY-MM-DD date string and the precomputed weekDates array, returns the matching DAYS label or null.
function dateToWeekDay(dateStr, weekDates) {
  const idx = weekDates.findIndex(
    (d) => d.toLocaleDateString('en-CA') === dateStr
  )
  return idx >= 0 ? DAYS[idx] : null
}

// Mini canldendar for side-bar.
// Highlights today's date with a CSS class. Prev/next buttons shift the cursor by one month.
// No functionality on click yet.
// Citation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
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

// Modal to show event details when clicked.
// Not editable. 
function EventDetailModal({ event, onClose, onDelete }) {
  const fmt = (dt) => dt
    ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  const startFmt = fmt(event.startTime)
  const endFmt   = fmt(event.endTime)
  const color    = TYPE_COLORS[event.type]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ margin: 0 }}>{event.title}</h3>
          <span className="tag tag-active" style={{ background: color, borderColor: color, marginLeft: 12 }}>
            {event.type}
          </span>
        </div>

        <div className="form-row">
          <label>Date</label>
          <span>{new Date(`${event.date}T12:00`).toLocaleDateString('en', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {startFmt && (
          <div className="form-row">
            <label>Time</label>
            <span>{startFmt}{endFmt ? ` – ${endFmt}` : ''}</span>
          </div>
        )}

        <div className="form-row">
          <label>Priority</label>
          <span className={`detail-priority detail-priority-${event.priority}`}>{event.priority}</span>
        </div>

        {event.description && (
          <div className="form-row">
            <label>Notes</label>
            <span>{event.description}</span>
          </div>
        )}

        <div className="modal-actions">
          <button className="danger" onClick={() => onDelete(event.id)}>Delete</button>
          <button className="primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// Modal for new event.
// Calls addEvent to update backend.
function AddEventModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    start: '',
    end: '',
    type: 'class',
    priority: 'medium',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    // handle error if the user does not input title or select date 
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.date) { setError('Date is required.'); return }
    setError('')
    setLoading(true)
    try {
      await addEvent({
        title: form.title.trim(),
        date: form.date,
        start: form.start,
        end: form.end,
        type: form.type,
        priority: form.priority,
        description: form.description.trim(),
      })
      setForm({ title: '', date: new Date().toISOString().slice(0, 10), start: '', end: '', type: 'class', priority: 'medium', description: '' })
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
          <label>Start Time</label>
          <input
            id="event-start"
            type="time"
            value={form.start}
            onChange={e => set('start', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <label>End Time</label>
          <input
            id="event-end"
            type="time"
            value={form.end}
            onChange={e => set('end', e.target.value)}
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

// Root component for page.  
// Renders the header (add button + search), sidebar (MiniCalendar + tag filter + event list), and the 7-day week grid.
export default function Calendar() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [activeTags, setActiveTags] = useState([])
  const [events, setEvents] = useState([])
  const [weekOffset, setWeekOffset] = useState(0)

  // Fetches latest event list from the backend and updates the events 
  const fetchData = async () => {
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (err) {
      console.error('Failed to load events:', err)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Toggles a tag in the activeTags filter list.
  const toggleTagFilter = tag =>
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )

  // Map events to week-grid format for week view.
  const weekDates = getWeekDates(weekOffset)
  const eventsByDay = {}
  DAYS.forEach(d => { eventsByDay[d] = [] })

  // Add event to eventsByDay, mapppin time to calendar location and height. 
  events.forEach(ev => {
    const dayLabel = dateToWeekDay(ev.date, weekDates)
    if (!dayLabel) return
    const start = ev.startTime
    const end   = ev.endTime ?? new Date(start.getTime() + 60 * 60 * 1000) 
    const durationHrs = Math.max((end - start) / (1000 * 60 * 60), 0.5)
    eventsByDay[dayLabel].push({
      id:      ev.id,
      title:   ev.title,
      top:     Math.max(0, (start.getHours() - START_HOUR) * HOUR_HEIGHT + (start.getMinutes() / 60) * HOUR_HEIGHT), 
      height:  durationHrs * HOUR_HEIGHT,
      color:   TYPE_COLORS[ev.type] || '#6c63ff',
      tags:    [ev.type],
      raw:     ev,
    })
  })

  // Deletes an event using deleteEvent from eventService, then closes the detail modal and re-fetches.
  const handleDelete = async (id) => {
    try {
      await deleteEvent(id)
      setSelectedEvent(null)
      fetchData()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
  // Wrapper for main calendar.
  // Includes time gutter and day labels.
  // Navigate to prev/next week.
  // Applies filters to events.
  // Use eventsByDay to render events to correct position.
  // Citation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  return (
    <div className="cal-wrapper">
      <div className="cal-header">
        <label>Mason Mate</label>
        <button id="add-event-btn" className="add-btn" onClick={() => setShowModal(true)}>+ Add event</button>
        <div className="search-bar">
          <input
            id="search-events"
            placeholder="Search your events"
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
                >{tag}</span>
              ))}
            </div>
            {activeTags.length > 0 && (
              <button className="filter-clear" onClick={() => setActiveTags([])}>Clear</button>
            )}
          </div>

          <ul className="task-list">
            {events.length === 0 && (
              <li className="task-empty">No events</li>
            )}
            {events.map(ev => (
              <li key={ev.id} className="task-item" onClick={() => setSelectedEvent(ev)}>
                <span className="task-info">
                  <span className="task-title">{ev.title}</span>
                </span>
                <button
                  id={`delete-${ev.id}`}
                  className="task-delete"
                  onClick={e => { e.stopPropagation(); handleDelete(ev.id) }}
                  title="Delete event"
                >✕</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="week-section">
          <div className="week-nav">
            <button className="week-nav-btn" onClick={() => setWeekOffset(o => o - 1)}>‹</button>
            <button className="week-nav-btn" onClick={() => setWeekOffset(o => o + 1)}>›</button>
          </div>

          <div className="week-scroll">
            <div className="time-gutter">
              <div className="gutter-corner" />
              {HOURS.map((label, i) => (
                <div key={i} className="time-slot">
                  <span className="time-label">{label}</span>
                </div>
              ))}
            </div>
            <div className="week-days">
              {DAYS.map((day, i) => {
                const date = weekDates[i]
                const isToday = date.toDateString() === new Date().toDateString()
                return (
                <div key={day} className="day-col">
                  <div className="day-label">
                    <span className="day-name">{DAYS[i]}</span>
                    <span className={`day-num ${isToday ? 'day-num-today' : ''}`}>{date.getDate()}</span>
                  </div>
                  <div className="day-events" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                    {HOURS.map((_, j) => (
                      <div key={j} className="hour-line" style={{ top: j * HOUR_HEIGHT }} />
                    ))}
                    {(eventsByDay[day] || [])
                      .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
                      .filter(e => activeTags.length === 0 || activeTags.some(tag => e.tags.includes(tag)))
                      .map(e => (
                        <div
                          key={e.id}
                          id={`event-block-${e.id}`}
                          className="event-block"
                          style={{ top: e.top, height: e.height, background: e.color, cursor: 'pointer' }}
                          onClick={() => setSelectedEvent(e.raw)}
                        >
                          {e.title}
                        </div>
                      ))}
                  </div>
                </div>
              )
              })}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddEventModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchData() }}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
