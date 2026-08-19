const { detectFaults } = require('../services/aiFaultDetection');

describe('AI Fault Detection', () => {
  it('should detect a critical fault on a 98% voltage drop', () => {
    const readings = [
      {
        pole: { _id: '1', poleNumber: 'A-P001', sequenceIndex: 1 },
        latestSensor: { voltage: 238, current: 7, temperature: 30, timestamp: new Date() }
      },
      {
        pole: { _id: '2', poleNumber: 'A-P002', sequenceIndex: 2 },
        latestSensor: { voltage: 4, current: 0.5, temperature: 30, timestamp: new Date() }
      }
    ];

    const faults = detectFaults(readings);
    
    expect(faults.length).toBe(1);
    expect(faults[0].severity).toBe('critical');
    expect(faults[0].voltageDropPercent).toBeGreaterThan(95);
    expect(faults[0].confidence).toBeGreaterThan(80);
  });

  it('should ignore normal voltage drops', () => {
    const readings = [
      {
        pole: { _id: '1', poleNumber: 'A-P001', sequenceIndex: 1 },
        latestSensor: { voltage: 235, current: 7, temperature: 30 }
      },
      {
        pole: { _id: '2', poleNumber: 'A-P002', sequenceIndex: 2 },
        latestSensor: { voltage: 230, current: 7, temperature: 30 }
      }
    ];

    const faults = detectFaults(readings);
    
    expect(faults.length).toBe(0);
  });
});
