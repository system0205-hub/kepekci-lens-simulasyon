import React from 'react';
import { ArrowLeft, Download, Share2, RotateCcw } from 'lucide-react';
import RecommendationCard from '../recommendation/RecommendationCard';
import ThicknessGauge from '../visual/ThicknessGauge';
import ThicknessRiskBadge from '../visual/ThicknessRiskBadge';
import FrameVisual from '../visual/FrameVisual';
import PriceBreakdown from '../recommendation/PriceBreakdown';
import AIDescription from '../recommendation/AIDescription';
import RecommendationEngine from '../recommendation/RecommendationEngine';
import Photochromic3D from '../visual/Photochromic3D';

export default function ResultsPage({ onBack, onStartOver, formData }) {
  const recommendations = RecommendationEngine.generate(formData);
  const selectedRecommendation = recommendations[0];

  const handleDownload = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lens-calculator-result.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kepekcı Lens - Hesaplama Sonucu',
          text: `Lens Kalınlığı: ${selectedRecommendation.thickness}mm, Tutar: ${selectedRecommendation.totalPrice}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Paylaşım iptal edildi');
      }
    } else {
      alert('Bu tarayıcı paylaşım özelliğini desteklemiyor.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Düzenle
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                İndir
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Paylaş
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Kalınlık Analizi
                </h2>
                <div className="flex items-center gap-8 mb-6">
                  <ThicknessGauge thickness={selectedRecommendation.thickness} />
                  <div className="flex-1">
                    <ThicknessRiskBadge thickness={selectedRecommendation.thickness} />
                    <p className="text-gray-600 mt-2">
                      Tahmini kalınlık: <span className="font-semibold">{selectedRecommendation.thickness.toFixed(1)}mm</span>
                    </p>
                  </div>
                </div>
                <FrameVisual thickness={selectedRecommendation.thickness} />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Fotochromic Gösterimi
                </h2>
                <Photochromic3D />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  AI Açıklaması
                </h2>
                <AIDescription recommendation={selectedRecommendation} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Öneriler
                </h2>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <RecommendationCard
                      key={index}
                      recommendation={rec}
                      selected={index === 0}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Fiyat Kırılımı
                </h2>
                <PriceBreakdown recommendation={selectedRecommendation} />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onStartOver}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Yeni Hesaplama
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
