import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../../../shared/src/contexts/LocalizationContext';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { locale } = useLocalization();

  const handleBackToCalculator = () => {
    navigate('/calculator');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={handleBackToCalculator}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {locale.buttons.back}
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hesaplama Sonuçları
          </h1>
          <p className="text-gray-600">
            Size özel lens önerileri ve fiyat bilgileri
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommendations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Önerilen Lens Seçenekleri
                </h2>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    Öneri kartları yakında eklenecek
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Fiyat Detayları
                </h2>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    Fiyat dökümü yakında eklenecek
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};