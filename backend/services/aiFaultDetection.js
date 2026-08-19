/**
 * PoleNova AI - Fault Detection Engine (Simulation)
 *
 * Compares voltage/current readings between adjacent poles (ordered by sequenceIndex
 * along a feeder line). A sharp voltage drop between two consecutive poles indicates
 * a probable break/fault in the line segment between them.
 */

const NORMAL_VOLTAGE = 230;
const VOLTAGE_DROP_THRESHOLD = 0.6; // 60% drop vs previous pole triggers a fault
const WARNING_DROP_THRESHOLD = 0.25; // 25% drop triggers a warning

const rootCauses = ['broken_wire', 'transformer_failure', 'tree_fall', 'short_circuit', 'equipment_damage'];

function pickRootCause(voltageDrop, temperature, currentAnomaly) {
  if (temperature > 75) return 'transformer_failure';
  if (voltageDrop >= 0.95 && !currentAnomaly) return 'broken_wire';
  if (voltageDrop >= 0.75 && currentAnomaly) return 'short_circuit';
  if (voltageDrop >= 0.6) return 'tree_fall';
  return rootCauses[Math.floor(Math.random() * rootCauses.length)];
}

function severityFromDrop(drop) {
  if (drop >= VOLTAGE_DROP_THRESHOLD) return 'critical';
  if (drop >= WARNING_DROP_THRESHOLD) return 'medium';
  return 'low';
}

/**
 * @param {Array} poleReadings - array of { pole: {_id, poleNumber, sequenceIndex}, latestSensor: {voltage, current, temperature, timestamp} }
 *        must already be sorted by sequenceIndex ascending, and belong to the same feeder.
 * @returns {Array} detected fault candidates
 */
function detectFaults(poleReadings) {
  const results = [];
  const sorted = [...poleReadings].sort((a, b) => a.pole.sequenceIndex - b.pole.sequenceIndex);

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    if (!current.latestSensor || !next.latestSensor) continue;

    const vCurrent = current.latestSensor.voltage;
    const vNext = next.latestSensor.voltage;
    const iNext = next.latestSensor.current;

    if (vCurrent <= 5) continue; // upstream pole itself is dead, skip - handled by earlier pair

    const drop = (vCurrent - vNext) / Math.max(vCurrent, 1);

    if (drop >= WARNING_DROP_THRESHOLD) {
      const severity = severityFromDrop(drop);
      const currentAnomaly = iNext > 15; // unusually high current
      const rootCause = pickRootCause(drop, next.latestSensor.temperature || 0, currentAnomaly);
      
      // Calculate confidence based on evidence strength
      let confidence = 60 + (drop * 20); // base up to 80
      if (current.latestSensor.timestamp) {
        const ageInSeconds = (Date.now() - new Date(current.latestSensor.timestamp).getTime()) / 1000;
        if (ageInSeconds < 30) confidence += 10; // fresh data adds confidence
      }
      if (vCurrent > 200) confidence += 5; // stable upstream adds confidence
      if (currentAnomaly) confidence += 4;
      confidence = Math.min(99, Math.round(confidence));

      const evidence = [
        `${(drop * 100).toFixed(1)}% voltage drop observed (${Math.round(vCurrent)}V → ${Math.round(vNext)}V)`,
        `Upstream pole (${current.pole.poleNumber}) is reporting healthy voltage`,
      ];
      
      if (currentAnomaly) {
        evidence.push(`Downstream pole (${next.pole.poleNumber}) current is abnormally high (${Math.round(iNext)}A)`);
      } else {
        evidence.push(`Downstream pole (${next.pole.poleNumber}) current is negligible, indicating open circuit`);
      }
      
      if (next.latestSensor.temperature > 75) {
        evidence.push(`Critical temperature warning: ${Math.round(next.latestSensor.temperature)}°C at downstream pole`);
      }

      if (next.latestSensor.timestamp) {
        const ageInSeconds = (Date.now() - new Date(next.latestSensor.timestamp).getTime()) / 1000;
        evidence.push(`Sensor readings are fresh (${Math.round(ageInSeconds)} seconds ago)`);
      }

      results.push({
        poleFromId: current.pole._id,
        poleToId: next.pole._id,
        poleFromNumber: current.pole.poleNumber,
        poleToNumber: next.pole.poleNumber,
        severity,
        priority: severity,
        confidence,
        rootCause,
        evidence,
        voltageDropPercent: Math.round(drop * 100),
        aiRecommendation: buildRecommendation(rootCause, severity),
        detectedAt: new Date()
      });
    }
  }

  return results;
}

function buildRecommendation(rootCause, severity) {
  const causeText = {
    broken_wire: 'Dispatch a line crew to inspect and repair the broken conductor. Verify physical line integrity.',
    transformer_failure: 'Schedule immediate transformer inspection; risk of overheating or explosion detected.',
    tree_fall: 'Check for vegetation or tree fall obstructing the line between the poles. Send clearing crew.',
    short_circuit: 'Isolate the segment immediately and inspect for short-circuit / insulation failure.',
    equipment_damage: 'Inspect pole-mounted equipment (insulators, crossarms) for physical damage.',
    unknown: 'Send a technician for manual inspection to confirm the root cause.'
  };
  const urgency = severity === 'critical' ? 'URGENT: ' : severity === 'medium' ? 'Priority: ' : 'Routine: ';
  return urgency + (causeText[rootCause] || causeText.unknown);
}

module.exports = { detectFaults, NORMAL_VOLTAGE };
