import React from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  DollarSign, 
  Shield, 
  Users, 
  Activity,
  TrendingUp,
  TrendingDown,
  Eye
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const stats = [
    {
      label: 'Toplam Lens İndeksi',
      value: '5',
      icon: <Eye className="w-6 h-6" />,
      color: 'blue',
      trend: '+2'
    },
    {
      label: 'Kaplama Türleri',
      value: '6',
      icon: <Shield className="w-6 h-6" />,
      color: 'green',
      trend: '+1'
    },
    {
      label: 'Fiyat Aralıkları',
      value: '8',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'purple',
      trend: '+3'
    },
    {
      label: 'Aktif Kurallar',
      value: '12',
      icon: <Activity className="w-6 h-6" />,
      color: 'orange',
      trend: '+0'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Lens İndeksi Eklendi', time: '2 saat önce', type: 'add' },
    { id: 2, action: 'Fiyat Güncellendi', time: '5 saat önce', type: 'update' },
    { id: 3, action: 'Kaplama Silindi', time: '1 gün önce', type: 'delete' },
    { id: 4, action: 'Kural Düzenlendi', time: '2 gün önce', type: 'update' }
  ];

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
                <div className={`flex items-center gap-1 text-sm ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend.startsWith('+') ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
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
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-600" />
            Son Aktiviteler
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'add' ? 'bg-green-500' :
                  activity.type === 'delete' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
