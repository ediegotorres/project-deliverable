import { useState } from 'react'
import './Calendar.css'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const SAMPLE_EVENTS = {
  Mon: [{ id: 1, title: 'Team Standup', top: 20, height: 60, color: '#6c63ff' }, { id: 2, title: 'Lunch', top: 120, height: 40, color: '#f59e0b' }],
  Tue: [{ id: 3, title: 'Design Review', top: 10, height: 80, color: '#10b981' }, { id: 4, title: 'Client Call', top: 110, height: 50, color: '#6c63ff' }],
  Wed: [{ id: 5, title: 'Sprint Planning', top: 30, height: 100, color: '#f59e0b' }, { id: 6, title: 'Retro', top: 145, height: 45, color: '#10b981' }],
  Thu: [{ id: 7, title: '1:1', top: 50, height: 55, color: '#6c63ff' }, { id: 8, title: 'Workshop', top: 120, height: 70, color: '#f59e0b' }],
  Fri: [{ id: 9, title: 'Demo Day', top: 15, height: 65, color: '#10b981' }],
  Sat: [{ id: 10, title: 'Hackathon', top: 25, height: 90, color: '#6c63ff' }],
  Sun: [{ id: 11, title: 'Planning', top: 40, height: 50, color: '#f59e0b' }],
}

const TASKS = [
  'Review PR #42',
  'Update docs',
  'Fix auth bug',
  'Deploy staging',
]

export default function Calendar() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="cal-wrapper">
      {/* Header */}
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

      {/* Body */}
      <div className="cal-body">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="mini-dots">
            {[...Array(9)].map((_, i) => <span key={i} className="dot" />)}
          </div>
          <ul className="task-list">
            {TASKS.map((t, i) => (
              <li key={i}><span className="checkbox" />  {t}</li>
            ))}
          </ul>
        </div>

        {/* Weekly Grid */}
        <div className="week-grid">
          {DAYS.map(day => (
            <div key={day} className="day-col">
              <div className="day-label">{day}</div>
              <div className="day-events">
                {SAMPLE_EVENTS[day]
                  .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))
                  .map(e => (
                    <div
                      key={e.id}
                      className="event-block"
                      style={{ top: e.top, height: e.height, background: e.color }}
                    >
                      {e.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Event</h3>
            <input placeholder="Event title" autoFocus />
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button className="primary" onClick={() => setShowModal(false)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
