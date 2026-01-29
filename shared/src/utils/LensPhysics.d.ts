// LensPhysics type declarations
export interface ThicknessResult {
    center: number;
    edge: number;
    sag: number;
    diameter: number;
}

export interface LensPhysicsType {
    calculateSag: (power: number, index: number, diameter: number) => number;
    calculateThickness: (power: number, index: number, diameter?: number, minThickness?: number) => ThicknessResult;
    calculateImprovement: (power: number, newIndex: number, diameter?: number) => number;
}

declare const LensPhysics: LensPhysicsType;
export { LensPhysics };
export default LensPhysics;
