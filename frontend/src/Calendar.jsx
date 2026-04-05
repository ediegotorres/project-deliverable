import { useState } from 'react'
import './Calendar.css'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOUR_HEIGHT = 60 // px per hour
const START_HOUR = 7
const HOURS = Array.from({ length: 15 }, (_, i) => {
  const h = START_HOUR + i
  return h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`
})

function getWeekDates() {
  const today = new Date()
  const day = (today.getDay() + 6) % 7 // Mon=0
  const monday = new Date(today)
  monday.setDate(today.getDate() - day)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const t = (hour, min = 0) => (hour - START_HOUR) * HOUR_HEIGHT + (min / 60) * HOUR_HEIGHT
const h = (hrs) => hrs * HOUR_HEIGHT

const SAMPLE_EVENTS = {
  Mon: [{ id: 1, title: 'Team Standup', top: t(9), height: h(0.5), color: '#6c63ff' }, { id: 2, title: 'Lunch', top: t(12), height: h(1), color: '#f59e0b' }],
  Tue: [{ id: 3, title: 'Design Review', top: t(10), height: h(1.5), color: '#10b981' }, { id: 4, title: 'Client Call', top: t(14), height: h(1), color: '#6c63ff' }],
  Wed: [{ id: 5, title: 'Sprint Planning', top: t(9), height: h(2), color: '#f59e0b' }, { id: 6, title: 'Retro', top: t(15), height: h(1), color: '#10b981' }],
  Thu: [{ id: 7, title: '1:1', top: t(11), height: h(1), color: '#6c63ff' }, { id: 8, title: 'Workshop', top: t(13), height: h(1.5), color: '#f59e0b' }],
  Fri: [{ id: 9, title: 'Demo Day', top: t(10), height: h(2), color: '#10b981' }],
  Sat: [{ id: 10, title: 'Hackathon', top: t(9), height: h(3), color: '#6c63ff' }],
  Sun: [{ id: 11, title: 'Planning', top: t(14), height: h(1), color: '#f59e0b' }],
}

const TASKS = ['Review PR #42', 'Update docs', 'Fix auth bug', 'Deploy staging']
const TAG_OPTIONS = ['Work', 'Personal', 'Health', 'Study', 'Social']

function MiniCalendar() {
  const [cursor, setCursor] = useState(new Date())
  const today = new Date()

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7 // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prev = () => setCursor(new Date(year, month - 1, 1))
  const next = () => setCursor(new Date(year, month + 1, 1))

  const cells = [...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">
        <button onClick={prev}>‹</button>
        <span>{cursor.toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
        <button onClick={next}>›</button>
      </div>
      <div className="mini-cal-grid">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <span key={i} className="mini-cal-dow">{d}</span>
        ))}
        {cells.map((d, i) => {
          const isToday = d && d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
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

function AddEventModal({ onClose }) {
  const [form, setForm] = useState({
    name: '', date: '', start: '', end: '', priority: 3, remind: true, tags: [],
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleTag = tag =>
    set('tags', form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Add Event</h3>

        <div className="form-row">
          <label>Event Name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
        </div>

        <div className="form-row">
          <label>Tags</label>
          <div className="tag-box">
            {TAG_OPTIONS.map(t => (
              <span
                key={t}
                className={`tag ${form.tags.includes(t) ? 'tag-active' : ''}`}
                onClick={() => toggleTag(t)}
              >{t}</span>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Date</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>

        <div className="form-row">
          <label>Start</label>
          <input type="time" value={form.start} onChange={e => set('start', e.target.value)} />
        </div>

        <div className="form-row">
          <label>End</label>
          <input type="time" value={form.end} onChange={e => set('end', e.target.value)} />
        </div>

        <div className="form-row">
          <label>Priority</label>
          <div className="priority-row">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                className={`priority-dot ${form.priority === n ? 'priority-active' : ''}`}
                onClick={() => set('priority', n)}
                title={`Priority ${n}`}
              />
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Remind</label>
          <input type="checkbox" checked={form.remind} onChange={e => set('remind', e.target.checked)} />
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={onClose}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default function Calendar() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="cal-wrapper">
      <div className="cal-header">
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add event</button>
        <div className="search-bar">
          <input
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
          <ul className="task-list">
            {TASKS.map((t, i) => (
              <li key={i}><span className="checkbox" /> {t}</li>
            ))}
          </ul>
        </div>

        <div className="week-section">
          {/* Fixed day headers */}
          <div className="week-header">
            <div className="time-gutter-spacer" />
            {getWeekDates().map((date, i) => {
              const isToday = date.toDateString() === new Date().toDateString()
              return (
                <div key={i} className="day-label">
                  <span className="day-name">{DAYS[i]}</span>
                  <span className={`day-num ${isToday ? 'day-num-today' : ''}`}>{date.getDate()}</span>
                </div>
              )
            })}
          </div>

          {/* Scrollable time grid */}
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
                    {SAMPLE_EVENTS[day]
                      .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
                      .map(e => (
                        <div key={e.id} className="event-block"
                          style={{ top: e.top, height: e.height, background: e.color }}>
                          {e.title}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && <AddEventModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
