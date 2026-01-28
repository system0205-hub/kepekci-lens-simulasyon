import React from 'react';
import { useLocalization } from '../../../shared/src/contexts/LocalizationContext';

export const RuleEnginePage: React.FC = () => {
  const { locale } = useLocalization();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {locale.admin.ruleEngine}
        </h1>
        <p className="text-gray-600">
          Öneri algoritması kuralları ve ayarları
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Algoritma Kuralları
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              {locale.buttons.add}
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            Kural editörü yakında eklenecek
          </div>
        </div>
      </div>
    </div>
  );
};