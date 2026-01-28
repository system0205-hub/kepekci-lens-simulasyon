import React from 'react';
import { Glasses, Eye, Monitor, Sun } from 'lucide-react';

const lensTypes = [
  {
    id: 'single_vision',
    name: 'Tek Gözlük',
    icon: <Glasses className="w-8 h-8" />,
    description: 'Uzak veya yakın gözlük için tek odaklı lens',
    features: ['Basit ve pratik', 'Ekonomik', 'Geniş kullanım alanı']
  },
  {
    id: 'bifocal',
    name: 'Bifokal',
    icon: <Eye className="w-8 h-8" />,
    description: 'Uzak ve yakın için çift odaklı lens',
    features: ['Çift odaklı', 'Orta yaş için', 'Net görüş']
  },
  {
    id: 'progressive',
    name: 'Progresif',
    icon: <Monitor className="w-8 h-8" />,
    description: 'Üç odaklı sorunsuz geçiş lensi',
    features: ['Üç odaklı', 'Sorunsuz geçiş', 'Estetik']
  },
  {
    id: 'photochromic',
    name: 'Fotochromic',
    icon: <Sun className="w-8 h-8" />,
    description: 'Işığa göre renk değiştiren lens',
    features: ['Işığa hassas', 'Güneş gözlüğü özelliği', 'Pratik']
  },
  {
    id: 'blue_cut',
    name: 'Blue Cut',
    icon: <Monitor className="w-8 h-8" />,
    description: 'Mavi ışık filtreli dijital koruma',
    features: ['Mavi ışık filtreli', 'Dijital koruma', 'Rahat görüş']
  },
  {
    id: 'anti_reflex',
    name: 'Anti-Refleks',
    icon: <Glasses className="w-8 h-8" />,
    description: 'Yansıma önleyici yüksek kaliteli lens',
    features: ['Yansıma önleyici', 'Yüksek kalite', 'Net görüş']
  }
];

export default function LensTypeSelector({ selected, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Lens Tipi Seçin</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lensTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selected === type.id
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3 mb-3 text-blue-600">
              {type.icon}
              <h3 className="text-lg font-semibold text-gray-900">
                {type.name}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">{type.description}</p>
            <ul className="space-y-1">
              {type.features.map((feature, index) => (
                <li key={index} className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-blue-600 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Lens tipi seçimi, günlük kullanım senaryonuza ve ihtiyaçlarınıza göre değişir. 
          Dijital cihazlar için Blue Cut, güneş için Fotochromic önerilir.
        </p>
      </div>
    </div>
  );
}
