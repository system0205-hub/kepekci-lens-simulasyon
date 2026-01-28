import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import LocalStorageService from '../../core/storage/LocalStorageService';
import ChangeLog from '../../core/storage/ChangeLog';

const STORAGE_KEY = 'coatingTypes';

export default function CoatingEditor({ onBack }) {
  const [coatingTypes, setCoatingTypes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
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

  const handleSelect = (item) => {
    setSelectedId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      keywords: item.keywords.join(', '),
      price: item.price
    });
  };

  const handleNew = () => {
    setSelectedId(null);
    setFormData({
      name: '',
      description: '',
      keywords: '',
      price: ''
    });
  };

  const handleSave = () => {
    const newItem = {
      id: selectedId || Date.now(),
      name: formData.name,
      description: formData.description,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      price: parseFloat(formData.price)
    };

    const oldItem = selectedId ? coatingTypes.find(item => item.id === selectedId) : null;

    let updated;
    if (selectedId) {
      updated = coatingTypes.map(item => item.id === selectedId ? newItem : item);
    } else {
      updated = [...coatingTypes, newItem];
    }

    setCoatingTypes(updated);
    LocalStorageService.set(STORAGE_KEY, updated);
    
    ChangeLog.log({
      action: selectedId ? 'update' : 'create',
      collection: 'coatingTypes',
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
    if (window.confirm('Bu kaplama türünü silmek istediğinize emin misiniz?')) {
      const oldItem = coatingTypes.find(item => item.id === id);
      const updated = coatingTypes.filter(item => item.id !== id);
      setCoatingTypes(updated);
      LocalStorageService.set(STORAGE_KEY, updated);
      
      ChangeLog.log({
        action: 'delete',
        collection: 'coatingTypes',
        itemId: id,
        oldValue: oldItem,
        newValue: null,
        user: 'admin'
      });

      if (selectedId === id) {
        setSelectedId(null);
        setFormData({
          name: '',
          description: '',
          keywords: '',
          price: ''
        });
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      <div className="w-1/3 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Kaplama Türleri
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
          {coatingTypes.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedId === item.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.price.toLocaleString('tr-TR')} TL
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
            {selectedId ? 'Düzenle' : 'Yeni Kaplama Türü'}
          </h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div>
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
            <div>
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
            <div>
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
