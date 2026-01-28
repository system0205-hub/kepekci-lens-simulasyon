// Fotoğraflardan çıkarılmış gerçek referans verileri
export const THICKNESS_REFERENCES = {
  '1.50': {
    '0.00': { center: 1.5, edge: 2.0, total: 2.0, source: 'photo' },
    '0.25': { center: 1.8, edge: 2.5, total: 2.5, source: 'photo' },
    '0.50': { center: 2.1, edge: 3.0, total: 3.0, source: 'photo' },
    '0.75': { center: 2.4, edge: 3.5, total: 3.5, source: 'photo' },
    '1.00': { center: 2.7, edge: 4.0, total: 4.0, source: 'photo' },
    '1.25': { center: 3.0, edge: 4.5, total: 4.5, source: 'photo' },
    '1.50': { center: 3.3, edge: 5.0, total: 5.0, source: 'photo' },
    '1.75': { center: 3.6, edge: 5.5, total: 5.5, source: 'photo' },
    '2.00': { center: 3.9, edge: 6.0, total: 6.0, source: 'photo' },
    '2.50': { center: 4.5, edge: 7.0, total: 7.0, source: 'photo' },
    '3.00': { center: 5.1, edge: 8.0, total: 8.0, source: 'photo' },
    '5.00': { center: 7.5, edge: 12.0, total: 12.0, source: 'photo' },
  },
  '1.56': { factor: 0.85, baseIndex: '1.50' },
  '1.60': { factor: 0.80, baseIndex: '1.50' },
  '1.67': { factor: 0.67, baseIndex: '1.50' },
  '1.74': { factor: 0.50, baseIndex: '1.50' },
};

export const FRAME_EFFECTS = {
  'small': { ekartman: 48, height: 42, bridge: 18, factor: 0.9 },
  'medium': { ekartman: 52, height: 48, bridge: 20, factor: 1.0 },
  'large': { ekartman: 56, height: 54, bridge: 22, factor: 1.15 },
};

export const SPECIAL_MANUFACTURE_THRESHOLD = 7.00;
export const HIGH_POWER_INTERPOLATION_START = 6.00;
