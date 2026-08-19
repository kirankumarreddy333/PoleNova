# AI Fault Detection

## Current Implementation: Explainable Rule-Based Intelligence

The current PoleNova AI engine uses a deterministic, rule-based algorithm focusing on **adjacent-pole comparison**.

### Why Adjacent-Pole Comparison?
In a radial distribution network, electricity flows sequentially from a transformer down a line of poles. If Pole A has 230V and Pole B has 4V, the physical fault (a broken wire, blown fuse, or short circuit) is almost certainly located in the segment between Pole A and Pole B. 

### Core Formulas & Thresholds
- **Voltage Drop**: `drop = (voltage[i] - voltage[i+1]) / max(voltage[i], 1)`
- **Warning Threshold**: 25% drop
- **Critical Threshold**: 60% drop

### Confidence Calculation
Confidence is not a random number. It is built by accumulating evidence:
1. Base score derived from the magnitude of the voltage drop.
2. +10% if the sensor data is fresh (received < 30 seconds ago).
3. +5% if the upstream pole is highly stable (> 200V).
4. +4% if current anomalies corroborate the voltage drop.

### Temperature & Current Logic
- If downstream temperature > 75°C, the system flags a probable **Transformer Failure**.
- If voltage drops severely but downstream current is abnormally high, it indicates a **Short Circuit**.
- If downstream current drops to 0 alongside voltage, it indicates a **Broken Wire** (open circuit).

### Why Explainability Matters
Utility operators do not trust "black box" AI. PoleNova generates an **Evidence Array** (e.g., "Upstream pole is reporting healthy voltage") to justify its recommendations, building trust with the human operator.

---

## Limitations
- Relies heavily on accurate sequence mapping (`sequenceIndex`).
- Currently assumes a simple radial feeder topology, not complex meshed networks.
- Rule-based heuristics cannot detect subtle, long-term degradation.

## Future: Machine Learning Anomaly Detection
The next evolution of PoleNova will involve training an Isolation Forest or Autoencoder model on historical, normal network telemetry. This will allow the system to detect anomalous pre-fault conditions (e.g., a gradual increase in operating temperature correlated with slight voltage sags) to predict outages *before* they occur.
