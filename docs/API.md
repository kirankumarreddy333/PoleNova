# PoleNova AI - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication (`/api/auth`)

### POST `/api/auth/register`
Register a new user.
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password", "role": "engineer" }`
- **Response**: `{ "success": true, "token": "jwt_token", "user": { ... } }`

### POST `/api/auth/login`
Login existing user.
- **Body**: `{ "email": "john@example.com", "password": "password" }`
- **Response**: `{ "success": true, "token": "jwt_token", "user": { ... } }`

## Dashboard (`/api/dashboard`)

### GET `/api/dashboard/overview`
Get aggregated statistics and recent alerts.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "success": true, "data": { "totalPoles": 16, "healthyPoles": 16, "networkHealthPercent": 100, ... } }`

### GET `/api/dashboard/trends`
Get recent telemetry for charting.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "success": true, "data": [ ... ] }`

## Faults (`/api/faults`)

### GET `/api/faults`
List faults with optional filtering.
- **Query**: `?status=open&severity=critical`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "success": true, "data": [ ... ] }`

### POST `/api/faults/detect`
Run the AI Fault Engine across the entire network.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "success": true, "detected": 1, "created": 1, "data": [ ... ] }`

### PUT `/api/faults/:id`
Update a fault (e.g. acknowledge, resolve).
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "status": "resolved" }`
- **Response**: `{ "success": true, "data": { ... } }`

## Simulation (`/api/simulation`)

### POST `/api/simulation/start`
Start the continuous telemetry simulation.

### POST `/api/simulation/stop`
Stop the simulation.

### POST `/api/simulation/scenario`
Change the active scenario.
- **Body**: `{ "scenario": "broken_wire" }`

### POST `/api/simulation/reset`
Reset the network to a healthy state (deletes open faults).
