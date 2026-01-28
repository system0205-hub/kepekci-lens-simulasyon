import React from 'react';
import { useLocalization } from '../../../shared/src/contexts/LocalizationContext';

export const ChangeLogPage: React.FC = () => {
  const { locale } = useLocalization();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {locale.admin.changeLog}
        </h1>
        <p className="text-gray-600">
          Sistem değişiklikleri ve aktivite geçmişi
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Değişiklik Geçmişi
            </h2>
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>Tüm Değişiklikler</option>
                <option>Lens Ayarları</option>
                <option>Fiyatlandırma</option>
                <option>Kaplamalar</option>
              </select>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                Filtrele
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-12 text-gray-500">
            Değişiklik geçmişi yakında eklenecek
          </div>
        </div>
      </div>
    </div>
  );
};