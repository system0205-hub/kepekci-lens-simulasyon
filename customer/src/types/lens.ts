// Lens data types for the customer application

export type LensType = 'uzak' | 'yakın' | 'progresif' | 'bifocal' | 'multifocal';

export interface LensData {
  type: LensType;
  index?: number;
  coatings?: string[];
  usage?: string;
  priority?: 'thin' | 'cheap' | 'balanced';
}

export interface LensTypeSelectorProps {
  selectedType: LensType;
  onChange: (type: LensType) => void;
  error?: string;
}

export interface LensValidationErrors {
  type?: string;
}

// Lens type descriptions for better user understanding
export const LENS_TYPE_DESCRIPTIONS = {
  uzak: 'Uzak mesafe görüş için optimize edilmiş tek odaklı lens',
  yakın: 'Okuma ve yakın mesafe çalışma için optimize edilmiş lens',
  progresif: 'Uzak, orta ve yakın mesafeyi kademesiz geçişle sağlayan lens',
  bifocal: 'Uzak ve yakın mesafe için iki ayrı odak noktası olan lens',
  multifocal: 'Birden fazla odak noktası ile çeşitli mesafeleri destekleyen lens'
} as const;