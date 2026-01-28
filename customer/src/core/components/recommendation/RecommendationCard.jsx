import React from 'react';
import { Check, Star, Package } from 'lucide-react';

export default function RecommendationCard({ recommendation, selected, onClick }) {
  const getCategoryColor = (category) => {
    const colors = {
      economy: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '📦' },
      standard: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '👓' },
      premium: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: '✨' }
    };
    return colors[category] || colors.standard;
  };

  const categoryColor = getCategoryColor(recommendation.category);

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        selected
          ? `${categoryColor.bg} ${categoryColor.border} ring-2 ring-offset-2 ring-blue-500`
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryColor.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">
              {recommendation.category}
            </h3>
            <p className="text-xs text-gray-500">
              {recommendation.lensIndex} İndeks
            </p>
          </div>
        </div>
        {selected && (
          <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="space-y-2 mb-3">
        {recommendation.coatings && recommendation.coatings.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recommendation.coatings.map((coating, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {coating}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">
            {recommendation.rating || 4.5}
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {recommendation.totalPrice.toLocaleString('tr-TR')} TL
          </div>
          <div className="text-xs text-gray-500">Toplam</div>
        </div>
      </div>
    </button>
  );
}
