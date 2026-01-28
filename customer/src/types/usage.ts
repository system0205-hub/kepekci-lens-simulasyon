// Usage and Priority types for the customer application

export type Priority = 'thin' | 'cheap' | 'balanced';

export interface UsageDescriptionProps {
  usage: string;
  onChange: (usage: string) => void;
  suggestions?: string[];
  error?: string;
}

export interface PrioritySliderProps {
  priority: Priority;
  onChange: (priority: Priority) => void;
  error?: string;
}

export interface UsageValidationErrors {
  usage?: string;
}

export interface PriorityValidationErrors {
  priority?: string;
}

// Common usage suggestions for Turkish users
export const USAGE_SUGGESTIONS = [
  'Ofis çalışması ve bilgisayar kullanımı',
  'Araba kullanma ve trafik',
  'Okuma ve yakın mesafe çalışma',
  'Dış mekan aktiviteleri',
  'Spor ve fiziksel aktiviteler',
  'Televizyon izleme',
  'Hobi ve el işleri',
  'Öğrenci - ders çalışma',
  'Genel günlük kullanım',
  'Mesleki çalışma (detay gerektiren)'
] as const;

// Priority descriptions for better user understanding
export const PRIORITY_DESCRIPTIONS = {
  thin: 'En ince lens seçenekleri - Estetik görünüm öncelikli',
  cheap: 'En ekonomik seçenekler - Bütçe dostu çözümler',
  balanced: 'Kalınlık ve fiyat dengesi - Optimal seçim'
} as const;