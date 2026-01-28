import React, { useState } from 'react';
import LensVisualizer from '../components/simulation/LensVisualizer';
import { useLocalization } from '../../../shared/src/contexts/LocalizationContext';
import { PrescriptionForm } from '../components/forms/PrescriptionForm';
import { FrameMeasurements } from '../components/forms/FrameMeasurements';
import { LensTypeSelector } from '../components/forms/LensTypeSelector';
import { PrescriptionData } from '../types/prescription';
import { FrameData } from '../types/frame';
import { LensType } from '../types/lens';

export const CalculatorPage: React.FC = () => {
  const { locale } = useLocalization();
  const [prescription, setPrescription] = useState<PrescriptionData>({
    rightEye: { sph: 0, cyl: 0, axis: 0 },
    leftEye: { sph: 0, cyl: 0, axis: 0 }
  });
  const [frame, setFrame] = useState<FrameData>({ size: 'medium' });
  const [lensType, setLensType] = useState<LensType>('uzak');
  const [showComparison, setShowComparison] = useState(true);
  const [comparisonIndex, setComparisonIndex] = useState(1.67);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lens Kalınlık Hesaplayıcı
          </h1>
          <p className="text-gray-600">
            Reçete bilgilerinizi girin ve en uygun lens seçeneklerini keşfedin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Forms */}
          <div className="space-y-6">
            <PrescriptionForm
              prescription={prescription}
              onChange={setPrescription}
            />

            <FrameMeasurements
              measurements={frame}
              onChange={setFrame}
            />

            <LensTypeSelector
              selectedType={lensType}
              onChange={setLensType}
            />
          </div>

          {/* Visualization Area */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <span>3D Kalınlık Önizlemesi</span>
                <div className="flex items-center gap-2 text-sm font-normal">
                  <span className={showComparison ? 'text-gray-500' : 'text-blue-600 font-bold'}>Tekli</span>
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showComparison ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showComparison ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className={showComparison ? 'text-blue-600 font-bold' : 'text-gray-500'}>Karşılaştır</span>
                </div>
              </h2>

              {/* Optional: Add active index selector if needed, for now we compare 1.50 vs 1.67 */}
              {showComparison && (
                <div className="mb-4 flex justify-center gap-2">
                  {[1.56, 1.61, 1.67, 1.74].map(idx => (
                    <button
                      key={idx}
                      onClick={() => setComparisonIndex(idx)}
                      className={`px-3 py-1 text-xs rounded-full border ${comparisonIndex === idx ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
                    >
                      {idx}
                    </button>
                  ))}
                </div>
              )}

              <div className="h-[500px]">
                <LensVisualizer
                  diopter={prescription.rightEye.sph || -2.00}
                  index={1.50}
                  diameter={65}
                  showComparison={showComparison}
                  comparisonIndex={comparisonIndex}
                />
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                * Standart 1.50 indeksli lens simülasyonu.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Öneriler
              </h2>
              <div className="text-center py-12">
                <div className="text-gray-500">
                  Öneri bileşenleri yakında eklenecek
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            {locale.buttons.calculate}
          </button>
        </div>
      </div>
    </div>
  );
};