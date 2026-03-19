# Proposed Logic: Task Prioritization Algorithm

To automatically sort a student's tasks effectively, the Scheduling Module will calculate a **Priority Score** for each upcoming assignment using the following formula:

**Priority Score = (Weight % × 10) + (Urgency Multiplier) + Class Importance (1-10)**

* **Weight %:** How much the assignment affects the final grade (e.g., a 20% final exam is heavily prioritized).
* **Urgency Multiplier:** A dynamic score based on the due date.
  * *Due within 24 hours = +15 points*
  * *Due within 3 days = +10 points*
  * *Due within 7 days = +5 points*
* **Class Importance:** A custom value (1-10) set by the user based on how difficult the class is for them.

The dashboard will sort the "To-Do List" by the highest **Priority Score** first, ensuring that students focus on urgent, high-impact assignments before smaller, less important tasks.
