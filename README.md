# PoleNova AI — MVP

AI-based intelligent distribution network monitoring system for rural DISCOMs, built on the MERN stack.

This is the **MVP scope**: authentication, pole CRUD, sensor data, AI fault detection (adjacent-pole comparison), and real-time updates via Socket.io. Maps, PDF/Excel reports, and the full admin panel are not included yet — see "What's next" below.

## Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Framer Motion, Axios, Recharts, Socket.io-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io, JWT, bcrypt
- **Database:** MongoDB (local or Atlas)

## Project Structure

```
polenova-ai/
├── backend/
│   ├── config/db.js
│   ├── models/          User, Pole, Sensor, Fault
│   ├── controllers/      auth, pole, sensor, fault, dashboard
│   ├── routes/
│   ├── middleware/       auth (JWT + role-based), errorHandler
│   ├── services/         aiFaultDetection.js  ← the AI logic
│   ├── socket/           socketHandler.js
│   ├── seed/             seed.js, sensorSimulator.js
│   └── server.js
└── frontend/
    └── src/
        ├── pages/         Landing, Login, Register, Dashboard, Poles, PoleDetails, Faults, NotFound
        ├── components/    Sidebar, Navbar, StatCard, PoleFormModal, LiveClock, ProtectedRoute
        ├── context/       AuthContext.jsx
        └── services/      api.js, socket.js
```

## 1. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## 2. Backend Setup

```bash
cd backend
cp .env.example .env
# edit .env if needed (MONGO_URI, JWT_SECRET, etc.)
npm install
npm run seed      # creates demo users + 16 poles + initial sensor readings
npm run dev        # starts the API on http://localhost:5000
```

Demo login credentials (created by `npm run seed`):

| Role        | Email                    | Password    |
|-------------|---------------------------|-------------|
| Super Admin | superadmin@polenova.ai   | password123 |
| Admin       | admin@polenova.ai        | password123 |
| Engineer    | engineer@polenova.ai     | password123 |
| Technician  | technician@polenova.ai   | password123 |

In a **second terminal**, optionally run the live sensor simulator (keeps generating fresh readings every 5s, so the dashboard and Socket.io feel real-time):

```bash
cd backend
npm run simulate
```

The seed data intentionally creates a fault between poles **A-P003 → A-P004** (0V readings) so you have something to detect immediately.

## 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev        # starts on http://localhost:5173
```

## 4. Try it out

1. Open `http://localhost:5173`, click **Get Started** and register, or log in with a demo account.
2. Go to **Dashboard** — overview cards, voltage/current/temperature charts, network health.
3. Go to **Poles** — search, filter by status, add/edit/delete poles.
4. Click a pole to see **Pole Details** with its voltage history.
5. Go to **Faults** → click **Run AI Detection**. The AI engine compares voltage between adjacent poles (by `sequenceIndex` within the same feeder) and flags a fault where there's a sharp drop — exactly like the Pole 2/Pole 3 example in the spec. It creates a Fault record with severity, confidence, root cause, and a recommendation.
6. Mark faults **In Progress** / **Resolved** — pole status updates automatically.
7. With the simulator running, watch the dashboard update live without refreshing (Socket.io).

## How the AI Fault Detection Works

`backend/services/aiFaultDetection.js` sorts poles on the same feeder by `sequenceIndex`, then for every adjacent pair computes the percentage voltage drop:

```
drop = (voltage[i] - voltage[i+1]) / voltage[i]
```

- `drop >= 60%` → **critical** severity fault
- `drop >= 25%` → **medium** severity fault
- otherwise → no fault reported

Root cause is inferred heuristically (e.g. very high temperature → transformer failure, near-total drop → broken wire) and a plain-language recommendation is generated. This mirrors the "AI identifies faults between adjacent poles" requirement using genuine, explainable logic — not a black box — which is easy to explain during a viva/defense.

## API Overview

| Method | Route                          | Description                              |
|--------|---------------------------------|-------------------------------------------|
| POST   | /api/auth/register              | Register user                             |
| POST   | /api/auth/login                 | Login, returns JWT                        |
| GET    | /api/auth/me                    | Get current user                          |
| POST   | /api/auth/forgot-password       | Generate reset token (email simulated)    |
| PUT    | /api/auth/reset-password/:token | Reset password                            |
| PUT    | /api/auth/profile               | Update profile                            |
| GET/POST | /api/poles                    | List / create poles                       |
| GET/PUT/DELETE | /api/poles/:id           | Pole details / update / delete            |
| GET/POST | /api/sensors                  | Latest reading per pole / ingest reading  |
| GET    | /api/sensors/:poleId             | Sensor history for a pole                 |
| GET    | /api/faults                      | List faults (filter by status/severity)   |
| POST   | /api/faults/detect               | Run AI fault detection                    |
| PUT/DELETE | /api/faults/:id               | Update / delete a fault                   |
| GET    | /api/dashboard/overview          | Stats for dashboard cards                 |
| GET    | /api/dashboard/trends            | Recent sensor readings for charts         |

All routes except `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/reset-password/:token` require `Authorization: Bearer <token>`.

## What's Next (Phase 2+)

This MVP intentionally skips:
- Interactive map (React Leaflet) with pole markers
- PDF/Excel/CSV report generation and export
- Full admin panel (manage users/roles, system logs)
- Email sending via Nodemailer (currently simulated — the reset token is returned directly in the API response)
- Toast/browser notifications and an alert panel with unread counts
- Analytics page (monthly/yearly fault trends, AI accuracy, downtime)

Ask to continue with any of these and I'll build them on top of this foundation.
