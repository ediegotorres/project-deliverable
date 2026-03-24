# Add Event

Allows students to quickly add events to their calendar, capturing title, date, time, location, and optional notes.

---

## 1. Before Using MasonMate

### What the student currently does:
- Uses default calendar apps (like Apple Calendar or Google Calendar) to add school events
- Writes events down in physical planners or on sticky notes
- Relies on memory after hearing about an event in class or seeing a flyer on campus
- Gets event details mixed up with personal or work calendars

### Problems they face:
- **Forgetting details** — remembering there's an event, but forgetting the room number or time
- **Inconsistent tracking** — some events are in a digital calendar, others are on paper
- **Context switching** — switching out of their academic workflow to log a simple study session
- **Missing academic context** — generic calendar apps don't let them easily link an event to a specific course (e.g., "CS 321 Review Session")

---

## 2. After Using MasonMate

### How our system helps:
- Provides a dedicated, distraction-free interface for adding academic events
- Keeps school events centralized within the same system that tracks classes and assignments
- Allows tagging events with specific courses (e.g., Study group for CS 321)
- Supports adding location (building/room or Zoom link) and detailed notes directly to the event

### What changes:
- All academic commitments are stored in one specialized app
- Adding an event takes only a few seconds without leaving the student's primary academic dashboard
- Students feel confident they won't forget where they need to be or what they need to bring

---

## 3. Storyboard

**Step 1:** Student is viewing their MasonMate dashboard and clicks the prominent **"Add Event"** button or icon  
**Step 2:** A clean modal or dedicated form opens asking for event details  
**Step 3:** Student enters the **Title** (e.g., "Group Project Meeting")  
**Step 4:** Student selects the **Date** from a date picker calendar  
**Step 5:** Student inputs the **Start Time** and **End Time**  
**Step 6:** (Optional) Student adds a **Location** (e.g., "Fenwick Library Room 2005") and any necessary **Notes** (e.g., "Bring laptop and notes")  
**Step 7:** Student clicks the **"Save Event"** button to submit the form  
**Step 8:** A brief success message appears, and the event immediately shows up on the student's Unified Academic Calendar  

---

## 4. Interaction Loop

| **Input** (What the user does) | **System** (What happens internally) | **Output** (What the user sees) |
|---|---|---|
| Clicks "Add Event" button | System prepares the event creation form/modal | Empty Add Event form appears |
| Enters title, date, start/end time, location, notes | System validates input fields in real-time (e.g., ensuring end time is after start time) | Text appears in fields; visual indicators confirm valid input |
| Clicks "Save Event" | System validates all required fields, creates a new event object, and saves it to the database linked to the user | Form closes, success notification ("Event Added!") appears |
| Returns to Calendar | System triggers a re-fetch of the calendar data to include the new event | The newly created event is rendered on the correct date on the calendar |

---

## 5. Edge Cases

- **Missing Required Fields** — User tries to save without a title or date: highlight the missing fields in red and disable the submit button until fixed
- **Invalid Dates/Times** — User selects an end time that occurs before the start time: error message prompts them to correct the time range
- **Past Events** — User adds an event for a date that has already passed: allow the action (for record-keeping) but show a subtle warning ("Note: This event is in the past")
- **Extremely Long Titles** — User enters a paragraph for the title: truncate visually in the form with an ellipsis, but save the full text
- **Network Disconnect** — User clicks save while offline: queue the creation locally and show a "Saved offline, will sync when connected" message, or show an explicit failure alert if offline saving isn't supported
- **Empty Optional Fields** — User doesn't provide location/notes: system handles null/empty values gracefully when displaying the event later
- **Concurrent Creation** — User double-clicks the "Save" button rapidly: implement button debouncing to prevent creating duplicate identical events in the database
