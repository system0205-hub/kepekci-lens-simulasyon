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
    const rMin = 0.001 * mmToWorld;

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
                mmToWorld: 0.03,
            }),
        [thickness.center, thickness.edge, diameterMm]
    );

    const tint = isComparison ? "#b9fff1" : "#ffffff";

    return (
        <mesh geometry={geometry} castShadow receiveShadow>
            <MeshTransmissionMaterial
                transmission={1}
                thickness={0.9}
                ior={ior}
                roughness={viewMode === "front" ? 0.09 : 0.06}
                clearcoat={1}
                clearcoatRoughness={0.08}
                chromaticAberration={0.02}
                anisotropy={0.08}
                distortion={0.02}
                distortionScale={0.25}
                attenuationColor={new THREE.Color(tint)}
                attenuationDistance={2.8}
                envMapIntensity={isComparison ? 1.15 : 1.0}
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

        if (viewMode === "side") {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.PI / 2, 0.14);
            return;
        }
        if (viewMode === "front") {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.14);
            return;
        }

        if (autoRotate && !isDragging) {
            groupRef.current.rotation.y += delta * 0.55;
        } else {
            const target = THREE.MathUtils.degToRad(manualRotationDeg);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, target, 0.18);
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
                        <group position={[-1.45, 0, 0]}>
                            <LensMesh thickness={stats} diameterMm={diameterMm} ior={index} isComparison={false} viewMode={viewMode} />
                        </group>
                        {compStats && (
                            <group position={[1.45, 0, 0]}>
                                <LensMesh thickness={compStats} diameterMm={diameterMm} ior={comparisonIndex} isComparison={true} viewMode={viewMode} />
                            </group>
                        )}
                    </group>
                )}
            </group>

            <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={2.2} maxDistance={7} />
        </>
    );
}

export default function LensVisualizer3D({
    diopter = -3.0,
    index = 1.5,
    diameter = 70,
    showComparison = true,
    comparisonIndex = 1.67,
}) {
    const [stats, setStats] = useState(null);
    const [compStats, setCompStats] = useState(null);
    const [rotation, setRotation] = useState(60);
    const [isRotating, setIsRotating] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [viewMode, setViewMode] = useState("iso");
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);

    useEffect(() => {
        const s = LensPhysics.calculateThickness(diopter, index, diameter);
        setStats(s);

        if (showComparison) {
            const c = LensPhysics.calculateThickness(diopter, comparisonIndex, diameter);
            setCompStats(c);
        } else {
            setCompStats(null);
        }
    }, [diopter, index, diameter, showComparison, comparisonIndex]);

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

    const cameraPos =
        viewMode === "side"
            ? [4.8, 0.25, 0]
            : viewMode === "front"
                ? [0, 0.25, 4.8]
                : [3.2, 1.15, 3.4];

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
                className="relative min-h-[520px] flex items-center justify-center p-6 overflow-hidden"
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
                    <div className="absolute z-30 flex flex-col items-center justify-center">
                        <div className="bg-slate-900/90 p-2 rounded-full border border-slate-700 mb-2 backdrop-blur">
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
