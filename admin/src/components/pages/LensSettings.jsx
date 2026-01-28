import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react';
import LocalStorageService from '../../core/storage/LocalStorageService';

const STORAGE_KEY = 'lensIndices';

export default function LensSettings({ onBack }) {
  const [lensIndices, setLensIndices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    index: '',
    brand: '',
    supplier: '',
    minPower: '',
    maxPower: '',
    price: ''
  });

  useEffect(() => {
    loadLensIndices();
  }, []);

  const loadLensIndices = () => {
    const data = LocalStorageService.get(STORAGE_KEY, []);
    if (data.length === 0) {
      const defaultData = [
        { id: 1, index: 1.50, brand: 'Standard', supplier: 'Genel', minPower: 0, maxPower: 6, price: 1200 },
        { id: 2, index: 1.56, brand: 'Standard', supplier: 'Genel', minPower: 0, maxPower: 8, price: 1800 },
        { id: 3, index: 1.60, brand: 'Premium', supplier: 'Essilor', minPower: 0, maxPower: 10, price: 2400 },
        { id: 4, index: 1.67, brand: 'Ultra Thin', supplier: 'Zeiss', minPower: 0, maxPower: 12, price: 3200 },
        { id: 5, index: 1.74, brand: 'Ultra Thin', supplier: 'Hoya', minPower: 0, maxPower: 20, price: 4800 }
      ];
      setLensIndices(defaultData);
      LocalStorageService.set(STORAGE_KEY, defaultData);
    } else {
      setLensIndices(data);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      index: '',
      brand: '',
      supplier: '',
      minPower: '',
      maxPower: '',
      price: ''
    });
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      index: item.index,
      brand: item.brand,
      supplier: item.supplier,
      minPower: item.minPower,
      maxPower: item.maxPower,
      price: item.price
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu lens indeksini silmek istediğinize emin misiniz?')) {
      const updated = lensIndices.filter(item => item.id !== id);
      setLensIndices(updated);
      LocalStorageService.set(STORAGE_KEY, updated);
    }
  };

  const handleSave = () => {
    const newItem = {
      id: editingId || Date.now(),
      index: parseFloat(formData.index),
      brand: formData.brand,
      supplier: formData.supplier,
      minPower: parseFloat(formData.minPower),
      maxPower: parseFloat(formData.maxPower),
      price: parseFloat(formData.price)
    };

    let updated;
    if (editingId) {
      updated = lensIndices.map(item => item.id === editingId ? newItem : item);
    } else {
      updated = [...lensIndices, newItem];
    }

    setLensIndices(updated);
    LocalStorageService.set(STORAGE_KEY, updated);
    setEditingId(null);
    setFormData({
      index: '',
      brand: '',
      supplier: '',
      minPower: '',
      maxPower: '',
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
          Lens İndeksleri
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Ekle
        </button>
      </div>

      {(editingId !== null || (editingId === null && formData.index)) && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Düzenle' : 'Yeni Lens İndeksi'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İndeks
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.index}
                onChange={(e) => setFormData({ ...formData, index: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1.50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marka
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Standard"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tedarikçi
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Genel"
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
                placeholder="1200"
              />
            </div>
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
                placeholder="6"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İndeks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marka</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tedarikçi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Güç Aralığı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lensIndices.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.index.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.brand}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.supplier}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {item.minPower} - {item.maxPower} D
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
