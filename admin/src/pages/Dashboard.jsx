import React, { useState } from 'react';
import { useAuth } from '../core/storage/LocalStorageService';
import { AuthService } from '../core/security/PasswordHash';
import {
  LayoutDashboard,
  Settings,
  DollarSign,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  LogOut
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const { session, logout } = useAuth();
  const config = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChangeLog, setShowChangeLog] = useState(false);

  const stats = [
    {
      label: 'Toplam Lens İndeksi',
      value: config.indexes?.length || '0',
      icon: <Eye className="w-6 h-6" />,
      color: 'blue',
      trend: '+0'
    },
    {
      label: 'Kaplama Türleri',
      value: Object.keys(config.coatingPrices || {}).length || '0',
      icon: <Shield className="w-6 h-6" />,
      color: 'green',
      trend: '+0'
    },
    {
      label: 'Fiyat Aralıkları',
      value: '8', // Dynamic value todo
      icon: <DollarSign className="w-6 h-6" />,
      color: 'purple',
      trend: '+0'
    },
    {
      label: 'Sistem Aktif',
      value: 'OK',
      icon: <Activity className="w-6 h-6" />,
      color: 'orange',
      trend: 'Online'
    }
  ];

  const recentActivities = config.changeLog ? config.changeLog.slice(0, 5) : [];

  const menuItems = [
    {
      title: 'Lens Ayarları',
      icon: <Eye className="w-5 h-5" />,
      description: 'Lens indeksleri ve referans verileri',
      onClick: () => onNavigate('lens')
    },
    {
      title: 'Fiyatlandırma',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Lens ve kaplama fiyatları',
      onClick: () => onNavigate('pricing')
    },
    {
      title: 'Kaplamalar',
      icon: <Shield className="w-5 h-5" />,
      description: 'Kaplama türleri ve özellikleri',
      onClick: () => onNavigate('coating')
    },
    {
      title: 'Kural Motoru',
      icon: <Activity className="w-5 h-5" />,
      description: 'İndeks ve kaplama öneri kuralları',
      onClick: () => onNavigate('rules')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600' }
    };
    return colors[color] || colors.blue;
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const currentConfig = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');

      if (newPassword) {
        const newHash = await AuthService.hashPassword(newPassword);
        localStorage.setItem('kepekci-lens-admin-config', JSON.stringify({
          ...currentConfig,
          passwordHash: newHash,
        }));
        setNewPassword('');
        alert('Şifre değiştirildi!');
      }
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    localStorage.setItem('kepekci-lens-admin-config', JSON.stringify({
      ...config,
      changeLog: [],
    }));
    // Force refresh or state update would be better here
    alert('Loglar temizlendi! (Sayfa yenilenecek)');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Yönetim Paneli
          </h1>
          <p className="text-gray-600 mt-1">
            Kepekcı Lens sisteminizi buradan yönetin
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">Sistem Aktif</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const colorClasses = getColorClasses(stat.color);
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses.bg} rounded-lg flex items-center justify-center ${colorClasses.text}`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat?.trend?.startsWith?.('+') ? 'text-green-600' : 'text-gray-600'}`}>
                  {stat.trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : null}
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-gray-600" />
            Hızlı Menü
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-2 text-gray-600">
                  {item.icon}
                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              Sistem Aktiviteleri
            </h2>
            <button
              onClick={() => setShowChangeLog(!showChangeLog)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showChangeLog ? 'Gizle' : 'Tümünü Gör'}
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 border-b border-gray-50 pb-2 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 bg-blue-500`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('tr-TR')}
                    </p>
                    {activity.details && (
                      <p className="text-xs text-gray-400 truncate">{activity.details}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Henüz aktivite yok.</p>
            )}
          </div>

          {showChangeLog && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yeni Yönetici Şifresi"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleChangePassword}
                  className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                >
                  Şifre Değiştir
                </button>
              </div>
              <button onClick={clearLogs} className="mt-2 text-xs text-red-500 hover:text-red-700">
                Logları Temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
