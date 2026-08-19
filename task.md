# PoleNova AI Upgrade Tasks

- `[x]` Backend Implementation
  - `[x]` Modify `aiFaultDetection.js` for detailed evidence and confidence formula
  - `[x]` Modify `Fault.js` model for assigned technician, notes, evidence array, confidence
  - `[x]` Move simulator to `backend/services/simulationService.js` and support scenarios
  - `[x]` Create `backend/controllers/simulationController.js` and `backend/routes/simulationRoutes.js`
  - `[x]` Modify `faultController.js` to handle fault updates and assignment
  - `[x]` Update `server.js` with new routes

- `[x]` Frontend Implementation
  - `[x]` Implement `DemoController.jsx`
  - `[x]` Upgrade `Dashboard.jsx` (Network Health, LIVE indicator, Alert Center)
  - `[x]` Implement `NetworkVisualization.jsx` (Custom CSS graph)
  - `[x]` Upgrade `Faults.jsx` and add `AiExplanationPanel.jsx`
  - `[x]` Add `Analytics.jsx`
  - `[x]` Upgrade `Poles.jsx` and `PoleDetails.jsx`
  - `[x]` Complete rewrite of `Landing.jsx`

- `[x]` Testing & Security
  - `[x]` Add unit tests for `aiFaultDetection.js`
  - `[x]` Add database indexes

- `[x]` Documentation
  - `[x]` `docs/API.md`
  - `[x]` `docs/ARCHITECTURE.md`
  - `[x]` `docs/AI_FAULT_DETECTION.md`
  - `[x]` `docs/PRODUCT.md`, `docs/PRODUCT_HUNT.md`
  - `[x]` `docs/HACKATHON.md`, `docs/PITCH.md`, `docs/USER_VALIDATION.md`, `docs/CONTENT_PLAN.md`
  - `[x]` Rewrite `README.md`

- `[x]` Verification
  - `[x]` Run Backend and Frontend build
  - `[x]` Prepare git commits and instruct user
