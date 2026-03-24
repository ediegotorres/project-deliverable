# Add Deadline

Allows students to track critical assignment due dates, project submissions, and exam times within their academic calendar.

---

## 1. Before Using MasonMate

### What the student currently does:
- Copies deadlines manually from class syllabi into planners at the start of the semester
- Constantly logs into Canvas/Blackboard just to check what is due tomorrow
- Relies on professor reminder emails or classmates mentioning upcoming work
- Uses generic to-do list apps (like Todoist or Apple Reminders) that aren't integrated with their class schedule

### Problems they face:
- **Surprise deadlines** — realizing an assignment is due at 11:59 PM when it's already 10:00 PM
- **Syllabus changes** — a professor moves a due date, but the student forgets to update their manual planner and does the work early or late
- **Prioritization paralysis** — having a big list of dates but struggling to figure out which assignment needs attention first based on weight or effort
- **Disconnection** — knowing a deadline exists but not having quick access to the details or submission link

---

## 2. After Using MasonMate

### How our system helps:
- Provides a specific workflow tailored for academic deadlines (Assignments, Projects, Exams)
- Directly links deadlines to specific enrolled courses, organizing them logically
- Visualizes deadlines alongside classes, making it obvious when a student has time to work on an assignment versus when they are busy in class
- Supports urgency indicators (e.g., setting a priority level or showing countdowns to the due date)

### What changes:
- Anxiety around remembering due dates completely disappears
- Students check one dashboard to see what tasks are upcoming
- When syllabus dates change, updating the deadline in MasonMate immediately reflects across the unified calendar
- Students can confidently prioritize their study sessions because all due dates are tracked in a structured way

---

## 3. Storyboard

**Step 1:** Student navigates to the MasonMate dashboard and clicks the prominent **"Add Deadline"** button  
**Step 2:** The system displays the Add Deadline form/modal  
**Step 3:** Student enters the **Title** of the assignment (e.g., "PA1: Shell Implementation")  
**Step 4:** Student selects the **Associated Course** from a dropdown list of their enrolled classes (e.g., "CS 367")  
**Step 5:** Student selects the **Deadline Type** (e.g., Assignment, Project, Quiz, Exam)  
**Step 6:** Student picks the **Due Date** and **Due Time** (often defaulting to 11:59 PM for assignments)  
**Step 7:** (Optional) Student adds a link to the assignment prompt or general **Notes**  
**Step 8:** Student clicks **"Create Deadline"** to save  
**Step 9:** A success toast appears, and the deadline is now visible on the unified calendar, often styled differently from regular events (e.g., as a highlighted bar or specific icon)  

---

## 4. Interaction Loop

| **Input** (What the user does) | **System** (What happens internally) | **Output** (What the user sees) |
|---|---|---|
| Clicks "Add Deadline" | System initializes deadline form and fetches the user's enrolled courses to populate the "Course" dropdown | Form appears containing empty fields and a populated course dropdown menu |
| Fills out title, course, type, date, and time | System performs client-side validation | Input fields populate; validation errors clear if any existed |
| Clicks "Create Deadline" | System validates all required fields, creates a new deadline record associated with the specific course and user, and saves to database | Form closes, "Deadline successfully added" notification appears |
| Views Dashboard/Calendar | System fetches updated deadline list and calculates time remaining (if applicable) | Deadline appears on the calendar on the correct date, color-coded based on the selected course or deadline type |

---

## 5. Edge Cases

- **Missing Course Association** — User tries to save without selecting a course: prompt them to select one or allow a "General/Unassigned" category if the system supports non-course tasks
- **Default Time Assumption** — User selects a date but forgets the time: default the time to 11:59 PM (end of day) which is standard for most university assignments, but allow easy editing
- **Duplicate Deadlines** — User accidentally enters the exact same assignment twice for the same class: warn the user "A deadline with this name already exists for this course" but allow bypass
- **Far Future Dates** — User enters a deadline for 3 years from now by mistake: accept it, but possibly show a mild confirmation warning if the date is outside the current academic semester timeline
- **No Active Courses** — User clicks "Add Deadline" but hasn't set up any classes yet: show a prompt inside the form suggesting "You haven't added any classes. Add a class first or save this as an unassigned task."
- **Offline Mode** — User loses connection while filling the form: store the draft locally so they don't lose their typed notes if the page refreshes
- **Date Format Confusion** — User types the date manually instead of using the picker and uses an ambiguous format (e.g., 03/04/2026): enforce strict formatting or only allow selection via the calendar widget to prevent database errors
