import React from 'react';
import { Receipt, Percent, Wrench } from 'lucide-react';

export default function PriceBreakdown({ recommendation }) {
  const { basePrice, coatingPrice, totalPrice } = recommendation;
  
  const laborCost = 600;
  const sgkContribution = 150;
  const hasSGK = false;

  const finalPrice = hasSGK 
    ? totalPrice - sgkContribution
    : totalPrice;

  const discount = hasSGK ? sgkContribution : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
        <Receipt className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Fiyat Kırılımı</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Lens Fiyatı</span>
          <span className="font-semibold text-gray-900">
            {basePrice.toLocaleString('tr-TR')} TL
          </span>
        </div>

        {coatingPrice > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Kaplama Fiyatı</span>
            <span className="font-semibold text-gray-900">
              {coatingPrice.toLocaleString('tr-TR')} TL
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Wrench className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">İşçilik</span>
          </div>
          <span className="font-semibold text-gray-900">
            {laborCost.toLocaleString('tr-TR')} TL
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Percent className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">KDV</span>
          </div>
          <span className="font-semibold text-gray-900">
            %20
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Ara Toplam</span>
          <span className="font-semibold text-gray-900">
            {totalPrice.toLocaleString('tr-TR')} TL
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <Percent className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">SGK İndirimi</span>
            </div>
            <span className="font-semibold text-green-700">
              -{discount.toLocaleString('tr-TR')} TL
            </span>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Toplam Tutar</span>
          <span className="text-2xl font-bold text-blue-600">
            {finalPrice.toLocaleString('tr-TR')} TL
          </span>
        </div>
      </div>

      {discount > 0 && (
        <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2">
          <Percent className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">
            SGK kapsamında <strong>{discount.toLocaleString('tr-TR')} TL</strong> indirim uygulanmıştır.
          </span>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
        <p className="mb-2">
          <strong>KDV Dahil:</strong> Tüm fiyatlar %20 KDV dahildir.
        </p>
        <p>
          <strong>Ödeme Koşulları:</strong> Nakit, kredi kartı veya SGK ödemesi kabul edilir.
        </p>
      </div>
    </div>
  );
}
