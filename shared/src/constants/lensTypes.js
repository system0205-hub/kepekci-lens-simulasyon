// Lens tipleri
export const LENS_TYPES = {
  SINGLE_VISION_DISTANCE: 'uzak',
  SINGLE_VISION_NEAR: 'yakın',
  PROGRESSIVE: 'progresif',
  BIFOCAL: 'bifocal',
  MULTIFOCAL: 'multifocal',
};

export const LENS_TYPE_LABELS = {
  [LENS_TYPES.SINGLE_VISION_DISTANCE]: 'Uzak (Genel Kullanım)',
  [LENS_TYPES.SINGLE_VISION_NEAR]: 'Yakın (Okuma)',
  [LENS_TYPES.PROGRESSIVE]: 'Progresif (Hepsi Bir Arada)',
  [LENS_TYPES.BIFOCAL]: 'Bifocal (Uzak/Yakın)',
  [LENS_TYPES.MULTIFOCAL]: 'Multifocal (Çok Odak)',
};
