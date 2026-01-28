import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../../../shared/src/contexts/LocalizationContext';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { locale } = useLocalization();

  const handleStart = () => {
    navigate('/calculator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Kepekci Lens
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {locale.messages.welcome}
            </p>
          </div>

          {/* Process Steps */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-105">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {locale.prescription}
                </h3>
                <p className="text-gray-600 text-sm">
                  Reçete bilgilerinizi girin
                </p>
              </div>

              <div className="text-center p-4">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-105">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Hesaplama
                </h3>
                <p className="text-gray-600 text-sm">
                  Lens kalınlığı hesaplanır
                </p>
              </div>

              <div className="text-center p-4 sm:col-span-2 md:col-span-1">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-105">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Öneriler
                </h3>
                <p className="text-gray-600 text-sm">
                  En uygun lens seçenekleri
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <button
              onClick={handleStart}
              className="bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 active:scale-95"
              aria-label="Lens hesaplama sürecini başlat"
            >
              {locale.buttons.start}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Ücretsiz ve hızlı hesaplama
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};