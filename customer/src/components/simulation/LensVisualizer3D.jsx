// LensVisualizer3D.jsx - R3F versiyonu (lazy load edilecek)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LensPhysics } from "@shared/utils/LensPhysics";
import { ArrowRightLeft, Eye } from "lucide-react";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, OrbitControls } from "@react-three/drei";

/** Solid lens geometry (LatheGeometry) */
function buildLensGeometry({ centerMm, edgeMm, diameterMm, segments = 160, radialSamples = 90, mmToWorld = 0.03 }) {
    const radius = (diameterMm / 2) * mmToWorld;
    const ct = Math.max(centerMm, 0.5) * mmToWorld;
    const et = Math.max(edgeMm, 0.5) * mmToWorld;
    const p = 1.35;

    const thicknessAt = (r) => {
        const x = THREE.MathUtils.clamp(r / radius, 0, 1);
        const t = ct + (et - ct) * Math.pow(x, p);
        return Math.max(t, 0.001);
    };

    const pts = [];
    const rMin = 0; // Merkezden başla (Delik olmasın, tam dolu)

    for (let i = 0; i <= radialSamples; i++) {
        const r = THREE.MathUtils.lerp(rMin, radius, i / radialSamples);
        const t = thicknessAt(r);
        pts.push(new THREE.Vector2(r, +t / 2));
    }
    for (let i = radialSamples; i >= 0; i--) {
        const r = THREE.MathUtils.lerp(rMin, radius, i / radialSamples);
        const t = thicknessAt(r);
        pts.push(new THREE.Vector2(r, -t / 2));
    }

    const geo = new THREE.LatheGeometry(pts, segments);
    geo.computeVertexNormals();
    return geo;
}

function LensMesh({ thickness, diameterMm, ior, isComparison, viewMode }) {
    const geometry = useMemo(
        () =>
            buildLensGeometry({
                centerMm: thickness.center,
                edgeMm: thickness.edge,
                diameterMm,
                segments: 180,
                radialSamples: 110,
                mmToWorld: 0.05,
            }),
        [thickness.center, thickness.edge, diameterMm]
    );

    const tint = isComparison ? "#b9fff1" : "#ffffff";

    return (
        <mesh geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial
                color="#8ecae6" // Daha tok, doygun bir mavi
                roughness={0.3}
                metalness={0.1}
                flatShading={false}
                side={THREE.DoubleSide} // Her ihtimale karşı iç yüzeyi de renderla
            />
        </mesh>
    );
}

function LensScene({
    viewMode,
    autoRotate,
    manualRotationDeg,
    isDragging,
    stats,
    compStats,
    diameterMm,
    index,
    comparisonIndex,
    showComparison,
}) {
    const groupRef = useRef();

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        // 3D (ISO): Yatık, kendi etrafında dönüyor (Z ekseni çünkü yatık)
        if (viewMode === "iso") {
            // Yumuşak geçişle yatık pozisyona (X=0)
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);

            if (autoRotate && !isDragging) {
                groupRef.current.rotation.y += delta * 0.55;
            } else {
                const target = THREE.MathUtils.degToRad(manualRotationDeg);
                groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, target, 0.18);
            }
        }
        // Yan: Dik, kendi etrafında dönüyor
        else if (viewMode === "side") {
            // Yumuşak geçişle dik pozisyona (X=90)
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 0.1);

            if (autoRotate && !isDragging) {
                groupRef.current.rotation.y += delta * 0.55; // Dik dururken Y ekseninde dön
            } else {
                groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.PI / 2, 0.14);
            }
        }
        // Ön: Dik, sabit (Dönmez)
        else if (viewMode === "front") {
            // Yumuşak geçişle dik pozisyona (X=90)
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.PI / 2, 0.1);
            // Y rotasyonunu sıfırla (tam karşı)
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.14);
        }
    });

    return (
        <>
            <ambientLight intensity={0.35} />
            <directionalLight position={[4, 6, 4]} intensity={1.2} castShadow />
            <spotLight position={[-4, 4.5, 2]} intensity={0.8} angle={0.35} penumbra={0.9} />
            {viewMode === "side" && <directionalLight position={[3, 0, 2]} intensity={0.7} />}

            <Environment preset="city" />

            <group ref={groupRef}>
                {!showComparison ? (
                    <LensMesh thickness={stats} diameterMm={diameterMm} ior={index} isComparison={false} viewMode={viewMode} />
                ) : (
                    <group>
                        <group position={[-1.8, 0, 0]}>
                            <LensMesh thickness={stats} diameterMm={diameterMm} ior={index} isComparison={false} viewMode={viewMode} />
                        </group>
                        {compStats && (
                            <group position={[1.8, 0, 0]}>
                                <LensMesh thickness={compStats} diameterMm={diameterMm} ior={comparisonIndex} isComparison={true} viewMode={viewMode} />
                            </group>
                        )}
                    </group>
                )}
            </group>

            <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={1.5} maxDistance={10} />
        </>
    );
}

