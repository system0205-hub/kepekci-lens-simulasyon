import React, { useState, useEffect } from 'react';
import { Sun, RotateCw } from 'lucide-react';

export default function Photochromic3D() {
  const [lightIntensity, setLightIntensity] = useState(50);
  const [lensColor, setLensColor] = useState('rgba(100, 150, 200, 0.3)');

  useEffect(() => {
    const intensity = lightIntensity / 100;
    const baseOpacity = 0.3 + intensity * 0.5;
    const darkness = 150 - intensity * 100;
    setLensColor(`rgba(${darkness}, ${darkness}, ${darkness + 50}, ${baseOpacity})`);
  }, [lightIntensity]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <svg width="400" height="300" viewBox="0 0 400 300">
          <defs>
            <radialGradient id="lensRadial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={lensColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={lensColor} stopOpacity="1" />
            </radialGradient>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDB813" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform="translate(50, 50)">
            <path
              d="M 20 40 L 120 40 L 140 60 L 140 100 L 120 100 L 100 80 L 40 80 L 20 100 L 0 100 L 0 60 Z"
              fill="none"
              stroke="#1E293B"
              strokeWidth="4"
              opacity="0.8"
            />
            
            <ellipse
              cx="70"
              cy="70"
              rx="40"
              ry="50"
              fill="url(#lensRadial)"
              stroke={lensColor}
              strokeWidth="2"
              className="transition-all duration-500"
            />
          </g>

          <g transform="translate(200, 50)">
            <path
              d="M 20 40 L 120 40 L 140 60 L 140 100 L 120 100 L 100 80 L 40 80 L 20 100 L 0 100 L 0 60 Z"
              fill="none"
              stroke="#1E293B"
              strokeWidth="4"
              opacity="0.8"
            />
            
            <ellipse
              cx="70"
              cy="70"
              rx="40"
              ry="50"
              fill="url(#lensRadial)"
              stroke={lensColor}
              strokeWidth="2"
              className="transition-all duration-500"
            />
          </g>

          <g transform="translate(185, 90)">
            <path
              d="M 5 0 L 25 0 L 25 10 L 5 10 Z"
              fill="#1E293B"
            />
          </g>

          <g transform="translate(320, 30)" filter="url(#glow)">
            <circle cx="30" cy="30" r="25" fill="url(#sunGradient)" />
            <g stroke="url(#sunGradient)" strokeWidth="3" strokeLinecap="round">
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="30"
                  y1="0"
                  x2="30"
                  y2="-10"
                  transform={`rotate(${i * 45}, 30, 30)`}
                />
              ))}
            </g>
          </g>

          <g transform="translate(320, 120)">
            <text x="30" y="0" textAnchor="middle" className="fill-gray-600 text-sm font-medium">
              Işık Şiddeti
            </text>
            <text x="30" y="20" textAnchor="middle" className="fill-orange-600 font-bold text-lg">
              {lightIntensity}%
            </text>
          </g>
        </svg>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center gap-3">
          <Sun className="w-6 h-6 text-orange-500" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Işık Şiddeti
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={lightIntensity}
              onChange={(e) => setLightIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-yellow-200 to-orange-500 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <RotateCw className="w-6 h-6 text-gray-400" />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              lightIntensity <= 25 ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-50'
            }`}
            onClick={() => setLightIntensity(15)}
          >
            <div className="text-2xl mb-1">☁️</div>
            <div className="text-xs text-gray-600">Bulutlu</div>
            <div className="text-xs text-gray-400">0-25%</div>
          </div>
          <div
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              lightIntensity > 25 && lightIntensity <= 75 ? 'bg-yellow-100 ring-2 ring-yellow-500' : 'bg-gray-50'
            }`}
            onClick={() => setLightIntensity(50)}
          >
            <div className="text-2xl mb-1">⛅</div>
            <div className="text-xs text-gray-600">Parçalı</div>
            <div className="text-xs text-gray-400">25-75%</div>
          </div>
          <div
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              lightIntensity > 75 ? 'bg-orange-100 ring-2 ring-orange-500' : 'bg-gray-50'
            }`}
            onClick={() => setLightIntensity(90)}
          >
            <div className="text-2xl mb-1">☀️</div>
            <div className="text-xs text-gray-600">Güneşli</div>
            <div className="text-xs text-gray-400">75-100%</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Karanlaşma Seviyesi</span>
            <span className="text-sm font-bold text-orange-600">
              {Math.round((lightIntensity / 100) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-gray-700 transition-all duration-500"
              style={{ width: `${lightIntensity}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-xl w-full max-w-md">
        <p className="text-sm text-blue-800">
          <strong>Photochromic Teknolojisi:</strong> Fotochromic lensler, UV ışığına maruz kaldığında 
          otomatik olarak kararır. Işık şiddetini ayararak lensin nasıl tepki verdiğini görebilirsiniz.
        </p>
      </div>
    </div>
  );
}
