import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function ThicknessRiskBadge({ thickness }) {
  const getRiskLevel = () => {
    if (thickness <= 3) return { level: 'low', color: 'green', icon: CheckCircle };
    if (thickness <= 5) return { level: 'medium', color: 'yellow', icon: Info };
    if (thickness <= 7) return { level: 'high', color: 'orange', icon: AlertTriangle };
    return { level: 'very-high', color: 'red', icon: AlertTriangle };
  };

  const risk = getRiskLevel();
  const Icon = risk.icon;

  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: 'text-yellow-600'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: 'text-orange-600'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: 'text-red-600'
    }
  };

  const classes = colorClasses[risk.color];

  const riskLabels = {
    low: 'Düşük Risk',
    medium: 'Orta Risk',
    high: 'Yüksek Risk',
    'very-high': 'Çok Yüksek Risk'
  };

  const riskDescriptions = {
    low: 'İnce lens, estetik görünüm',
    medium: 'Orta kalınlık, iyi görünüm',
    high: 'Kalın lens, dikkatli kullanım',
    'very-high': 'Çok kalın lens, özel üretim gerekebilir'
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${classes.bg} ${classes.border} border`}>
      <Icon className={`w-5 h-5 ${classes.icon}`} />
      <div>
        <span className={`font-semibold ${classes.text}`}>
          {riskLabels[risk.level]}
        </span>
        <p className={`text-sm ${classes.text} opacity-80`}>
          {riskDescriptions[risk.level]}
        </p>
      </div>
    </div>
  );
}
