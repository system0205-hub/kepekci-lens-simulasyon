import React, { useState, useEffect } from 'react';
import { LensPhysics } from '@shared/utils/LensPhysics';
import { ArrowRightLeft, Eye } from 'lucide-react';

/**
 * Gerçekçi 3D Yuvarlak Lens
 * 
 * - ÖNDEN: Düz yuvarlak cam (kenar görünmez)
 * - YANDAN: Kalın kenar görünür
 * 
 * Kenar segmentleri dışa dönük (perpendicular) yerleştirilir.
 */
const Lens3DRound = ({ thickness, diameter, rotation, label, isComparison = false, diopter }) => {
    const isConcave = diopter < 0;

    const THICKNESS_SCALE = 12;
    const edgeThicknessPx = thickness.edge * THICKNESS_SCALE;

    const lensDiameter = 160;
    const radius = lensDiameter / 2;

    // Kenar renkleri
    const glassColor = isComparison
        ? {
            face: 'rgba(100, 255, 218, 0.25)',
            faceSolid: 'rgba(100, 255, 218, 0.4)',
            edge: 'rgb(100, 255, 218)',
            edgeLight: 'rgb(150, 255, 230)',
            border: 'rgba(100, 255, 218, 0.6)'
        }
        : {
            face: 'rgba(180, 200, 230, 0.25)',
            faceSolid: 'rgba(180, 200, 230, 0.4)',
            edge: 'rgb(210, 225, 245)',
            edgeLight: 'rgb(235, 245, 255)',
            border: 'rgba(180, 200, 230, 0.6)'
        };

    // Kenar segmentleri - daire çevresinde dışa dönük paneller
    // Her segment: çemberin bir parçası, yüzü DIŞA BAKIYOR
    const SEGMENT_COUNT = 72; // Çok segment = düzgün daire
    const segmentWidth = (Math.PI * lensDiameter) / SEGMENT_COUNT + 1; // +1 örtüşme için

    const edgeSegments = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
        const angle = (i / SEGMENT_COUNT) * 360;

        edgeSegments.push(
            <div
                key={i}
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: `${edgeThicknessPx}px`,
                    height: `${segmentWidth}px`,
                    marginLeft: `${-edgeThicknessPx / 2}px`,
                    marginTop: `${-segmentWidth / 2}px`,
                    // Dışa dönük yerleştirme
                    transform: `rotateZ(${angle}deg) translateY(${-radius}px) rotateX(90deg)`,
                    transformOrigin: 'center center',
                    // Dolu arka plan
                    background: `linear-gradient(90deg, 
            ${glassColor.edgeLight} 0%, 
            ${glassColor.edge} 30%,
            ${glassColor.edge} 70%,
            ${glassColor.edgeLight} 100%
          )`,
                    backfaceVisibility: 'hidden',
                }}
            />
        );
    }

    return (
        <div className="flex flex-col items-center gap-3">
            {/* 3D Sahne */}
            <div
                style={{
                    perspective: '600px',
                    width: `${lensDiameter + 60}px`,
                    height: `${lensDiameter + 60}px`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        width: `${lensDiameter}px`,
                        height: `${lensDiameter}px`,
                        transform: `rotateX(15deg) rotateY(${rotation}deg)`,
                        transition: 'transform 0.05s linear',
                    }}
                >
                    {/* ÖN YÜZ - Düz yuvarlak cam */}
                    <div
                        style={{
                            position: 'absolute',
                            width: `${lensDiameter}px`,
                            height: `${lensDiameter}px`,
                            borderRadius: '50%',
                            background: isConcave
                                ? `radial-gradient(circle, ${glassColor.face} 30%, ${glassColor.faceSolid} 90%)`
                                : `radial-gradient(circle, ${glassColor.faceSolid} 0%, ${glassColor.face} 50%, ${glassColor.faceSolid} 100%)`,
                            border: `2px solid ${glassColor.border}`,
                            boxShadow: `inset 0 0 40px rgba(255,255,255,0.2)`,
                            transform: `translateZ(${edgeThicknessPx / 2}px)`,
                            backfaceVisibility: 'hidden',
                        }}
                    >
                        {/* Parlaklık refleksi */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '8%',
                                left: '8%',
                                width: '45%',
                                height: '45%',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7) 0%, transparent 60%)',
                                filter: 'blur(8px)',
                            }}
                        />

                        {/* Konkav çökük efekti */}
                        {isConcave && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '20%',
                                    left: '20%',
                                    width: '60%',
                                    height: '60%',
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(0,0,0,0.08) 0%, transparent 70%)',
                                }}
                            />
                        )}
                    </div>

                    {/* ARKA YÜZ */}
                    <div
                        style={{
                            position: 'absolute',
                            width: `${lensDiameter}px`,
                            height: `${lensDiameter}px`,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${glassColor.face} 50%, ${glassColor.faceSolid} 100%)`,
                            border: `2px solid ${glassColor.border}`,
                            transform: `translateZ(${-edgeThicknessPx / 2}px) rotateY(180deg)`,
                            backfaceVisibility: 'hidden',
                        }}
                    />

                    {/* KENAR SEGMENTLERİ - Dışa dönük, önden görünmez */}
                    <div style={{ transformStyle: 'preserve-3d' }}>
                        {edgeSegments}
                    </div>
                </div>
            </div>

            {/* Bilgi Kartı */}
            <div className={`
          relative z-20 text-center px-4 py-2.5 rounded-xl backdrop-blur-md border shadow-xl transition-all duration-300
          ${isComparison
                    ? 'bg-teal-900/30 text-teal-100 border-teal-500/50 scale-105 ring-2 ring-teal-500/20'
                    : 'bg-slate-800/40 text-slate-200 border-slate-600/50 scale-100'
                }
      `}>
                <div className={`text-[8px] uppercase tracking-[0.15em] font-bold mb-0.5 ${isComparison ? 'text-teal-300' : 'text-slate-400'}`}>
                    {label}
                </div>

                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-[9px] text-white/50 uppercase">Kenar:</span>
                    <span className="font-mono text-xl font-black">
                        {thickness.edge.toFixed(2)}
                    </span>
                    <span className="text-[10px] opacity-60">mm</span>
                </div>

                <div className="text-[7px] text-white/40 uppercase mt-0.5">
                    {isConcave ? 'Konkav - Kenarlar Kalın' : 'Konveks'}
                </div>
            </div>
        </div>
    );
};

export default function LensVisualizer({
    diopter = -2.00,
    index = 1.50,
    diameter = 65,
    showComparison = false,
    comparisonIndex = 1.67
}) {
    const [stats, setStats] = useState(null);
    const [compStats, setCompStats] = useState(null);
    const [rotation, setRotation] = useState(45);
    const [isRotating, setIsRotating] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [viewMode, setViewMode] = useState('iso');

    useEffect(() => {
        setStats(LensPhysics.calculateThickness(diopter, index, diameter));
        if (showComparison) {
            setCompStats(LensPhysics.calculateThickness(diopter, comparisonIndex, diameter));
        }
    }, [diopter, index, diameter, showComparison, comparisonIndex]);

    useEffect(() => {
        if (viewMode === 'side') {
            setRotation(90);
            return;
        }
        if (viewMode === 'front') {
            setRotation(0);
            return;
        }

        let interval;
        if (autoRotate && !isRotating) {
            interval = setInterval(() => {
                setRotation(r => (r + 0.5) % 360);
            }, 30);
        }
        return () => clearInterval(interval);
    }, [autoRotate, isRotating, viewMode]);

    if (!stats) return null;

    return (
        <div className="w-full relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
            <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #2dd4bf 0%, transparent 40%)', transform: 'translateY(-20%)' }}
            />

            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between p-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                        <Eye className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-tight">3D Lens Simülasyonu</h3>
                        <p className="text-[9px] text-slate-400">Gerçekçi Kenar Profili</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-700">
                    <button
                        onClick={() => { setViewMode('iso'); setAutoRotate(true); }}
                        className={`text-[9px] px-2.5 py-1 rounded-full font-medium transition-all ${viewMode === 'iso' ? 'bg-teal-600 text-white' : 'bg-transparent text-slate-400 hover:text-white'
                            }`}
                    >
                        3D
                    </button>
                    <button
                        onClick={() => { setViewMode('side'); setAutoRotate(false); }}
                        className={`text-[9px] px-2.5 py-1 rounded-full font-medium transition-all ${viewMode === 'side' ? 'bg-teal-600 text-white' : 'bg-transparent text-slate-400 hover:text-white'
                            }`}
                    >
                        Yan
                    </button>
                    <button
                        onClick={() => { setViewMode('front'); setAutoRotate(false); }}
                        className={`text-[9px] px-2.5 py-1 rounded-full font-medium transition-all ${viewMode === 'front' ? 'bg-teal-600 text-white' : 'bg-transparent text-slate-400 hover:text-white'
                            }`}
                    >
                        Ön
                    </button>
                </div>
            </div>

            <div
                className="relative min-h-[380px] flex items-center justify-center p-3 cursor-grab active:cursor-grabbing overflow-hidden"
                onMouseDown={() => { setIsRotating(true); setAutoRotate(false); setViewMode('manual'); }}
                onMouseUp={() => setIsRotating(false)}
                onMouseLeave={() => setIsRotating(false)}
                onMouseMove={(e) => {
                    if (isRotating) {
                        setRotation(r => r + e.movementX * 0.5);
                    }
                }}
            >
                <div className={`flex items-center justify-center transition-all duration-700 ${showComparison ? 'gap-3 md:gap-8' : ''}`}>
                    <Lens3DRound
                        thickness={stats}
                        diameter={diameter}
                        rotation={rotation}
                        label={`Standart ${index.toFixed(2)}`}
                        isComparison={false}
                        diopter={diopter}
                    />

                    {showComparison && compStats && (
                        <>
                            <div className="flex flex-col items-center justify-center pointer-events-none">
                                <div className="bg-slate-900 p-1.5 rounded-full border border-slate-700">
                                    <ArrowRightLeft className="w-3 h-3 text-teal-400" />
                                </div>
                                <div className="text-[8px] text-teal-400 mt-1 font-bold">
                                    %{LensPhysics.calculateImprovement(diopter, comparisonIndex, diameter).toFixed(0)}
                                </div>
                            </div>
                            <Lens3DRound
                                thickness={compStats}
                                diameter={diameter}
                                rotation={rotation}
                                label={`High-Index ${comparisonIndex.toFixed(2)}`}
                                isComparison={true}
                                diopter={diopter}
                            />
                        </>
                    )}
                </div>
            </div>

            {showComparison && stats && compStats && (
                <div className="relative z-20 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-3">
                    <div className="flex items-center justify-center gap-5 md:gap-12">
                        <div className="text-center opacity-60">
                            <div className="text-[8px] uppercase text-slate-400">Standart</div>
                            <div className="text-base font-mono text-slate-300">{stats.edge.toFixed(2)}mm</div>
                        </div>

                        <div className="text-center">
                            <div className="text-[9px] text-teal-400 font-bold uppercase">Fark</div>
                            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                                -{(stats.edge - compStats.edge).toFixed(1)}mm
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-[8px] uppercase text-teal-400">High-Index</div>
                            <div className="text-base font-mono text-white font-bold">{compStats.edge.toFixed(2)}mm</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
