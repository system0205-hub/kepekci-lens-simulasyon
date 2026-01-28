import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function AIDescription({ recommendation }) {
  const generateDescription = () => {
    const { thickness, index: lensIndex, coatings, category, totalPrice } = recommendation;

    let description = '';
    
    const thicknessAnalysis = thickness <= 3
      ? 'Mükemmel! Seçtiğiniz lens, son derece ince ve estetik bir görünüm sunuyor. Çerçevenizin içine zarifçe yerleşecek.'
      : thickness <= 5
      ? 'İyi kalınlıkta bir lens seçimi. Hem konfor hem de görünüm açısından dengeli bir seçim.'
      : thickness <= 7
      : 'Orta kalınlıkta lens. İnce görünüm için çerçeve seçimine dikkat etmenizi öneririm.'
      : 'Bu lens biraz kalın olabilir. Estetik görünüm için daha büyük çerçeveler veya rimless tasarımlar kullanılabilir.';

    const indexAnalysis = lensIndex <= 1.56
      ? 'Standart indeks değerli lens. Ekonomik ve pratik bir seçim.'
      : lensIndex <= 1.60
      ? 'Orta seviye indeks. İnce görünüm için ideal denge.'
      : 'Yüksek indeks değerli lens. İnce ve hafif, üst seviye bir seçim.';

    const coatingAnalysis = coatings && coatings.length > 0
      ? `Seçtiğiniz ${coatings.join(' ve ')} kaplama, lensin dayanıklılığını ve görüntü kalitesini artırıyor.`
      : 'Standart kaplama ile temiz ve net bir görüş sağlanır.';

    const categoryAnalysis = category === 'premium'
      ? 'Bu paket, en yüksek kalite ve performans sunuyor.'
      : category === 'economy'
      ? 'Bu paket, ekonomik ve pratik bir çözüm sunuyor.'
      : 'Bu paket, kalite ve fiyat dengesini sağlıyor.';

    const priceAnalysis = totalPrice < 2000
      ? 'Bütçe dostu bir seçim.'
      : totalPrice < 4000
      ? 'Orta segment fiyatlandırmalı bir paket.'
      : 'Premium segment fiyatlandırmalı üst seviye bir paket.';

    description = `${thicknessAnalysis} ${indexAnalysis} ${coatingAnalysis} ${categoryAnalysis} ${priceAnalysis}`;

    return description;
  };

  const generatePros = () => {
    const pros = [];
    
    if (recommendation.thickness <= 3) {
      pros.push('Çok ince ve estetik');
      pros.push('Hafif ve konforlu');
    } else if (recommendation.thickness <= 5) {
      pros.push('İnce görünüm');
      pros.push('İyi kalite/fiyat oranı');
    }
    
    if (recommendation.index >= 1.67) {
      pros.push('Yüksek indeks');
      pros.push('Düşük kırılma indeksi');
    }
    
    if (recommendation.coatings && recommendation.coatings.length > 0) {
      pros.push('Özel kaplama');
      pros.push('Gelişmiş koruma');
    }
    
    return pros;
  };

  const generateCons = () => {
    const cons = [];
    
    if (recommendation.thickness > 7) {
      cons.push('Kalın görünüm');
      cons.push('Çerçeve seçimine dikkat');
    }
    
    if (recommendation.index <= 1.50) {
      cons.push('Standart indeks');
      cons.push('Daha kalın olabilir');
    }
    
    if (recommendation.category === 'economy') {
      cons.push('Standart özellikler');
    }
    
    return cons;
  };

  const pros = generatePros();
  const cons = generateCons();

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">AI Açıklaması</h3>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {generateDescription()}
          </p>
        </div>
      </div>

      {pros.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Avantajlar
          </h4>
          <ul className="space-y-1">
            {pros.map((pro, index) => (
              <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
      )}

      {cons.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
            <span className="text-red-600">!</span>
            Dikkat Edilmesi Gerekenler
          </h4>
          <ul className="space-y-1">
            {cons.map((con, index) => (
              <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
