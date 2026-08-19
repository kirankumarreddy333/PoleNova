<div align="center">
  <img src="https://via.placeholder.com/150x150/1e293b/38bdf8?text=PoleNova+AI" alt="PoleNova AI Logo" />
  <h1>PoleNova AI</h1>
  <p><b>AI-powered real-time fault intelligence for rural electricity distribution networks.</b></p>
</div>

---

## ⚡ The Problem
Rural electricity distribution networks are incredibly difficult to monitor. Operators typically discover faults only after a customer calls to report an outage, or when technicians manually drive out to inspect infrastructure. This leads to massive downtime and safety risks.

## 💡 The Solution
PoleNova AI brings modern telemetry and intelligence to rural grids. By deploying low-cost IoT sensors on poles, PoleNova collects real-time voltage, current, and temperature data. Our explainable AI engine continuously analyzes this data, instantly detecting faults, identifying the specific line segment affected, and explaining the probable cause to operators.

## 🚀 Key Features
- **Live Digital Twin**: Real-time Socket.io telemetry visualization of your entire feeder network.
- **Explainable AI Detection**: Adjacent-pole comparative analysis isolates faults with a human-readable evidence trail and confidence score.
- **Hackathon Demo Mode**: Built-in scenario controller to simulate broken wires, transformer overheating, and voltage instability live.
- **Fault Lifecycle Management**: Track faults from detection, to technician assignment, to resolution.
- **Analytics**: Built-in Recharts dashboards for historical severity and root-cause tracking.

## 🏗️ Architecture
**Frontend**: React, Vite, TailwindCSS, Recharts  
**Backend**: Node.js, Express, MongoDB, Socket.io  
**Intelligence**: Rule-based adjacent-pole comparative engine  

See the full [Architecture Documentation](docs/ARCHITECTURE.md) and [AI Documentation](docs/AI_FAULT_DETECTION.md).

## 🎮 Running the Demo

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URI)

### Local Setup
1. Clone the repository.
2. Setup the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env # Add your MONGO_URI
   npm run seed # Seeds the database with the demo network
   npm run start
   ```
3. Setup the frontend:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

### 🎯 The 3-Minute Hackathon Scenario
1. Login to the dashboard (credentials provided in seed output).
2. Look at the **Demo Controller** on the bottom right.
3. Click **Start** to begin the live telemetry simulation.
4. Click **Broken Wire** to trigger a severe voltage collapse at pole A-P004.
5. Watch the dashboard update live. Go to **Faults** and click **Run AI Detection**.
6. View the generated **AI Explanation Panel** to see the confidence score and evidence.
7. Resolve the fault and click **Reset** in the Demo Controller to return to a healthy state.

## 📚 Documentation Links
- [Hackathon Pitch & Script](docs/HACKATHON.md)
- [API Reference](docs/API.md)
- [Product Vision](docs/PRODUCT.md)

## ⚠️ Limitations
- **Demo Data**: The current repository uses a backend simulation service to generate sensor telemetry. Real IoT hardware integration is scoped for future development.
- **Explainable AI**: The AI engine uses a deterministic algorithm, not a trained neural network, to prioritize explainability and operator trust for this MVP.
