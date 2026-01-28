import React from 'react';
import { Eye, Glasses } from 'lucide-react';

export default function PrescriptionForm({ data, onChange }) {
  const handleEyeChange = (eye, field, value) => {
    onChange({
      ...data,
      rightEye: { ...data.rightEye },
      leftEye: { ...data.leftEye }
    });
    onChange({
      ...data,
      [eye]: {
        ...data[eye],
        [field]: value
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reçete Bilgileri</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
              <Glasses className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sağ Göz (OD)</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPH (Sfere)
            </label>
            <input
              type="number"
              step="0.25"
              min="-20"
              max="20"
              value={data.rightEye.sph}
              onChange={(e) => handleEyeChange('rightEye', 'sph', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Örn: -2.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CYL (Silindir)
            </label>
            <input
              type="number"
              step="0.25"
              min="-6"
              max="6"
              value={data.rightEye.cyl}
              onChange={(e) => handleEyeChange('rightEye', 'cyl', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Örn: -0.50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AXIS (Aşısı)
            </label>
            <input
              type="number"
              min="0"
              max="180"
              value={data.rightEye.axis}
              onChange={(e) => handleEyeChange('rightEye', 'axis', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Örn: 90"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sol Göz (OS)</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPH (Sfere)
            </label>
            <input
              type="number"
              step="0.25"
              min="-20"
              max="20"
              value={data.leftEye.sph}
              onChange={(e) => handleEyeChange('leftEye', 'sph', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Örn: -2.50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CYL (Silindir)
            </label>
            <input
              type="number"
              step="0.25"
              min="-6"
              max="6"
              value={data.leftEye.cyl}
              onChange={(e) => handleEyeChange('leftEye', 'cyl', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Örn: -0.75"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AXIS (Aşısı)
            </label>
            <input
              type="number"
              min="0"
              max="180"
              value={data.leftEye.axis}
              onChange={(e) => handleEyeChange('leftEye', 'axis', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Örn: 85"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> SPH değerleri miyop (eksi) veya hipermetrop (artı) olabilir. 
          CYL değeri astigmatizm derecesini gösterir. AXIS 0-180 arası bir açı değeridir.
        </p>
      </div>
    </div>
  );
}
