import React from 'react';
import { Square, Ruler } from 'lucide-react';

export default function FrameMeasurements({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Çerçeve Ölçüleri</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            A (Çerçeve Genişliği - mm)
          </label>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="30"
              max="80"
              value={data.a}
              onChange={(e) => handleChange('a', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Örn: 52"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            B (Çerçeve Yüksekliği - mm)
          </label>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="20"
              max="60"
              value={data.b}
              onChange={(e) => handleChange('b', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Örn: 40"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PD (Pupil Distance - mm)
          </label>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="50"
              max="75"
              value={data.pd}
              onChange={(e) => handleChange('pd', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Örn: 62"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Çerçeve Boyutu
          </label>
          <select
            value={data.size}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          >
            <option value="kucuk">Küçük (≤ 50mm)</option>
            <option value="orta">Orta (51-55mm)</option>
            <option value="buyuk">Büyük (> 55mm)</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Square className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Çerçeve Görseli
          </h3>
        </div>
        
        <div className="flex justify-center">
          <div className="relative">
            <svg width="200" height="120" viewBox="0 0 200 120">
              <path
                d="M 40 40 L 160 40 L 180 60 L 180 80 L 160 80 L 140 60 L 60 60 L 40 80 L 20 80 L 20 60 Z"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                className="opacity-80"
              />
              <circle cx="100" cy="50" r="25" fill="#3B82F6" className="opacity-20" />
              
              <text x="100" y="105" textAnchor="middle" className="text-xs fill-gray-600">
                A: {data.a || '?'} mm
              </text>
              <text x="100" y="118" textAnchor="middle" className="text-xs fill-gray-600">
                B: {data.b || '?'} mm
              </text>
            </svg>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-500">A (Genişlik)</div>
            <div className="font-semibold text-gray-900">{data.a || '-'} mm</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-500">B (Yükseklik)</div>
            <div className="font-semibold text-gray-900">{data.b || '-'} mm</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-500">PD</div>
            <div className="font-semibold text-gray-900">{data.pd || '-'} mm</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> A değeri çerçevenin yatay genişliği, B değeri dikey yüksekliğidir. 
          PD (Pupil Distance) gözbebeğinin birbirine olan mesafesidir.
        </p>
      </div>
    </div>
  );
}
