import { useState } from 'react';
import { useAuth } from '../../core/storage/LocalStorageService';
import { COATING_RULES } from '../../core/rules/coatingRules';
import { INDEX_RECOMMENDATION_RULES } from '../../core/rules/lensIndexRules';
import { formatTL } from '../../../shared/src/utils/formatting';

export default function RuleEngine() {
  const { session, logout } = useAuth();
  const config = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');

  const [selectedScenario, setSelectedScenario] = useState('general');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newConfig = {
        ...config,
        rules: [
          {
            scenario: selectedScenario,
            condition: selectedCondition || '',
            recommendation: recommendation,
          },
        ],
      };
      
      localStorage.setItem('kepekci-lens-admin-config', JSON.stringify(newConfig));
      
      setTimeout(() => {
        setLoading(false);
        alert('Kural kaydedildi!');
      }, 500);
    } catch (err) {
      console.error('Kural kaydetme hatası:', err);
      setError('Kaydetme başarısız!');
      setLoading(false);
    }
  };

  const renderCoatingRules = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Kaplama Kuralları</h3>
        {COATING_RULES.map(([scenario, coatings]) => (
          <div key={scenario} className="border-2 border-slate-200 rounded-xl p-4">
            <h4 className="text-md font-semibold text-slate-700 mb-2">
              {scenario === 'ekran-agir' && '💻 Ekran Ağır'}
              {scenario === 'gece-surus' && '🚗 Gece Sürüş'}
              {scenario === 'dis-mekan' && '☀️ Dış Mekan'}
              {scenario === 'ofis' && '🏢️ Ofis'}
              {scenario === 'endustriyel' && '🏭️ Endüstriyel'}
              {scenario === 'saglik' && '😎 Sağlık'}
            </h4>
            <div className="mb-3">
              <p className="text-sm text-slate-600 mb-1">Kullanım Senaryosu:</p>
              <p className="text-sm text-slate-800 mb-1">{scenario}</p>
            </div>
            <div className="space-y-2">
              {coatings.map(coating => (
                <div key={coating} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 border-slate-300 rounded"
                    checked={recommendation === coating}
                    onChange={() => setRecommendation(coating)}
                    readOnly
                  />
                  <span className="text-sm font-medium text-slate-700">{coating}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderIndexRules = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 mb-2">İndeks Önerisi Kuralları</h3>
        {INDEX_RECOMMENDATION_RULES.map((rule, index) => (
          <div key={`${index}-${index}`} className="border-2 border-slate-200 rounded-xl p-4">
            <h4 className="text-md font-semibold text-slate-700 mb-2">
              {index}
            </h4>
            <div className="mb-3">
              <p className="text-sm text-slate-600 mb-1">Koşul:</p>
              <p className="text-sm text-slate-800 mb-1">{rule.condition.toString()}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-slate-600 mb-1">Önerilen İndeks:</p>
              <p className="text-sm text-slate-800 mb-1">{rule.recommendation}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Sebep:</label>
              <p className="text-sm text-slate-800 mb-1">{rule.reason}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-900">
      {session ? (
        <>
          <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Kural Motoru</h1>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Kural Motoru Düzenle</h2>
            
            <div className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Senaryo</label>
                <select
                  className="w-full px-4 py-2 border-slate-300 rounded-lg"
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                >
                  <option value="general">Genel</option>
                  <option value="ekran-agir">Ekran Ağır</option>
                  <option value="gece-surus">Gece Sürüş</option>
                  <option value="dis-mekan">Dış Mekan</option>
                  <option value="ofis">Ofis</option>
                  <option value="endustriyel">Endüstriyel</option>
                  <option value="saglik">Sağlık</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Koşul (Diopter Aralığı)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border-slate-300 rounded-lg"
                  placeholder="Örn: d <= 1.00"
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setSelectedScenario('ekran-agir');
                    setRecommendation('blue-cut');
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                  Ekran Ağır → Blue Cut
                </button>
                <button
                  onClick={() => {
                    setSelectedScenario('gece-surus');
                    setRecommendation('anti-refle');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                  Gece Sürüş → Anti-Refle
                </button>
                <button
                  onClick={() => {
                    setSelectedScenario('ofis');
                    setRecommendation('anti-refle');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                  Ofis → Anti-Refle
                </button>
              </div>
              
              <div className="col-span-2">
                <textarea
                  className="w-full px-4 py-2 border-slate-300 rounded-lg"
                  rows="3"
                  placeholder="Özel koşullar (opsiyonel)"
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-not-allowed"
              >
              {loading ? 'Kaydediliyor...' : 'Kuralı Kaydet'}
            </button>
          </div>
          
          <div className="mt-6">
            {selectedScenario === 'coating' && renderCoatingRules()}
            {selectedScenario === 'index' && renderIndexRules()}
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <span className="text-white">{error}</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
