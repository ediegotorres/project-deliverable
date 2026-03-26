# Assignment and Exam Tracking

Giving students necessary reminders for upcoming assignments and exams. DEFAULT 2 days before due date. 

---

## 1. Before Using MasonMate

### What the student currently does:
- student has to memorize dates/write them on some other calendar/planner
- student has to repeatedly check for dates being moved
- student has to check dates from multiple sources (canvas, email, piazza, gradescope, etc)

### Problems they face:
- **Sudden Deadlines** — student realizes they have an upcoming assignment due soon, but don't know how to do it yet. student might have to submit it late
- **Deadline Changes** — a student's due date is moved but the student may not know or be notified
- **Confusion** - a student may have important assignments for different classes due on the same day and resultingly be confused between the two

---

## 2. After Using MasonMate

### The MasonMate Solution:
- Gives a singular "main" reminder space for deadlines (Exams, Assignments, Projects)
- Visualizes deadlines on a calendar, for easier lookup/comparison/notification
- Constant reminders so that student doesn't forget

### Results:
- Student is no longer hopping around between various platforms to check due dates
- Everything is centralized
- Student won't be confused between a due date that shares different assignments from different classes

---

## 3. Storyboard

**Step 1:** Student logs in to the MasonMate dashboard and choices to click **"Add Deadline", "Add Due Date", "Add Exam"** buttons  
**Step 2:** Student gives basic information of what is coming up, if its an exam/assignment, when its due, the class its for, etc
**Step 3:** The due date of assignment/exam is stored 
**Step 4:** A "Timer" that runs throughout the application senses when a period of only 48 hours remains until the deadline/exam and sends a reminder  

---

## 4. Interaction Loop

| **Input** (What the user does) | **System** (What happens internally) | **Output** (What the user sees) |
|---|---|---|
| Clicks "Add Deadline/Exam" | System gets ready to store data | Form appears with empty entry boxes |
| Student fills in information | System performs client-side validation | Boxes contain data |
| Student finalizes and submits | System makes a new deadline record for the student | Display of "Success!" |
| Student opens up MasonMate | System detects if 48 hour window has entered | If so, reminder pops up |

---

## 5. Edge Cases

- **Missing Data** — Student tries to save without filling out all fields: student will be prompted to exit or finish and fill all data out
- **Duplication** — Student enters the same assignment twice with identical information: block such attempt
- **Incorrect Data** — Student submits data that is wrong, such as an impossible date (March 528th, -2043) or a class they aren't part of: prompt user to give correct and feasible data
