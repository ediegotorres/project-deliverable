# 🔥 Firebase Setup Guide — MasonMate

Follow these steps to get Firebase + Firestore running for any team member.

---

## Step 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**
3. Name it (e.g. `masonmate-dev`)
4. Disable Google Analytics if you don't need it → click **Create project**

---

## Step 2 — Register a Web App

1. On the project overview page, click the **`</>`** (Web) icon
2. Enter an app nickname (e.g. `MasonMate Web`)
3. **Do not** check "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see a `firebaseConfig` object — **copy these values**:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

---

## Step 3 — Enable Firestore

1. In the left sidebar, click **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (allows all reads/writes for 30 days)
4. Pick a region (e.g. `us-east1`) → click **Enable**

---

## Step 4 — Configure Your Local Environment

1. In the `frontend/` directory, create a file named **`.env.local`**
2. Paste in your values from the `firebaseConfig` object:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Never commit `.env.local` to git.** It is already covered by `*.local` in `.gitignore`.

---

## Step 5 — Install Dependencies & Run

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — you're live!

---

## Project File Reference

| File | Purpose |
|---|---|
| `frontend/src/firebase.ts` | Initializes Firebase app & exports `db` |
| `frontend/src/types/Event.ts` | `CalendarEvent` TypeScript interface |
| `frontend/src/services/eventService.ts` | CRUD + real-time listener functions |
| `frontend/src/Calendar.jsx` | UI wired to Firestore |
| `firestore.rules` | Firestore security rules (deploy via Firebase CLI) |

---

## Deploying Security Rules (Optional)

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # point to existing project
firebase deploy --only firestore:rules
```

---

## Notes

- Events are stored in the **`events`** Firestore collection
- The calendar subscribes to live updates via `onSnapshot` — no page refresh needed
- Current rules allow all reads/writes — lock down with Firebase Auth before going to production