export default function LensVisualizer3D({
    diopter = -3.0,
    index = 1.5,
    diameter = 70,
    showComparison = true,
    comparisonIndex = 1.67,
    customStats = null, // Kalibrasyon için dışarıdan veri
}) {
    const [stats, setStats] = useState(null);
    const [compStats, setCompStats] = useState(null);
    const [rotation, setRotation] = useState(60);
    const [isRotating, setIsRotating] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [viewMode, setViewMode] = useState("iso");
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);

    useEffect(() => {
        if (customStats) {
            setStats(customStats);
            setCompStats(null); // Kalibrasyonda karşılaştırma kapatılır
            return;
        }

        const s = LensPhysics.calculateThickness(diopter, index, diameter);
        setStats(s);

        if (showComparison) {
            const c = LensPhysics.calculateThickness(diopter, comparisonIndex, diameter);
            setCompStats(c);
        } else {
            setCompStats(null);
        }
    }, [diopter, index, diameter, showComparison, comparisonIndex, customStats]);

    useEffect(() => {
        if (viewMode === "side") return;
        if (viewMode === "front") return;

        let interval;
        if (autoRotate && !isRotating) {
            interval = setInterval(() => setRotation((r) => (r + 0.3) % 360), 30);
        }
        return () => clearInterval(interval);
    }, [autoRotate, isRotating, viewMode]);

    const improvementPct = useMemo(() => {
        if (!showComparison || !stats || !compStats) return null;
        const a = stats.edge;
        const b = compStats.edge;
        if (!a || a <= 0) return 0;
        return ((a - b) / a) * 100;
    }, [showComparison, stats, compStats]);

    if (!stats) return null;

    // Kamera ayarları - Camları büyütmek için daha da yakınlaştırıldı
    const cameraPos =
        viewMode === "side"
            ? [3.0, 0, 0] // Yan (Daha yakın)
            : viewMode === "front"
                ? [0, 0, 3.2] // Ön (Daha yakın)
                : [2.0, 2.0, 2.0]; // 3D (Daha yakın)

    return (
        <div className="w-full relative bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
            <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "radial-gradient(circle at 50% 30%, #2dd4bf 0%, transparent 50%)" }}
            />

            <div className="relative z-20 flex flex-col md:flex-row items-center justify-between p-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                        <Eye className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-tight">3D Lens Simülasyonu</h3>
                        <p className="text-[10px] text-slate-400">Gerçek mesh • WebGL</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-700">
                    <button
                        onClick={() => { setViewMode("iso"); setAutoRotate(true); }}
                        className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-all ${viewMode === "iso" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                            }`}
                    >
                        3D
                    </button>
                    <button
                        onClick={() => { setViewMode("side"); setAutoRotate(false); }}
                        className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-all ${viewMode === "side" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Yan
                    </button>
                    <button
                        onClick={() => { setViewMode("front"); setAutoRotate(false); }}
                        className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-all ${viewMode === "front" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Ön
                    </button>
                </div>
            </div>

            <div
                className="relative min-h-[500px] flex items-center justify-center p-6 overflow-hidden"
                onMouseDown={() => { setIsRotating(true); setAutoRotate(false); setViewMode("manual"); }}
                onMouseUp={() => setIsRotating(false)}
                onMouseLeave={() => setIsRotating(false)}
                onMouseMove={(e) => { if (isRotating) setRotation((r) => r + e.movementX * 0.5); }}
            >
                <Canvas
                    shadows
                    camera={{ position: cameraPos, fov: 42, near: 0.1, far: 100 }}
                    onPointerDown={() => setIsDraggingCanvas(true)}
                    onPointerUp={() => setIsDraggingCanvas(false)}
                    onPointerLeave={() => setIsDraggingCanvas(false)}
                >
                    <LensScene
                        viewMode={viewMode}
                        autoRotate={autoRotate}
                        manualRotationDeg={rotation}
                        isDragging={isDraggingCanvas || isRotating}
                        stats={stats}
                        compStats={compStats}
                        diameterMm={diameter}
                        index={index}
                        comparisonIndex={comparisonIndex}
                        showComparison={showComparison}
                    />
                </Canvas>

                {showComparison && compStats && (
                    <div className="absolute z-30 flex flex-col items-center justify-center mt-32 pointer-events-none">
                        <div className="bg-slate-900/90 p-2 rounded-full border border-slate-700 mb-2 backdrop-blur shadow-lg">
                            <ArrowRightLeft className="w-4 h-4 text-teal-400" />
                        </div>
                        <div className="text-[10px] text-teal-400 font-bold text-center">
                            %{LensPhysics.calculateImprovement(diopter, comparisonIndex, diameter).toFixed(0)}
                            <span className="block text-[8px] text-teal-500/70">daha ince</span>
                        </div>
                    </div>
                )}

                <div className="absolute z-30 bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
                    <div className="text-center px-5 py-3 rounded-xl backdrop-blur-md border shadow-xl bg-slate-800/50 text-slate-200 border-slate-600/50">
                        <div className="text-[10px] uppercase tracking-wider font-bold mb-1 text-slate-400">
                            Standart {index.toFixed(2)}
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                                <span className="text-[9px] text-white/60 uppercase block">Merkez</span>
                                <span className="font-mono text-lg font-bold">{stats.center.toFixed(1)}</span>
                                <span className="text-[10px] opacity-60">mm</span>
                            </div>
                            <div className="w-px h-8 bg-white/20" />
                            <div className="text-center">
                                <span className="text-[9px] text-white/60 uppercase block">Kenar</span>
                                <span className="font-mono text-lg font-bold">{stats.edge.toFixed(1)}</span>
                                <span className="text-[10px] opacity-60">mm</span>
                            </div>
                        </div>
                        <div className="text-[8px] text-white/50 uppercase mt-1">
                            {diopter < 0 ? "Konkav Lens (Miyopi)" : "Konveks Lens (Hipermetropi)"}
                        </div>
                    </div>

                    {showComparison && compStats && (
                        <div className="text-center px-5 py-3 rounded-xl backdrop-blur-md border shadow-xl bg-teal-900/40 text-teal-100 border-teal-500/50 scale-105 ring-2 ring-teal-500/30">
                            <div className="text-[10px] uppercase tracking-wider font-bold mb-1 text-teal-300">
                                High-Index {comparisonIndex.toFixed(2)}
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <div className="text-center">
                                    <span className="text-[9px] text-white/60 uppercase block">Merkez</span>
                                    <span className="font-mono text-lg font-bold">{compStats.center.toFixed(1)}</span>
                                    <span className="text-[10px] opacity-60">mm</span>
                                </div>
                                <div className="w-px h-8 bg-white/20" />
                                <div className="text-center">
                                    <span className="text-[9px] text-white/60 uppercase block">Kenar</span>
                                    <span className="font-mono text-lg font-bold">{compStats.edge.toFixed(1)}</span>
                                    <span className="text-[10px] opacity-60">mm</span>
                                </div>
                            </div>
                            <div className="text-[8px] text-white/50 uppercase mt-1">
                                {diopter < 0 ? "Konkav Lens (Miyopi)" : "Konveks Lens (Hipermetropi)"}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showComparison && stats && compStats && (
                <div className="relative z-20 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4">
                    <div className="flex items-center justify-center gap-8 md:gap-16">
                        <div className="text-center">
                            <div className="text-[10px] uppercase text-slate-400 mb-1">Standart İndeks</div>
                            <div className="text-xl font-mono text-slate-300">{index.toFixed(2)}</div>
                            <div className="text-sm text-slate-500">{stats.edge.toFixed(1)}mm kenar</div>
                        </div>

                        <div className="text-center px-6 py-2 bg-teal-900/30 rounded-xl border border-teal-500/30">
                            <div className="text-[10px] text-teal-400 font-bold uppercase mb-1">İyileştirme</div>
                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                                -{(stats.edge - compStats.edge).toFixed(1)}mm
                            </div>
                            <div className="text-[10px] text-teal-500/70">%{improvementPct?.toFixed(0)} daha ince</div>
                        </div>

                        <div className="text-center">
                            <div className="text-[10px] uppercase text-teal-400 mb-1">High-Index</div>
                            <div className="text-xl font-mono text-white font-bold">{comparisonIndex.toFixed(2)}</div>
                            <div className="text-sm text-teal-300/70">{compStats.edge.toFixed(1)}mm kenar</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
