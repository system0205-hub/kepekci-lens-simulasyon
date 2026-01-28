import React, { useState } from 'react';
import { Glasses, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';

export default function WelcomePage({ onNext }) {
  const [showInfo, setShowInfo] = useState(false);

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: 'Hızlı Hesaplama',
      description: 'Saniyeler içinde optimum lens kalınlığını hesaplayın'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: 'Güvenilir Sonuçlar',
      description: 'Gerçek fotoğraflardan elde edilen referans verileri'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Akıllı Öneriler',
      description: 'Size en uygun lens ve kaplama paketi önerisi'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
              <Glasses className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Kepekcı Lens
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Optik mağazanız için akıllı lens hesaplama ve öneri sistemi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reçete Bilgileri</h3>
                  <p className="text-gray-600">Müşterinin reçete değerlerini girin (SPH, CYL, AXIS)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Çerçeve Ölçüleri</h3>
                  <p className="text-gray-600">Seçilen çerçevenin ölçülerini belirtin</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Kullanım Senaryosu</h3>
                  <p className="text-gray-600">Müşterinin kullanım amacını ve önceliklerini belirtin</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Öneri Alın</h3>
                  <p className="text-gray-600">AI destekli lens ve kaplama önerisi alın</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNext()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
          >
            Başla
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
