import { useState } from 'react';
import { useAuth } from '../core/storage/LocalStorageService';
import { formatTL } from '@shared/utils/formatting';

export default function PricingSettings() {
  const { session, logout } = useAuth();
  const config = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');

  const [priceRanges, setPriceRanges] = useState(config.priceRanges || {});
  const [laborCost, setLaborCost] = useState(config.laborCost || 600);
  const [sgkContribution, setSGKContribution] = useState(config.sgkContribution || 150);
  const [coatingPrices, setCoatingPrices] = useState(config.coatingPrices || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem('kepekci-lens-admin-config', JSON.stringify({
        ...config,
        priceRanges,
        laborCost,
        sgkContribution,
        coatingPrices,
      }));
      alert('Ayarlar kaydedildi!');
    } catch (err) {
      console.error('Kaydetme hatası:', err);
      setError('Kaydetme başarısız!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-900">
      {session && (
        <nav className="bg-white shadow-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">Fiyat Yönetimi</h1>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Fiyat Ayarları</h1>

        <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Aralık Bazlı Fiyatlandırma</h2>

            <div className="space-y-4">
              {['1.50', '1.56', '1.60', '1.67', '1.74'].map(index => (
                <div key={index} className="border-2 border-slate-200 rounded-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-800">{index} İndeksi</h3>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(priceRanges[index] || {}).map(([rangeKey, range], idx) => (
                      <div key={rangeKey} className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-slate-600 mb-2">
                            Min Diopter
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={range.min}
                            onChange={(e) => {
                              setPriceRanges({
                                ...priceRanges,
                                [index]: {
                                  ...(priceRanges[index] || {}),
                                  [rangeKey]: { ...range, min: parseFloat(e.target.value) },
                                },
                              });
                            }}
                            className="w-24 px-4 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-slate-600 mb-2">
                            Max Diopter
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={range.max}
                            onChange={(e) => {
                              setPriceRanges({
                                ...priceRanges,
                                [index]: {
                                  ...(priceRanges[index] || {}),
                                  [rangeKey]: { ...range, max: parseFloat(e.target.value) },
                                },
                              });
                            }}
                            className="w-24 px-4 py-2 border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div className="text-center font-mono text-sm text-slate-500">
                          {formatTL(range.price)}
                        </div>
                        <button
                          onClick={() => {
                            setPriceRanges({
                              ...priceRanges,
                              [index]: {
                                ...(priceRanges[index] || {}),
                                [rangeKey]: undefined,
                              },
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          const newRange = {
                            min: 0,
                            max: 20,
                            price: 5000,
                          };
                          setPriceRanges({
                            ...priceRanges,
                            [index]: {
                              ...(priceRanges[index] || {}),
                              [Object.keys(priceRanges[index] || {}).length]: newRange,
                            },
                          });
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        + Yeni Aralık
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">İşçilik</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-600">İşçilik (TL)</label>
                  <input
                    type="number"
                    min="0"
                    value={laborCost}
                    onChange={(e) => setLaborCost(parseFloat(e.target.value))}
                    className="w-24 px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <span className="text-slate-500">{formatTL(laborCost)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-600">SGK Katkısı (TL)</label>
                  <input
                    type="number"
                    min="0"
                    value={sgkContribution}
                    onChange={(e) => setSGKContribution(parseFloat(e.target.value))}
                    className="w-24 px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <span className="text-slate-500">{formatTL(sgkContribution)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Kaplama Fiyatları</h2>

            <div className="space-y-4">
              {Object.entries(coatingPrices).map(([coating, prices]) => (
                <div key={coating} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <span className="font-semibold text-slate-700">{coating}</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={prices.blueCut || 600}
                    onChange={(e) => {
                      setCoatingPrices({
                        ...coatingPrices,
                        [coating]: {
                          ...(coatingPrices[coating] || {}),
                          blueCut: parseFloat(e.target.value),
                        },
                      });
                    }}
                    className="w-32 px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{formatTL(prices.blueCut)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className={[
                "px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700",
                loading ? "opacity-50 cursor-not-allowed" : ""
              ].join(" ")}
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <span className="text-white">{error}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
