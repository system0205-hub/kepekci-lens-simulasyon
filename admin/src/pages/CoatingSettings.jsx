import { useState } from 'react';
import { useAuth } from '../core/storage/LocalStorageService';

export const COATING_RULES = {
  'ekran-agir': ['blue-cut'],
  'gece-surus': ['anti-refle', 'drive'],
  'dis-mekan': ['photochromic'],
  'ofis': ['anti-refle', 'hydrophobic'],
  'endustriyel': ['scratch-resistant', 'anti-fog'],
  'saglik': ['anti-fog', 'anti-refle'],
};

export default function CoatingSettings() {
  const { session, logout } = useAuth();

  const [selectedCoating, setSelectedCoating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = () => {
    setLoading(true);
    setError(null);
    try {
      const currentConfig = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');
      const newCoatings = selectedCoating ? [...(currentConfig.coatings || []), selectedCoating] : (currentConfig.coatings || []).filter(c => c !== selectedCoating);

      localStorage.setItem('kepekci-lens-admin-config', JSON.stringify({
        ...currentConfig,
        coatings: newCoatings,
      }));

      alert('Kaplamalar kaydedildi!');
    } catch (err) {
      console.error('Kaydetme hatası:', err);
      setError('Kaydetme başarısız!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-900">
      {session ? (
        <nav className="bg-white shadow-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">Kaplama Yönetimi</h1>
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
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Kaplama Özellikleri</h1>

        <div className="bg-white rounded-xl p-6 shadow-lg space-y-6">
          {Object.entries(COATING_RULES).map(([scenario, coatings]) => (
            <div key={scenario} className="border-2 border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {scenario === 'ekran-agir' && '💻 Ekran Ağır'}
                {scenario === 'gece-surus' && '🚗 Gece Sürüş'}
                {scenario === 'dis-mekan' && '☀️ Dış Mekan'}
                {scenario === 'ofis' && '🏢️ Ofis'}
                {scenario === 'endustriyel' && '🏭️ Endüstriyel'}
                {scenario === 'saglik' && '😎 Sağlık'}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Kullanım senaryosu: <strong className="text-slate-800">{scenario}</strong>
              </p>
              <div className="space-y-3">
                {coatings.map(coating => {
                  const isActive = selectedCoating === coating;
                  return (
                    <div
                      key={coating}
                      className={[
                        "flex items-center justify-between p-4 rounded-lg cursor-pointer",
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                      ].join(" ")}
                      onClick={() => setSelectedCoating(isActive ? null : coating)}
                    >
                      <span className="text-slate-900">{coating}</span>
                      {isActive && (
                        <span className="ml-2 text-green-600">✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <span className="text-white">{error}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading || !selectedCoating}
            className={[
              "px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700",
              loading ? "opacity-50 cursor-not-allowed" : ""
            ].join(" ")}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </main>
    </div>
  );
}
