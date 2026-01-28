import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import LensSettings from './pages/LensSettings';
import PricingSettings from './pages/PricingSettings';
import CoatingSettings from './pages/CoatingSettings';
import RuleEngineEditor from './components/rules/RuleEngineEditor';
import { LogOut, LayoutDashboard } from 'lucide-react';
import Auth from './core/security/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const auth = Auth.check();
    if (auth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    Auth.logout();
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'lens', label: 'Lens İndeksleri', icon: <span className="w-5 h-5 text-center">👓</span> },
    { id: 'pricing', label: 'Fiyatlandırma', icon: <span className="w-5 h-5 text-center">💰</span> },
    { id: 'coating', label: 'Kaplamalar', icon: <span className="w-5 h-5 text-center">🛡️</span> },
    { id: 'rules', label: 'Kural Motoru', icon: <span className="w-5 h-5 text-center">⚙️</span> }
  ];

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside
          className={`${isSidebarOpen ? 'w-64' : 'w-20'
            } bg-gray-900 min-h-screen transition-all duration-300`}
        >
          <div className="p-4 border-b border-gray-800">
            <h1 className={`text-xl font-bold text-white ${!isSidebarOpen && 'hidden'}`}>
              Kepekcı Admin
            </h1>
            {!isSidebarOpen && (
              <div className="text-2xl text-center text-white">👓</div>
            )}
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
                  }`}
              >
                {item.icon}
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Çıkış</span>}
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
            {currentPage === 'lens' && <LensSettings onBack={() => handleNavigate('dashboard')} />}
            {currentPage === 'pricing' && <PricingSettings onBack={() => handleNavigate('dashboard')} />}
            {currentPage === 'coating' && <CoatingSettings onBack={() => handleNavigate('dashboard')} />}
            {currentPage === 'rules' && <RuleEngineEditor onBack={() => handleNavigate('dashboard')} />}
          </div>
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
