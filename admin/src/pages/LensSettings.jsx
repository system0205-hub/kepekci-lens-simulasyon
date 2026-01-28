import { useState } from 'react';
import { useAuth } from '../core/storage/LocalStorageService';
import { formatTL } from '@shared/utils/formatting';

export default function LensSettings() {
  const { session, logout } = useAuth();
  const config = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showReferenceEditor, setShowReferenceEditor] = useState(false);
  const [error, setError] = useState(null);

  const MAX_INDEXES = ['1.50', '1.56', '1.60', '1.67', '1.74'];

  // Static factors data
  const INDEX_FACTORS = {
    '1.50': { factor: 1.0, label: '1.50 Standart', thinness: 2, priceLevel: 'low' },
    '1.56': { factor: 0.85, label: '1.56 İnceltilmiş', thinness: 5, priceLevel: 'medium' },
    '1.60': { factor: 0.80, label: '1.60 Ekstra İnce', thinness: 7, priceLevel: 'high' },
    '1.67': { factor: 0.67, label: '1.67 Ultra İnce', thinness: 8.5, priceLevel: 'premium' },
    '1.74': { factor: 0.50, label: '1.74 En İnce', thinness: 10, priceLevel: 'ultra' },
  };

  const [editingIndex, setEditingIndex] = useState(null);
  const [referenceCenter, setReferenceCenter] = useState('');
  const [referenceEdge, setReferenceEdge] = useState('');
  const [referenceTotal, setReferenceTotal] = useState('');

  const handleAddIndex = () => {
    const newIndex = prompt('Yeni indeks degeri girin (orneğin 1.56):');
    if (newIndex && !Object.keys(INDEX_FACTORS).includes(newIndex)) {
      alert('Gecersiz index degeri. Sadece sunlar olabilir: ' + MAX_INDEXES.join(', '));
      return;
    }

    if (newIndex) {
      const currentIndexes = config.indexes || [];
      if (currentIndexes.find(i => i.value === newIndex)) {
        alert('Bu indeks zaten ekli!');
        return;
      }

      const newIndexes = [...currentIndexes, {
        value: newIndex,
        label: INDEX_FACTORS[newIndex].label,
        factor: INDEX_FACTORS[newIndex].factor,
        thinness: INDEX_FACTORS[newIndex].thinness,
        priceLevel: INDEX_FACTORS[newIndex].priceLevel,
        referenceData: config.referenceData || {},
      }];

      try {
        localStorage.setItem('kepekci-lens-admin-config', JSON.stringify({
          ...config,
          indexes: newIndexes
        }));
        setEditingIndex(newIndex);
        setTimeout(() => setEditingIndex(null), 100);
      } catch (e) { console.error(e); }
    }
  };

  const handleSaveReference = () => {
    if (!selectedIndex) {
      setError('Lütfen önce bir indeks seçin');
      return;
    }

    const updatedReferenceData = {
      ...config.referenceData,
      [selectedIndex]: {
        center: parseFloat(referenceCenter) || undefined,
        edge: parseFloat(referenceEdge) || undefined,
        total: parseFloat(referenceTotal) || undefined,
      },
    };

    try {
      localStorage.setItem('kepekci-lens-admin-config', JSON.stringify({
        ...config,
        referenceData: updatedReferenceData,
      }));

      alert('Referans verileri güncellendi!');
    } catch (err) {
      console.error('Kaydetme hatası:', err);
      setError('Referans güncelleme başarısız!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-900">
      {session ? (
        <nav className="bg-white shadow-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">
                İndeks Yönetimi
              </h1>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </nav>
      ) : null}

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Mevcut İndeksler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(config.indexes || []).map((indexObj, idx) => (
              <div key={indexObj.value || idx} className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                      <h3 className="text-xl font-bold">{indexObj.label}</h3>
                      <div className="text-sm text-indigo-100">Faktör: {indexObj.factor}</div>
                      <div className="text-sm text-indigo-100">İncelik: {indexObj.thinness}/10</div>
                      <div className="text-sm text-slate-600">Fiyat: {INDEX_FACTORS[indexObj.value]?.priceLevel}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingIndex(indexObj.value);
                      setSelectedIndex(indexObj.value);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    Düzenle
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-end">
              <button
                onClick={handleAddIndex}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                + Yeni İndeks Ekle
              </button>
            </div>
          </div>
        </div>

        {showReferenceEditor && selectedIndex && (
          <div className="mt-8 bg-slate-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Referans Verilerini Düzenle: {INDEX_FACTORS[selectedIndex]?.label}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Merkez Kalınlık (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={referenceCenter}
                  onChange={(e) => setReferenceCenter(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kenar Kalınlığı (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={referenceEdge}
                  onChange={(e) => setReferenceEdge(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Toplam Kalınlık (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={referenceTotal}
                  onChange={(e) => setReferenceTotal(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleSaveReference}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setShowReferenceEditor(false);
                    setEditingIndex(null);
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <span className="text-white">{error}</span>
          </div>
        )}
      </main>
    </div>
  );
}
