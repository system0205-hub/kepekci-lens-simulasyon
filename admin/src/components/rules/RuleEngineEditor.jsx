import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { LocalStorageService } from '../../core/storage/LocalStorageService';
import ChangeLog from '../../core/storage/ChangeLog';

const STORAGE_KEY = 'ruleEngine';

export default function RuleEngineEditor({ onBack }) {
  const [rules, setRules] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    condition: '',
    action: '',
    priority: ''
  });

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = () => {
    const data = LocalStorageService.get(STORAGE_KEY, []);
    if (data.length === 0) {
      const defaultData = [
        {
          id: 1,
          name: 'Düşük İndeks Önerisi',
          type: 'index',
          condition: 'power < 1.00',
          action: 'recommend: 1.50',
          priority: 1
        },
        {
          id: 2,
          name: 'Orta İndeks Önerisi',
          type: 'index',
          condition: '1.00 <= power <= 2.50',
          action: 'recommend: 1.56',
          priority: 2
        },
        {
          id: 3,
          name: 'Yüksek İndeks Önerisi',
          type: 'index',
          condition: '2.51 <= power <= 4.00',
          action: 'recommend: 1.60',
          priority: 3
        },
        {
          id: 4,
          name: 'Ultra İndeks Önerisi',
          type: 'index',
          condition: 'power > 4.00',
          action: 'recommend: 1.67',
          priority: 4
        },
        {
          id: 5,
          name: 'Blue Cut Kaplama',
          type: 'coating',
          condition: 'usage contains "ekran" OR "bilgisayar" OR "telefon"',
          action: 'recommend: Blue Cut',
          priority: 1
        },
        {
          id: 6,
          name: 'Anti-Refleks Kaplama',
          type: 'coating',
          condition: 'usage contains "gece" OR "sürüş"',
          action: 'recommend: Anti-Refleks',
          priority: 2
        },
        {
          id: 7,
          name: 'Photochromic Kaplama',
          type: 'coating',
          condition: 'usage contains "güneş" OR "dış mekan"',
          action: 'recommend: Photochromic',
          priority: 3
        },
        {
          id: 8,
          name: 'Premium Paket',
          type: 'package',
          condition: 'priority.quality > 70 AND priority.thickness > 70',
          action: 'recommend: premium',
          priority: 1
        },
        {
          id: 9,
          name: 'Economy Paket',
          type: 'package',
          condition: 'priority.price > 70',
          action: 'recommend: economy',
          priority: 2
        },
        {
          id: 10,
          name: 'Standard Paket',
          type: 'package',
          condition: 'DEFAULT',
          action: 'recommend: standard',
          priority: 3
        }
      ];
      setRules(defaultData);
      LocalStorageService.set(STORAGE_KEY, defaultData);
    } else {
      setRules(data);
    }
  };

  const handleSelect = (item) => {
    setSelectedId(item.id);
    setFormData({
      name: item.name,
      type: item.type,
      condition: item.condition,
      action: item.action,
      priority: item.priority
    });
  };

  const handleNew = () => {
    setSelectedId(null);
    setFormData({
      name: '',
      type: '',
      condition: '',
      action: '',
      priority: ''
    });
  };

  const handleSave = () => {
    const newItem = {
      id: selectedId || Date.now(),
      name: formData.name,
      type: formData.type,
      condition: formData.condition,
      action: formData.action,
      priority: parseInt(formData.priority)
    };

    const oldItem = selectedId ? rules.find(item => item.id === selectedId) : null;

    let updated;
    if (selectedId) {
      updated = rules.map(item => item.id === selectedId ? newItem : item);
    } else {
      updated = [...rules, newItem];
    }

    setRules(updated);
    LocalStorageService.set(STORAGE_KEY, updated);

    ChangeLog.log({
      action: selectedId ? 'update' : 'create',
      collection: 'ruleEngine',
      itemId: newItem.id,
      oldValue: oldItem,
      newValue: newItem,
      user: 'admin'
    });

    if (!selectedId) {
      setSelectedId(newItem.id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu kuralı silmek istediğinize emin misiniz?')) {
      const oldItem = rules.find(item => item.id === id);
      const updated = rules.filter(item => item.id !== id);
      setRules(updated);
      LocalStorageService.set(STORAGE_KEY, updated);

      ChangeLog.log({
        action: 'delete',
        collection: 'ruleEngine',
        itemId: id,
        oldValue: oldItem,
        newValue: null,
        user: 'admin'
      });

      if (selectedId === id) {
        setSelectedId(null);
        setFormData({
          name: '',
          type: '',
          condition: '',
          action: '',
          priority: ''
        });
      }
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      index: 'bg-blue-100 text-blue-700',
      coating: 'bg-green-100 text-green-700',
      package: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      <div className="w-1/3 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Kural Motoru
          </h2>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni
          </button>
        </div>
        <div className="space-y-2">
          {rules.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${selectedId === item.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-md ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    #{item.priority}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="font-semibold text-gray-900 text-sm mb-1">
                {item.name}
              </div>
              <div className="text-xs text-gray-600 truncate">
                {item.condition}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-2/3">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedId ? 'Kural Düzenle' : 'Yeni Kural'}
          </h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kural Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Düşük İndeks Önerisi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kural Tipi
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seçin</option>
                <option value="index">İndeks Önerisi</option>
                <option value="coating">Kaplama Önerisi</option>
                <option value="package">Paket Önerisi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Koşul
              </label>
              <textarea
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                rows={3}
                placeholder="power < 1.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Eylem
              </label>
              <input
                type="text"
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="recommend: 1.50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Öncelik
              </label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
