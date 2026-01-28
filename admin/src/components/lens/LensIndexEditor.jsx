import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import LocalStorageService from '../../core/storage/LocalStorageService';
import ChangeLog from '../../core/storage/ChangeLog';

const STORAGE_KEY = 'lensIndices';

export default function LensIndexEditor({ onBack }) {
  const [lensIndices, setLensIndices] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
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

  const handleSelect = (item) => {
    setSelectedId(item.id);
    setFormData({
      index: item.index,
      brand: item.brand,
      supplier: item.supplier,
      minPower: item.minPower,
      maxPower: item.maxPower,
      price: item.price
    });
  };

  const handleNew = () => {
    setSelectedId(null);
    setFormData({
      index: '',
      brand: '',
      supplier: '',
      minPower: '',
      maxPower: '',
      price: ''
    });
  };

  const handleSave = () => {
    const newItem = {
      id: selectedId || Date.now(),
      index: parseFloat(formData.index),
      brand: formData.brand,
      supplier: formData.supplier,
      minPower: parseFloat(formData.minPower),
      maxPower: parseFloat(formData.maxPower),
      price: parseFloat(formData.price)
    };

    const oldItem = selectedId ? lensIndices.find(item => item.id === selectedId) : null;

    let updated;
    if (selectedId) {
      updated = lensIndices.map(item => item.id === selectedId ? newItem : item);
    } else {
      updated = [...lensIndices, newItem];
    }

    setLensIndices(updated);
    LocalStorageService.set(STORAGE_KEY, updated);
    
    ChangeLog.log({
      action: selectedId ? 'update' : 'create',
      collection: 'lensIndices',
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
    if (window.confirm('Bu lens indeksini silmek istediğinize emin misiniz?')) {
      const oldItem = lensIndices.find(item => item.id === id);
      const updated = lensIndices.filter(item => item.id !== id);
      setLensIndices(updated);
      LocalStorageService.set(STORAGE_KEY, updated);
      
      ChangeLog.log({
        action: 'delete',
        collection: 'lensIndices',
        itemId: id,
        oldValue: oldItem,
        newValue: null,
        user: 'admin'
      });

      if (selectedId === id) {
        setSelectedId(null);
        setFormData({
          index: '',
          brand: '',
          supplier: '',
          minPower: '',
          maxPower: '',
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
            Lens İndeksleri
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
          {lensIndices.map((item) => (
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
                    {item.index.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.brand}
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
            {selectedId ? 'Düzenle' : 'Yeni Lens İndeksi'}
          </h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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
