import React from 'react';
import { Glasses } from 'lucide-react';

export default function FrameVisual({ thickness }) {
  const maxThickness = 10;
  const minThickness = 1;
  const normalizedThickness = Math.max(minThickness, Math.min(maxThickness, thickness));
  const lensOpacity = 1 - ((normalizedThickness - minThickness) / (maxThickness - minThickness)) * 0.5;
  const lensColor = `rgba(59, 130, 246, ${lensOpacity})`;
  const edgeThickness = 2 + (normalizedThickness / maxThickness) * 8;

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <svg width="400" height="200" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="frameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="lensGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={lensColor} />
              <stop offset="100%" stopColor={`rgba(59, 130, 246, ${lensOpacity * 0.6})`} />
            </linearGradient>
          </defs>

          <g transform="translate(50, 20)">
            <path
              d="M 20 40 L 120 40 L 140 60 L 140 100 L 120 100 L 100 80 L 40 80 L 20 100 L 0 100 L 0 60 Z"
              fill="none"
              stroke="url(#frameGradient)"
              strokeWidth="4"
              className="opacity-100"
            />
            
            <ellipse
              cx="70"
              cy="70"
              rx="40"
              ry="50"
              fill="url(#lensGradient)"
              stroke={lensColor}
              strokeWidth={edgeThickness}
              opacity={lensOpacity}
            />

            <text x="70" y="150" textAnchor="middle" className="fill-gray-600 text-xs font-medium">
              Sağ Göz
            </text>
          </g>

          <g transform="translate(200, 20)">
            <path
              d="M 20 40 L 120 40 L 140 60 L 140 100 L 120 100 L 100 80 L 40 80 L 20 100 L 0 100 L 0 60 Z"
              fill="none"
              stroke="url(#frameGradient)"
              strokeWidth="4"
              className="opacity-100"
            />
            
            <ellipse
              cx="70"
              cy="70"
              rx="40"
              ry="50"
              fill="url(#lensGradient)"
              stroke={lensColor}
              strokeWidth={edgeThickness}
              opacity={lensOpacity}
            />

            <text x="70" y="150" textAnchor="middle" className="fill-gray-600 text-xs font-medium">
              Sol Göz
            </text>
          </g>

          <g transform="translate(185, 60)">
            <path
              d="M 5 0 L 25 0 L 25 10 L 5 10 Z"
              fill="url(#frameGradient)"
            />
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-8 w-full max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-2">
            <Glasses className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-sm text-gray-600">Çerçeve</div>
          <div className="text-xs text-gray-400">Standart</div>
        </div>

        <div className="text-center">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 transition-all"
            style={{
              backgroundColor: lensColor,
              opacity: lensOpacity,
              border: `${edgeThickness}px solid ${lensColor}`
            }}
          >
            <span className="text-lg font-bold text-white">
              {normalizedThickness.toFixed(1)}
            </span>
          </div>
          <div className="text-sm text-gray-600">Kalınlık</div>
          <div className="text-xs text-gray-400">{normalizedThickness.toFixed(1)} mm</div>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-2">
            <div className="text-2xl">
              {normalizedThickness <= 3 ? '✅' : normalizedThickness <= 5 ? '👍' : normalizedThickness <= 7 ? '⚠️' : '❗'}
            </div>
          </div>
          <div className="text-sm text-gray-600">Durum</div>
          <div className="text-xs text-gray-400">
            {normalizedThickness <= 3 ? 'İdeal' : normalizedThickness <= 5 ? 'İyi' : normalizedThickness <= 7 ? 'Kabul' : 'Dikkat'}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl w-full max-w-md">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <span className="text-sm font-medium text-gray-700">Lens Kalınlığı Analizi</span>
        </div>
        <p className="text-xs text-gray-600">
          {normalizedThickness <= 3
            ? 'Mükemmel! İnce lens ile estetik ve rahat bir kullanım sağlar.'
            : normalizedThickness <= 5
            ? 'İyi! Standart kalınlıkta lens ile konforlu kullanım.'
            : normalizedThickness <= 7
            ? 'Kabul edilebilir. Çerçeve seçimi ve indeks değeri optimize edilebilir.'
            : 'Dikkat! Kalın lens riski. Yüksek indeks veya daha küçük çerçeve önerilir.'}
        </p>
      </div>
    </div>
  );
}
