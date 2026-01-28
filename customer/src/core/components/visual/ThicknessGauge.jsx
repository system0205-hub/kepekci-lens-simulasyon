import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function ThicknessGauge({ thickness }) {
  const maxThickness = 10;
  const minThickness = 1;
  const normalizedThickness = Math.max(minThickness, Math.min(maxThickness, thickness));
  const percentage = ((normalizedThickness - minThickness) / (maxThickness - minThickness)) * 100;
  const gaugeLevel = Math.round((10 - normalizedThickness + 1) / 10);

  const getGaugeColor = () => {
    if (normalizedThickness <= 3) return 'bg-green-500';
    if (normalizedThickness <= 5) return 'bg-yellow-500';
    if (normalizedThickness <= 7) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getGaugeText = () => {
    if (normalizedThickness <= 3) return 'Çok İnce';
    if (normalizedThickness <= 5) return 'İnce';
    if (normalizedThickness <= 7) return 'Orta';
    return 'Kalın';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 3.4} 340`}
            style={{
              stroke: getGaugeColor().replace('bg-', '#').replace('-500', ''),
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-90">
          <span className="text-3xl font-bold text-gray-900">
            {gaugeLevel}
          </span>
          <span className="text-sm text-gray-500">/ 10</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {getGaugeText()}
        </div>
        <div className="text-sm text-gray-600">
          {normalizedThickness.toFixed(1)} mm
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Minus className="w-4 h-4 text-gray-400" />
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getGaugeColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <Plus className="w-4 h-4 text-gray-400" />
      </div>

      <div className="mt-4 flex justify-between w-48 text-xs text-gray-500">
        <span>İnce (1mm)</span>
        <span>Kalın (10mm)</span>
      </div>
    </div>
  );
}
