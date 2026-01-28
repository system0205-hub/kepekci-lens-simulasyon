import { useState } from 'react';
import { useAuth } from '../../core/storage/LocalStorageService';
import { COATING_RULES } from '../../core/rules/coatingRules';

export default function UsageKeywords() {
  const { session, logout } = useAuth();
  const config = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');

  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentConfig = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');
      localStorage.setItem('kepekci-lens-admin-config', JSON.stringify({
        ...currentConfig,
        usageKeywords: selectedKeywords,
      }));
      
      setTimeout(() => {
        setLoading(false);
        alert('Anahtar kelimeler kaydedildi!');
      }, 500);
    } catch (err) {
      console.error('Kaydetme hatası:', err);
      setError('Kaydetme başarısız!');
      setLoading(false);
    }
  };

  const addKeyword = () => {
    const keyword = prompt('Yeni anahtar kelime girin:');
    if (keyword && keyword.trim()) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setSelectedKeywords(selectedKeywords.filter(k => k !== keywordToRemove));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-900">
      {session ? (
        <nav className="bg-white shadow-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">
                Kullanım Anahtar Kelimeleri
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
          Mevcut Anahtar Kelimeleri
        </h2>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            {selectedKeywords.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-4 border-b border-slate-200 rounded-lg">
                <span className="text-lg font-semibold text-slate-900">{keyword}</span>
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            
            {selectedKeywords.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                Henüz anahtar kelime tanımlı yok
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={addKeyword}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              + Yeni Kelime Ekle
            </button>
            <button
              onClick={handleSave}
              disabled={loading || selectedKeywords.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 cursor-not-allowed"
              >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
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
