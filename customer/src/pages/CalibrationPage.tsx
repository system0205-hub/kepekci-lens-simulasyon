import React, { useState, useMemo, useEffect } from 'react';
// @ts-ignore
import LensVisualizer3D from '../components/simulation/LensVisualizer3D';

// Önceden tanımlı diyoptri listesi (-0.25'ten -10.00'a)
const DIOPTERS = [
    -0.25, -0.50, -0.75, -1.00, -1.25, -1.50, -1.75,
    -2.00, -2.25, -2.50, -2.75, -3.00, -3.50, -4.00,
    -4.50, -5.00, -5.50, -6.00, -6.50, -7.00, -7.50,
    -8.00, -8.50, -9.00, -9.50, -10.00
];

export const CalibrationPage: React.FC = () => {
    const [selectedDiopter, setSelectedDiopter] = useState(-3.00);
    const [edgeThickness, setEdgeThickness] = useState(4.0); // mm
    const [centerThickness, setCenterThickness] = useState(1.5); // mm
    const [generatedConfig, setGeneratedConfig] = useState<Record<string, { edge: number, center: number }>>({});

    // Seçili diyoptri değiştiğinde varsa kayıtlı ayarı yükle, yoksa varsayılanı (tahmini) koy
    useEffect(() => {
        if (generatedConfig[selectedDiopter]) {
            setEdgeThickness(generatedConfig[selectedDiopter].edge);
            setCenterThickness(generatedConfig[selectedDiopter].center);
        } else {
            // Basit bir varsayılan (Sagir formülü yerine lineer artış tahmini)
            setEdgeThickness(Math.abs(selectedDiopter) * 0.8 + 1.5);
            setCenterThickness(1.5);
        }
    }, [selectedDiopter]); // generatedConfig bağımlılığı eklenmemeli (loop olur)

    const stats = useMemo(() => ({
        center: centerThickness,
        edge: edgeThickness,
        sag: 0,
        diameter: 70
    }), [centerThickness, edgeThickness]);

    const handleSave = () => {
        setGeneratedConfig(prev => ({
            ...prev,
            [selectedDiopter]: { edge: parseFloat(edgeThickness.toFixed(2)), center: parseFloat(centerThickness.toFixed(2)) }
        }));
    };

    const copyConfig = () => {
        navigator.clipboard.writeText(JSON.stringify(generatedConfig, null, 2));
        alert("Ayarlar kopyalandı!");
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            {/* Kontrol Paneli */}
            <div className="w-96 p-6 border-r border-slate-700 overflow-y-auto h-full flex flex-col bg-slate-950">
                <h1 className="text-xl font-bold mb-6 text-teal-400">Lens Kalibrasyon Aracı</h1>
                <p className="text-xs text-slate-400 mb-6">
                    Diyoptri seçin, slider ile kalınlığı görsel olarak ayarlayın ve "Kaydet"e basın.
                    Tüm numaralar bitince alttaki JSON'ı kopyalayıp geliştiriciye iletin.
                </p>

                <div className="mb-6">
                    <label className="block text-sm text-slate-400 mb-2">Diyoptri Seç</label>
                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-900 rounded border border-slate-800">
                        {DIOPTERS.map(d => (
                            <button
                                key={d}
                                onClick={() => setSelectedDiopter(d)}
                                className={`p-1.5 text-xs rounded border transition-colors ${selectedDiopter === d ? 'bg-teal-600 border-teal-500 text-white font-bold' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                            >
                                {d.toFixed(2)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-6 space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-white">Kenar Kalınlığı</label>
                            <span className="text-sm font-mono text-teal-400">{edgeThickness.toFixed(2)} mm</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="20"
                            step="0.1"
                            value={edgeThickness}
                            onChange={(e) => setEdgeThickness(parseFloat(e.target.value))}
                            className="w-full accent-teal-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-white">Merkez Kalınlığı</label>
                            <span className="text-sm font-mono text-teal-400">{centerThickness.toFixed(2)} mm</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="10"
                            step="0.1"
                            value={centerThickness}
                            onChange={(e) => setCenterThickness(parseFloat(e.target.value))}
                            className="w-full accent-teal-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold mb-8 transition-colors shadow-lg shadow-blue-900/20"
                >
                    💾 Bu Ayarı Kaydet
                </button>

                <div className="flex-1 min-h-0 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-slate-500 font-bold uppercase">Çıktı (JSON)</span>
                        <button onClick={copyConfig} className="text-xs text-teal-400 hover:text-teal-300">Kopyala</button>
                    </div>
                    <div className="flex-1 bg-black p-3 rounded border border-slate-800 overflow-auto font-mono text-[10px] text-green-400">
                        <pre>{JSON.stringify(generatedConfig, null, 2)}</pre>
                    </div>
                </div>
            </div>

            {/* Görselleştirme Alanı */}
            <div className="flex-1 bg-black relative flex items-center justify-center">
                <div className="w-full h-full">
                    <LensVisualizer3D
                        diopter={selectedDiopter}
                        index={1.5}
                        diameter={70}
                        showComparison={false}
                        customStats={stats}
                    />
                </div>
                <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-xl text-white shadow-2xl">
                    <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Seçili Diyoptri</div>
                    <div className="text-3xl font-black text-white">{selectedDiopter.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
};
