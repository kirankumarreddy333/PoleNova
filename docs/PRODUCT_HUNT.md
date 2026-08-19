# PoleNova AI - Product Hunt Launch

## Product Name
PoleNova AI

## Tagline
AI-powered fault intelligence for rural electricity networks.

## Description
PoleNova AI is a decision-support and monitoring platform designed for rural electricity distribution companies. By combining low-cost pole sensors with an explainable AI engine, PoleNova detects line faults instantly, isolates the exact segment, and provides field crews with the probable cause and a confidence score. Reduce downtime, improve safety, and upgrade legacy grids without enterprise SCADA costs.

## Target Audience
- Rural DISCOMs (Distribution Companies)
- Utility maintenance teams
- Infrastructure operators

## Launch Message
"Hey Product Hunt! 👋 We built PoleNova AI to solve a massive problem in rural infrastructure: operators are blind to power outages until a customer complains. We've combined real-time telemetry (Socket.io) with an explainable AI engine to instantly detect and locate line breaks. Check out our live digital twin demo and let us know what you think!"

## Maker Story
"We noticed that while smart cities get all the funding for advanced grid tech, rural areas are left relying on customer phone calls and manual truck rolls. We wanted to build a lightweight, MERN-stack alternative that proves you can achieve intelligent fault detection with low-cost sensors and clever adjacent-pole algorithms."

## Demo Video Script
*(Screen recording of the dashboard)*
1. Start with the healthy 100% network.
2. Trigger the "Broken Wire" scenario.
3. Show the live telemetry updating and the exact pole turning critical.
4. Open the AI Fault Intelligence panel.
5. Highlight the "Why was this flagged?" evidence and 94% confidence score.
6. Resolve the fault.

## FAQ
**Q: Does this autonomously control the grid?**
A: No. PoleNova is a decision-support tool. It flags anomalies and provides explainable recommendations for human operators to dispatch crews safely.

**Q: Is the AI a trained ML model?**
A: For this MVP, we use an explainable, deterministic rule-based engine (comparing adjacent-pole voltage drops). Future versions will incorporate Autoencoders for predictive anomaly detection based on historical data.
