import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import PrescriptionForm from '../input/PrescriptionForm';
import FrameMeasurements from '../input/FrameMeasurements';
import LensTypeSelector from '../input/LensTypeSelector';
import UsageDescription from '../input/UsageDescription';
import PrioritySlider from '../input/PrioritySlider';

export default function CalculatorPage({ onBack, onNext }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    prescription: {
      rightEye: { sph: '', cyl: '', axis: '' },
      leftEye: { sph: '', cyl: '', axis: '' },
      hasPrescription: false
    },
    frame: {
      a: '',
      b: '',
      pd: '',
      size: 'orta',
      isRimless: false
    },
    lensType: 'single_vision',
    usage: {
      scenario: '',
      description: '',
      keywords: []
    },
    priority: {
      thickness: 50,
      price: 50,
      quality: 50
    }
  });

  const steps = [
    { id: 1, title: 'Reçete' },
    { id: 2, title: 'Çerçeve' },
    { id: 3, title: 'Lens Tipi' },
    { id: 4, title: 'Kullanım' },
    { id: 5, title: 'Öncelik' }
  ];

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onNext(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Geri
              </button>
              <span className="text-sm text-gray-600">
                Adım {step} / {steps.length}
              </span>
            </div>

            <div className="flex gap-2">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    s.id < step
                      ? 'bg-blue-600'
                      : s.id === step
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-1 text-sm ${
                    s.id <= step ? 'text-blue-600 font-medium' : 'text-gray-400'
                  }`}
                >
                  {s.id < step && <Check className="w-4 h-4" />}
                  {s.title}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            {step === 1 && (
              <PrescriptionForm
                data={formData.prescription}
                onChange={(data) => updateFormData('prescription', data)}
              />
            )}
            {step === 2 && (
              <FrameMeasurements
                data={formData.frame}
                onChange={(data) => updateFormData('frame', data)}
              />
            )}
            {step === 3 && (
              <LensTypeSelector
                selected={formData.lensType}
                onChange={(value) => updateFormData('lensType', value)}
              />
            )}
            {step === 4 && (
              <UsageDescription
                data={formData.usage}
                onChange={(data) => updateFormData('usage', data)}
              />
            )}
            {step === 5 && (
              <PrioritySlider
                data={formData.priority}
                onChange={(data) => updateFormData('priority', data)}
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors"
            >
              {step === 1 ? 'İptal' : 'Geri'}
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              {step === 5 ? 'Sonuçları Gör' : 'Devam Et'}
              {step < 5 && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
