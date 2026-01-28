import React from 'react';
import { Keyboard, Monitor, Car, BookOpen, Sun, Building, Stethoscope } from 'lucide-react';

const usageScenarios = [
  {
    id: 'office',
    name: 'Ofis Çalışma',
    icon: <Keyboard className="w-6 h-6" />,
    description: 'Bilgisayar ve belge çalışma',
    keywords: ['ofis', 'bilgisayar', 'ekran', 'çalışma masası']
  },
  {
    id: 'driving',
    name: 'Sürüş',
    icon: <Car className="w-6 h-6" />,
    description: 'Gündüz/gece araç kullanımı',
    keywords: ['sürüş', 'araba', 'gece sürüşü', 'far']
  },
  {
    id: 'sports',
    name: 'Spor',
    icon: <Sun className="w-6 h-6" />,
    description: 'Dış mekan spor aktiviteleri',
    keywords: ['spor', 'yürüyüş', 'koşu', 'tenis', 'golf']
  },
  {
    id: 'reading',
    name: 'Okuma',
    icon: <BookOpen className="w-6 h-6" />,
    description: 'Kitap ve belge okuma',
    keywords: ['okuma', 'kitap', 'belge', 'derse çalışma']
  },
  {
    id: 'outdoor',
    name: 'Dış Mekan',
    icon: <Sun className="w-6 h-6" />,
    description: 'Genel dış mekan kullanımı',
    keywords: ['dış mekan', 'yürüyüş', 'piknik', 'alışveriş']
  },
  {
    id: 'medical',
    name: 'Tıbbi Kullanım',
    icon: <Stethoscope className="w-6 h-6" />,
    description: 'Doktor ve sağlık çalışanları',
    keywords: ['doktor', 'hastane', 'ameliyat', 'muayene']
  }
];

export default function UsageDescription({ data, onChange }) {
  const handleScenarioSelect = (scenario) => {
    onChange({
      ...data,
      scenario: scenario.id,
      description: scenario.description,
      keywords: [...data.keywords, ...scenario.keywords]
    });
  };

  const handleDescriptionChange = (description) => {
    onChange({
      ...data,
      description
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Kullanım Senaryosu</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {usageScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleScenarioSelect(scenario)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              data.scenario === scenario.id
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              {scenario.icon}
              <h3 className="font-semibold text-gray-900">{scenario.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{scenario.description}</p>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Açıklama (Opsiyonel)
        </label>
        <textarea
          value={data.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder="Kullanım senaryonuzu detaylı açıklayın..."
        />
      </div>

      {data.keywords.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Belirlenen Anahtar Kelimeler:
          </h3>
          <div className="flex flex-wrap gap-2">
            {[...new Set(data.keywords)].map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Kullanım senaryonuz seçtiğiniz lens ve kaplama önerilerinde önemli rol oynar. 
          Örneğin, ofis çalışması için Blue Cut, sürüş için Anti-Refleks önerilir.
        </p>
      </div>
    </div>
  );
}
