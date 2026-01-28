import { THICKNESS_REFERENCES, FRAME_EFFECTS, SPECIAL_MANUFACTURE_THRESHOLD, HIGH_POWER_INTERPOLATION_START } from '../data/thicknessReferences.js';

export function interpolateInRange(references, targetDiopter, minDiopter, maxDiopter) {
  if (!references || Object.keys(references).length === 0) return null;
  const diopters = Object.keys(references)
    .filter(k => {
      const d = parseFloat(k);
      return d >= minDiopter && d <= maxDiopter;
    })
    .map(d => parseFloat(d))
    .sort((a, b) => a - b);
  if (diopters.length < 2) return null;
  const lowerBound = diopters.find(d => d <= targetDiopter);
  const upperBound = diopters.find(d => d > targetDiopter);
  if (!lowerBound || !upperBound) return null;
  const lowerThickness = references[lowerBound];
  const upperThickness = references[upperBound];
  const ratio = (targetDiopter - lowerBound) / (upperBound - lowerBound);
  return {
    center: lowerThickness.center + ratio * (upperThickness.center - lowerThickness.center),
    edge: lowerThickness.edge + ratio * (upperThickness.edge - lowerThickness.edge),
    total: lowerThickness.total + ratio * (upperThickness.total - lowerThickness.total),
    source: 'interpolation',
  };
}

export function interpolateHighPower(thicknessAt6D, diopter) {
  const exponent = 1.15;
  const factor = Math.pow(diopter / 6, exponent);
  return {
    center: thicknessAt6D.center * factor,
    edge: thicknessAt6D.edge * factor,
    total: thicknessAt6D.total * factor,
    source: 'exponential-interpolation',
  };
}

export function getThicknessAt6D(index) {
  const ref = THICKNESS_REFERENCES[index];
  if (!ref || !ref['6.00']) return null;
  return ref['6.00'];
}

export function getReferenceThickness(index, diopter) {
  const ref = THICKNESS_REFERENCES[index];
  if (!ref) return null;
  const diopterKey = diopter.toString();
  if (ref[diopterKey]) {
    return ref[diopterKey];
  }
  if (diopter >= 0 && diopter <= 6) {
    return interpolateInRange(ref, diopter, 0, 6);
  }
  if (diopter > 6 && diopter <= 20) {
    const baseThickness = getThicknessAt6D(index);
    if (!baseThickness) return null;
    return interpolateHighPower(baseThickness, diopter);
  }
  return null;
}

export function applyIndexFactor(thickness, targetIndex) {
  if (!thickness) return null;
  if (targetIndex === '1.50') return thickness;
  const factors = THICKNESS_REFERENCES;
  const factor = factors[targetIndex];
  if (!factor || !factor.factor) return thickness;
  return {
    center: thickness.center * factor.factor,
    edge: thickness.edge * factor.factor,
    total: thickness.total * factor.factor,
    baseIndex: factor.baseIndex,
  };
}

export function applyFrameEffect(thickness, frameSize) {
  if (!thickness) return null;
  const frame = FRAME_EFFECTS[frameSize] || FRAME_EFFECTS['medium'];
  return {
    center: thickness.center * frame.factor,
    edge: thickness.edge * frame.factor,
    total: thickness.total * frame.factor,
  };
}

export function applyCylEffect(baseThickness, cyl, axis) {
  if (!baseThickness) return null;
  if (cyl === 0) return baseThickness;
  const cylFactor = 1 + (Math.abs(cyl) * 0.2);
  const axisFactor = (axis === 0 || axis === 180 || axis === 90) ? 1.05 : 1.0;
  return {
    center: baseThickness.center * cylFactor * axisFactor,
    edge: baseThickness.edge * cylFactor * axisFactor,
    total: baseThickness.total * cylFactor * axisFactor,
  };
}

export function checkSpecialManufacture(diopter) {
  const absDiopter = Math.abs(diopter);
  if (absDiopter >= SPECIAL_MANUFACTURE_THRESHOLD) {
    return {
      special: true,
      message: 'Bu numara özel üretim gerektirir',
      estimatedTime: '7-14 gün',
    };
  }
  return { special: false };
}

export function calculateLensThickness(prescription, lensIndex, frameSize) {
  const maxSph = Math.max(
    Math.abs(prescription.right.sph || 0),
    Math.abs(prescription.left.sph || 0)
  );
  const maxCyl = Math.max(
    Math.abs(prescription.right.cyl || 0),
    Math.abs(prescription.left.cyl || 0)
  );
  const totalDiopter = maxSph + (maxCyl / 2);
  const special = checkSpecialManufacture(totalDiopter);
  if (special.special) return special;
  const refThickness = getReferenceThickness(lensIndex, totalDiopter);
  if (!refThickness) return null;
  const indexThickness = applyIndexFactor(refThickness, lensIndex);
  const frameThickness = applyFrameEffect(indexThickness, frameSize);
  const cylThickness = applyCylEffect(frameThickness, maxCyl, prescription.right.axis || 0);
  return {
    center: cylThickness.center,
    edge: cylThickness.edge,
    total: cylThickness.total,
    source: refThickness.source,
    baseIndex: indexThickness.baseIndex,
  };
}

export function getThinnessScore(thickness, lensIndex) {
  if (!thickness) return 0;
  const baseScore = {
    '1.50': 2,
    '1.56': 5,
    '1.60': 7,
    '1.67': 8.5,
    '1.74': 10,
  };
  const base = baseScore[lensIndex] || baseScore['1.50'];
  const normalizedThickness = 10 - thickness.total;
  return Math.round((base + normalizedThickness * 0.5) * 10) / 10;
}

export function calculateTotalDiopter(prescription) {
  const maxSph = Math.max(
    Math.abs(prescription.right.sph || 0),
    Math.abs(prescription.left.sph || 0)
  );
  const maxCyl = Math.max(
    Math.abs(prescription.right.cyl || 0),
    Math.abs(prescription.left.cyl || 0)
  );
  return maxSph + (maxCyl / 2);
}
