import { useState } from 'react';
import { useAuth } from '../../../core/storage/LocalStorageService';
import { AuthService } from '../../core/security/PasswordHash';

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const result = await AuthService.login(password);
    
    if (result.success) {
      window.location.href = '/';
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21v19a12h11a-9 12l-11.3-9.5 5.25-4.5.75 5.25-4.5.75 1.5-3.5h-1.5.75a12a7.5a12" />
              </svg>
            </div>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              Yönetim Paneli
            </h1>
            
            <p className="text-slate-600 mb-4">
              Lütfen giriş bilgilerinizi girin
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xl"
                  placeholder="Şifrenizi girin"
                  required
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <span className="text-white">{error}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
