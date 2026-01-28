import React from 'react';
import { SlidersHorizontal, Minus, Plus } from 'lucide-react';

export default function PrioritySlider({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Öncelik Ayarları</h2>

      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📏</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kalınlık Önceliği</h3>
                <p className="text-sm text-gray-600">İnce lens tercih edilsin mi?</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Minus
                className={`w-5 h-5 cursor-pointer ${
                  data.thickness > 0 ? 'text-blue-600' : 'text-gray-300'
                }`}
                onClick={() => handleChange('thickness', Math.max(0, data.thickness - 10))}
              />
              <span className="w-12 text-center font-bold text-lg text-gray-900">
                {data.thickness}%
              </span>
              <Plus
                className={`w-5 h-5 cursor-pointer ${
                  data.thickness < 100 ? 'text-blue-600' : 'text-gray-300'
                }`}
                onClick={() => handleChange('thickness', Math.min(100, data.thickness + 10))}
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={data.thickness}
            onChange={(e) => handleChange('thickness', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fiyat Önceliği</h3>
                <p className="text-sm text-gray-600">Ekonomik çözüm tercih edilsin mi?</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Minus
                className={`w-5 h-5 cursor-pointer ${
                  data.price > 0 ? 'text-green-600' : 'text-gray-300'
                }`}
                onClick={() => handleChange('price', Math.max(0, data.price - 10))}
              />
              <span className="w-12 text-center font-bold text-lg text-gray-900">
                {data.price}%
              </span>
              <Plus
                className={`w-5 h-5 cursor-pointer ${
                  data.price < 100 ? 'text-green-600' : 'text-gray-300'
                }`}
                onClick={() => handleChange('price', Math.min(100, data.price + 10))}
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={data.price}
            onChange={(e) => handleChange('price', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kalite Önceliği</h3>
                <p className="text-sm text-gray-600">Yüksek kalite tercih edilsin mi?</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Minus
                className={`w-5 h-5 cursor-pointer ${
                  data.quality > 0 ? 'text-purple-600' : 'text-gray-300'
                }`}
                onClick={() => handleChange('quality', Math.max(0, data.quality - 10))}
              />
              <span className="w-12 text-center font-bold text-lg text-gray-900">
                {data.quality}%
              </span>
              <Plus
                className={`w-5 h-5 cursor-pointer ${
                  data.quality < 100 ? 'text-purple-600' : 'text-gray-300'
                }`}
                onClick={() => handleChange('quality', Math.min(100, data.quality + 10))}
              />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={data.quality}
            onChange={(e) => handleChange('quality', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Öncelik Özeti</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Kalınlık</div>
            <div className="text-lg font-bold text-blue-600">{data.thickness}%</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Fiyat</div>
            <div className="text-lg font-bold text-green-600">{data.price}%</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-sm text-gray-600 mb-1">Kalite</div>
            <div className="text-lg font-bold text-purple-600">{data.quality}%</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Tips:</strong> Öncelik ayarları, size sunulacak önerileri etkiler. 
          Kalınlık önceliği yüksekse daha ince lensler, fiyat önceliği yüksekse daha ekonomik seçenekler önerilir.
        </p>
      </div>
    </div>
  );
}
