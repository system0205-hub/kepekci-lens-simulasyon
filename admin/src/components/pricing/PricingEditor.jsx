import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import LocalStorageService from '../../core/storage/LocalStorageService';
import ChangeLog from '../../core/storage/ChangeLog';

const STORAGE_KEY = 'pricingRules';

export default function PricingEditor({ onBack }) {
  const [pricingRules, setPricingRules] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    minPower: '',
    maxPower: '',
    minPrice: '',
    maxPrice: '',
    coatingPrice: ''
  });

  useEffect(() => {
    loadPricingRules();
  }, []);

  const loadPricingRules = () => {
    const data = LocalStorageService.get(STORAGE_KEY, []);
    if (data.length === 0) {
      const defaultData = [
        { id: 1, minPower: 0, maxPower: 1, minPrice: 1000, maxPrice: 1500, coatingPrice: 600 },
        { id: 2, minPower: 1.01, maxPower: 2, minPrice: 1500, maxPrice: 2000, coatingPrice: 600 },
        { id: 3, minPower: 2.01, maxPower: 3, minPrice: 2000, maxPrice: 2800, coatingPrice: 800 },
        { id: 4, minPower: 3.01, maxPower: 5, minPrice: 2800, maxPrice: 3800, coatingPrice: 800 },
        { id: 5, minPower: 5.01, maxPower: 7, minPrice: 3800, maxPrice: 5000, coatingPrice: 1000 },
        { id: 6, minPower: 7.01, maxPower: 10, minPrice: 5000, maxPrice: 7000, coatingPrice: 1200 },
        { id: 7, minPower: 10.01, maxPower: 15, minPrice: 7000, maxPrice: 10000, coatingPrice: 1500 },
        { id: 8, minPower: 15.01, maxPower: 20, minPrice: 10000, maxPrice: 15000, coatingPrice: 2000 }
      ];
      setPricingRules(defaultData);
      LocalStorageService.set(STORAGE_KEY, defaultData);
    } else {
      setPricingRules(data);
    }
  };

  const handleSelect = (item) => {
    setSelectedId(item.id);
    setFormData({
      minPower: item.minPower,
      maxPower: item.maxPower,
      minPrice: item.minPrice,
      maxPrice: item.maxPrice,
      coatingPrice: item.coatingPrice
    });
  };

  const handleNew = () => {
    setSelectedId(null);
    setFormData({
      minPower: '',
      maxPower: '',
      minPrice: '',
      maxPrice: '',
      coatingPrice: ''
    });
  };

  const handleSave = () => {
    const newItem = {
      id: selectedId || Date.now(),
      minPower: parseFloat(formData.minPower),
      maxPower: parseFloat(formData.maxPower),
      minPrice: parseFloat(formData.minPrice),
      maxPrice: parseFloat(formData.maxPrice),
      coatingPrice: parseFloat(formData.coatingPrice)
    };

    const oldItem = selectedId ? pricingRules.find(item => item.id === selectedId) : null;

    let updated;
    if (selectedId) {
      updated = pricingRules.map(item => item.id === selectedId ? newItem : item);
    } else {
      updated = [...pricingRules, newItem];
    }

    setPricingRules(updated);
    LocalStorageService.set(STORAGE_KEY, updated);
    
    ChangeLog.log({
      action: selectedId ? 'update' : 'create',
      collection: 'pricingRules',
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
    if (window.confirm('Bu fiyatlandırma kuralını silmek istediğinize emin misiniz?')) {
      const oldItem = pricingRules.find(item => item.id === id);
      const updated = pricingRules.filter(item => item.id !== id);
      setPricingRules(updated);
      LocalStorageService.set(STORAGE_KEY, updated);
      
      ChangeLog.log({
        action: 'delete',
        collection: 'pricingRules',
        itemId: id,
        oldValue: oldItem,
        newValue: null,
        user: 'admin'
      });

      if (selectedId === id) {
        setSelectedId(null);
        setFormData({
          minPower: '',
          maxPower: '',
          minPrice: '',
          maxPrice: '',
          coatingPrice: ''
        });
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      <div className="w-1/3 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Fiyatlandırma Kuralları
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
          {pricingRules.map((item) => (
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
                    {item.minPower} - {item.maxPower} D
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.minPrice.toLocaleString('tr-TR')} - {item.maxPrice.toLocaleString('tr-TR')} TL
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
            {selectedId ? 'Düzenle' : 'Yeni Fiyatlandırma Kuralı'}
          </h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Güç (D)
              </label>
              <input
                type="number"
                step="0.25"
                value={formData.minPower}
                onChange={(e) => setFormData({ ...formData, minPower: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Güç (D)
              </label>
              <input
                type="number"
                step="0.25"
                value={formData.maxPower}
                onChange={(e) => setFormData({ ...formData, maxPower: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Fiyat (TL)
              </label>
              <input
                type="number"
                value={formData.minPrice}
                onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Fiyat (TL)
              </label>
              <input
                type="number"
                value={formData.maxPrice}
                onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kaplama Fiyatı (TL)
              </label>
              <input
                type="number"
                value={formData.coatingPrice}
                onChange={(e) => setFormData({ ...formData, coatingPrice: e.target.value })}
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
