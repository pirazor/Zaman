import {
  ALIGNMENT_TOLERANCE_DEGREES,
  distanceToKaabaKm,
  isAligned,
  KAABA,
  normalizeDegrees,
  qiblaBearing,
  shortestRotation,
  smoothHeading,
  turnAngle,
} from '../src/lib/qibla';

describe('qiblaBearing', () => {
  /**
   * Great-circle bearings to the Kaaba, as published for each city. A naive
   * flat-map calculation gets New York wrong by roughly 30°, so these values
   * are what guards against that class of error.
   */
  const CITIES = [
    { name: 'Istanbul', position: { latitude: 41.0082, longitude: 28.9784 }, bearing: 151.6 },
    { name: 'London', position: { latitude: 51.5074, longitude: -0.1278 }, bearing: 119.0 },
    { name: 'New York', position: { latitude: 40.7128, longitude: -74.006 }, bearing: 58.5 },
    { name: 'Jakarta', position: { latitude: -6.2088, longitude: 106.8456 }, bearing: 295.2 },
    { name: 'Cape Town', position: { latitude: -33.9249, longitude: 18.4241 }, bearing: 23.4 },
  ];

  it.each(CITIES)('points $bearing° from north in $name', ({ position, bearing }) => {
    expect(qiblaBearing(position)).toBeCloseTo(bearing, 0);
  });

  it('always returns a bearing within a full turn', () => {
    for (const { position } of CITIES) {
      const bearing = qiblaBearing(position);
      expect(bearing).toBeGreaterThanOrEqual(0);
      expect(bearing).toBeLessThan(360);
    }
  });
});

describe('distanceToKaabaKm', () => {
  it('is zero at the Kaaba itself', () => {
    expect(distanceToKaabaKm(KAABA)).toBeCloseTo(0, 3);
  });

  it('matches known great-circle distances', () => {
    expect(distanceToKaabaKm({ latitude: 41.0082, longitude: 28.9784 })).toBeCloseTo(2405, -2);
    expect(distanceToKaabaKm({ latitude: 51.5074, longitude: -0.1278 })).toBeCloseTo(4794, -2);
    expect(distanceToKaabaKm({ latitude: 40.7128, longitude: -74.006 })).toBeCloseTo(10306, -2);
  });
});

describe('turnAngle', () => {
  it('is positive when the user must turn clockwise', () => {
    expect(turnAngle(0, 90)).toBe(90);
  });

  it('is negative when the user must turn anticlockwise', () => {
    expect(turnAngle(90, 0)).toBe(-90);
  });

  it('always takes the short way round', () => {
    // Facing 350°, a target of 10° is 20° to the right, not 340° to the left.
    expect(turnAngle(350, 10)).toBe(20);
    expect(turnAngle(10, 350)).toBe(-20);

    for (let heading = 0; heading < 360; heading += 7) {
      for (let bearing = 0; bearing < 360; bearing += 11) {
        const turn = turnAngle(heading, bearing);
        expect(turn).toBeGreaterThan(-180);
        expect(turn).toBeLessThanOrEqual(180);
      }
    }
  });
});

describe('isAligned', () => {
  it('accepts headings inside the tolerance', () => {
    expect(isAligned(150, 151.6)).toBe(true);
    expect(isAligned(151.6, 151.6)).toBe(true);
  });

  it('rejects headings outside it', () => {
    expect(isAligned(120, 151.6)).toBe(false);
  });

  it('handles alignment across north', () => {
    expect(isAligned(359, 1)).toBe(true);
    expect(isAligned(1, 359)).toBe(true);
  });

  it('honours the boundary exactly', () => {
    expect(isAligned(0, ALIGNMENT_TOLERANCE_DEGREES)).toBe(true);
    expect(isAligned(0, ALIGNMENT_TOLERANCE_DEGREES + 0.1)).toBe(false);
  });
});

describe('normalizeDegrees', () => {
  it('wraps any angle into a single turn', () => {
    expect(normalizeDegrees(0)).toBe(0);
    expect(normalizeDegrees(360)).toBe(0);
    expect(normalizeDegrees(-90)).toBe(270);
    expect(normalizeDegrees(450)).toBe(90);
    expect(normalizeDegrees(-450)).toBe(270);
  });
});

describe('shortestRotation', () => {
  it('unwraps past the 0/360 boundary so the dial never spins backwards', () => {
    // Rotating from 350° to 10° must continue to 370°, not back to 10°.
    expect(shortestRotation(350, 10)).toBe(370);
    expect(shortestRotation(10, 350)).toBe(-10);
  });

  it('keeps accumulating across repeated turns', () => {
    let value = 0;
    for (const target of [90, 180, 270, 0, 90]) {
      value = shortestRotation(value, target);
    }
    expect(normalizeDegrees(value)).toBe(90);
  });

  it('never moves more than half a turn in one step', () => {
    for (let current = -720; current <= 720; current += 37) {
      for (let target = 0; target < 360; target += 13) {
        expect(Math.abs(shortestRotation(current, target) - current)).toBeLessThanOrEqual(180);
      }
    }
  });
});

describe('smoothHeading', () => {
  it('moves towards the new reading without jumping to it', () => {
    const result = smoothHeading(0, 100, 0.2);
    expect(result).toBeCloseTo(20, 5);
  });

  it('smooths across the 0/360 boundary without a full sweep', () => {
    // Half way from 350° to 10° is 0°, not 180°.
    expect(smoothHeading(350, 10, 0.5)).toBeCloseTo(0, 5);
  });

  it('always returns a value within a single turn', () => {
    let heading = 359;
    for (const reading of [5, 15, 350, 200, 10]) {
      heading = smoothHeading(heading, reading);
      expect(heading).toBeGreaterThanOrEqual(0);
      expect(heading).toBeLessThan(360);
    }
  });

  it('converges on a steady reading', () => {
    let heading = 0;
    for (let i = 0; i < 200; i += 1) heading = smoothHeading(heading, 120);
    expect(heading).toBeCloseTo(120, 1);
  });
});
