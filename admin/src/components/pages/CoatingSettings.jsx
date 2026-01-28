import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react';
import LocalStorageService from '../../core/storage/LocalStorageService';

const STORAGE_KEY = 'coatingTypes';

export default function CoatingSettings({ onBack }) {
  const [coatingTypes, setCoatingTypes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keywords: '',
    price: ''
  });

  useEffect(() => {
    loadCoatingTypes();
  }, []);

  const loadCoatingTypes = () => {
    const data = LocalStorageService.get(STORAGE_KEY, []);
    if (data.length === 0) {
      const defaultData = [
        {
          id: 1,
          name: 'Blue Cut',
          description: 'Mavi ışık filtreli dijital koruma',
          keywords: ['ekran', 'bilgisayar', 'telefon', 'dijital', 'ofis'],
          price: 600
        },
        {
          id: 2,
          name: 'Anti-Refleks',
          description: 'Yansıma önleyici yüksek kaliteli lens',
          keywords: ['gece', 'sürüş', 'ofis', 'okuma', 'bilgisayar'],
          price: 800
        },
        {
          id: 3,
          name: 'Photochromic',
          description: 'Işığa göre renk değiştiren lens',
          keywords: ['güneş', 'dış mekan', 'spor', 'yürüyüş', 'sürüş'],
          price: 1200
        },
        {
          id: 4,
          name: 'Polarize',
          description: 'Parlamayı önleyen güneş gözlüğü',
          keywords: ['güneş', 'sürüş', 'deniz', 'kar', 'yansıma'],
          price: 1500
        },
        {
          id: 5,
          name: 'Anti-Scratch',
          description: 'Çizilmelere dayanıklı yüzey',
          keywords: ['çizik', 'dayanıklı', 'koruma', 'temiz'],
          price: 400
        },
        {
          id: 6,
          name: 'Super Hydrophobic',
          description: 'Su ve toz itici kaplama',
          keywords: ['su', 'toz', 'temiz', 'kirlilik', 'yağmur'],
          price: 700
        }
      ];
      setCoatingTypes(defaultData);
      LocalStorageService.set(STORAGE_KEY, defaultData);
    } else {
      setCoatingTypes(data);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      keywords: '',
      price: ''
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      keywords: item.keywords.join(', '),
      price: item.price
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu kaplama türünü silmek istediğinize emin misiniz?')) {
      const updated = coatingTypes.filter(item => item.id !== id);
      setCoatingTypes(updated);
      LocalStorageService.set(STORAGE_KEY, updated);
    }
  };

  const handleSave = () => {
    const newItem = {
      id: editingId || Date.now(),
      name: formData.name,
      description: formData.description,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      price: parseFloat(formData.price)
    };

    let updated;
    if (editingId) {
      updated = coatingTypes.map(item => item.id === editingId ? newItem : item);
    } else {
      updated = [...coatingTypes, newItem];
    }

    setCoatingTypes(updated);
    LocalStorageService.set(STORAGE_KEY, updated);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      keywords: '',
      price: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Geri
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Kaplama Türleri
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Ekle
        </button>
      </div>

      {(editingId !== null || (editingId === null && formData.name)) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Düzenle' : 'Yeni Kaplama Türü'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İsim
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Blue Cut"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Mavi ışık filtreli dijital koruma"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anahtar Kelimeler (virgül ile ayırın)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ekran, bilgisayar, telefon, dijital, ofis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat (TL)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="600"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Kaydet
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İsim</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anahtar Kelimeler</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coatingTypes.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.description}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex flex-wrap gap-1">
                    {item.keywords.slice(0, 3).map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                        {keyword}
                      </span>
                    ))}
                    {item.keywords.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{item.keywords.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.price.toLocaleString('tr-TR')} TL
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
