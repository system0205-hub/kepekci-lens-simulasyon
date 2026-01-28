import { useState } from 'react';
import { useAuth } from '../../core/storage/LocalStorageService';
import { COATING_RULES } from '../../core/rules/coatingRules';

export default function IndexRules() {
  const { session, logout } = useAuth();
  const config = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');

  const [selectedRules, setSelectedRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentConfig = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');
      localStorage.setItem('kepekci-lens-admin-config', JSON.stringify({
        ...currentConfig,
        indexRules: selectedRules,
      }));
      
      setTimeout(() => {
        setLoading(false);
        alert('Kuralar kaydedildi!');
      }, 500);
    } catch (err) {
      console.error('Kaydetme hatası:', err);
      setError('Kaydetme başarısız!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-900">
      {session ? (
        <nav className="bg-white shadow-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">
                İndeks Önerisi Kuralları
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
      )}
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Mevcut Kuralar
        </h2>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            {INDEX_RECOMMENDATION_RULES.map((rule, index) => (
              <div key={index} className="border-2 border-slate-200 rounded-xl p-4 hover:border-indigo-500">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-800">{rule.condition}</h3>
                  <span className="text-sm text-slate-600">→ {rule.recommendation}</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      const newRules = selectedRules.includes(index) 
                        ? selectedRules.filter(r => r !== index) 
                        : [...selectedRules, index];
                      setSelectedRules(newRules);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                  >
                    {selectedRules.includes(index) ? 'Seçimi Kaldır' : 'Seç'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading || selectedRules.length === 0}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 cursor-not-allowed"
              >
              {loading ? 'Kaydediliyor...' : 'Kuraları Kaydet'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <span className="text-white">{error}</span>
          </div>
        )}
      </main>
    </>
  );
}
