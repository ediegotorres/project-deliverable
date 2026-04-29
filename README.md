# MasonMate

MasonMate is a web-based academic scheduling tool that helps students manage classes, assignments, deadlines, and events in one place.

## Features
- **Unified Academic Calendar**: See all classes, assignments, exams, and events in one place.
- **Assignment & Exam Tracking**: Keep track of deadlines across all courses.
- **Task Prioritization**: Automatically sort assignments based on their grade weight and course importance (powered by the Express backend).
- **Event Manager**: Track extracurriculars separately but view them alongside academic tasks.

## Tech Stack
- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (via Prisma ORM)

## Local Development Setup

To run MasonMate locally, you need to start both the backend server and the frontend client.

### 1. Start the Backend

Open a terminal and run the following commands:
```bash
cd backend
npm install
# Generate Prisma client and apply database migrations
npx prisma generate
npx prisma db push
# Start the Express server (runs on http://localhost:3001)
npm run dev
```

### 2. Start the Frontend

Open a second terminal and run:
```bash
cd frontend
npm install
# Start the Vite development server (proxies /api to the backend)
npm run dev
```

The application should now be running at `http://localhost:5173`.
