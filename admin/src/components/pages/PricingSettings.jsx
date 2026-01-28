import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react';
import LocalStorageService from '../../core/storage/LocalStorageService';

const STORAGE_KEY = 'pricingRules';

export default function PricingSettings({ onBack }) {
  const [pricingRules, setPricingRules] = useState([]);
  const [editingId, setEditingId] = useState(null);
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

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      minPower: '',
      maxPower: '',
      minPrice: '',
      maxPrice: '',
      coatingPrice: ''
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      minPower: item.minPower,
      maxPower: item.maxPower,
      minPrice: item.minPrice,
      maxPrice: item.maxPrice,
      coatingPrice: item.coatingPrice
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu fiyatlandırma kuralını silmek istediğinize emin misiniz?')) {
      const updated = pricingRules.filter(item => item.id !== id);
      setPricingRules(updated);
      LocalStorageService.set(STORAGE_KEY, updated);
    }
  };

  const handleSave = () => {
    const newItem = {
      id: editingId || Date.now(),
      minPower: parseFloat(formData.minPower),
      maxPower: parseFloat(formData.maxPower),
      minPrice: parseFloat(formData.minPrice),
      maxPrice: parseFloat(formData.maxPrice),
      coatingPrice: parseFloat(formData.coatingPrice)
    };

    let updated;
    if (editingId) {
      updated = pricingRules.map(item => item.id === editingId ? newItem : item);
    } else {
      updated = [...pricingRules, newItem];
    }

    setPricingRules(updated);
    LocalStorageService.set(STORAGE_KEY, updated);
    setEditingId(null);
    setFormData({
      minPower: '',
      maxPower: '',
      minPrice: '',
      maxPrice: '',
      coatingPrice: ''
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
          Fiyatlandırma
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Ekle
        </button>
      </div>

      {(editingId !== null || (editingId === null && formData.minPower)) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Düzenle' : 'Yeni Fiyatlandırma Kuralı'}
          </h2>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Güç Aralığı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Fiyat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Fiyat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kaplama Fiyatı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pricingRules.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.minPower} - {item.maxPower} D
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.minPrice.toLocaleString('tr-TR')} TL
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.maxPrice.toLocaleString('tr-TR')} TL
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.coatingPrice.toLocaleString('tr-TR')} TL
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
