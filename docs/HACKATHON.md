# PoleNova AI - Dora Hack 2.0

## Project
PoleNova AI

## One-line pitch
AI-powered real-time fault intelligence for rural electricity distribution networks.

## Problem
Rural distribution networks are incredibly difficult to monitor. Operators typically discover faults only after a customer calls to report an outage, or when field technicians manually drive out to inspect infrastructure. This leads to massive downtime, revenue loss, and safety risks.

## Solution
PoleNova AI brings modern telemetry and intelligence to rural grids. By deploying low-cost IoT sensors on poles, PoleNova collects real-time voltage, current, and temperature data. Our explainable AI engine continuously analyzes this data, instantly detecting faults, identifying the specific line segment affected, and explaining the probable cause to operators.

## Why now
Low-cost IoT hardware and high-speed telemetry (Socket.io) combined with rule-based AI allows us to retrofit legacy rural grids without requiring massive, expensive smart-grid overhauls. 

## Technical innovation
- **IoT-style sensor ingestion**: Simulates continuous telemetry streams via WebSockets.
- **Adjacent-pole analysis**: Determines fault locations by comparing voltage drops between sequential poles.
- **Explainable AI**: Doesn't just flag a fault—it explains the evidence (e.g., "98.3% voltage drop", "upstream pole healthy") and provides a confidence score.
- **Real-time Socket.io**: Live digital twin updates without page reloads.
- **Fault lifecycle**: Tracks a fault from detection, through assignment, to resolution and downtime calculation.

## Demo flow
1. **Dashboard Start**: Presenter logs in. The dashboard shows a healthy network (100% health, 0 faults).
2. **Trigger Scenario**: Using the Demo Controller, presenter triggers the "Broken Wire" scenario.
3. **Detection**: Sensor simulator introduces a voltage collapse at A-P004.
4. **Live Update**: The dashboard updates instantly. Network health drops. A-P004 turns red.
5. **AI Intelligence**: Presenter opens the Faults page, clicks "Run AI Detection", and views the **AI Explanation Panel**.
6. **Explanation**: The panel shows exactly why the fault was flagged (voltage drop evidence), calculates a 98% confidence score, and recommends dispatching a technician to the A-P003 -> A-P004 segment.
7. **Resolution**: Presenter acknowledges the fault, assigns it, and resolves it. The network returns to healthy.
8. **Analytics**: Show the Analytics page recording the event and updating severity distribution.

## Challenges
- Maintaining a live Socket.io connection without overwhelming the React state.
- Designing a deterministic, explainable AI algorithm that mimics real electrical fault physics rather than just randomly guessing.
- Managing state synchronization between the simulator and the database.

## Future scope
- **Real ML Models**: Upgrading the rule-based engine to a trained anomaly detection model using historical network data.
- **Real IoT Hardware**: Integrating actual ESP32/LoRaWAN sensors.
- **GIS Integration**: Replacing the topological view with real geographic maps (React Leaflet).
- **Predictive Maintenance**: Detecting slow degradation (e.g., insulator failure) before an outage occurs.
- **Utility Integrations**: Exporting alerts directly to existing utility work-order systems.
