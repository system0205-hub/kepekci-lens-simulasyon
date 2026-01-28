/**
 * Lens Physics Calculation Engine
 * Uses optical formulas to calculate estimated thickness and weight.
 */

export const LensPhysics = {
    /**
     * Calculate Sagittal Depth (Curvature depth)
     * s = r - sqrt(r^2 - y^2) 
     * approximated as: s = (y^2 * Power) / (2000 * (n - 1))
     * 
     * @param {number} power - Diopter power (e.g., -4.00)
     * @param {number} index - Refractive index (e.g., 1.50, 1.60)
     * @param {number} diameter - Lens diameter in mm (default 65mm for minus, 70mm for plus)
     */
    calculateSag: (power, index, diameter) => {
        const radius = diameter / 2;
        const n_minus_1 = index - 1;

        // Absolute power for geometric calculation
        const absPower = Math.abs(power);

        // Sagittal depth formula approximation: (h^2 * D) / (2000 * (n-1))
        // h is radius in mm
        const sag = (Math.pow(radius, 2) * absPower) / (2000 * n_minus_1);

        return sag;
    },

    /**
     * Calculate Center and Edge Thickness
     */
    calculateThickness: (power, index, diameter = 65, minThickness = 1.0) => {
        const sag = LensPhysics.calculateSag(power, index, diameter);

        let centerThickness = minThickness;
        let edgeThickness = minThickness;

        if (power < 0) {
            // Myopia (Minus Lens) - Thicker at edges
            // Center is minimum thickness
            centerThickness = minThickness;
            edgeThickness = minThickness + sag;
        } else if (power > 0) {
            // Hyperopia (Plus Lens) - Thicker at center
            // Edge is minimum thickness
            edgeThickness = minThickness;
            centerThickness = minThickness + sag;
        }

        return {
            center: parseFloat(centerThickness.toFixed(2)),
            edge: parseFloat(edgeThickness.toFixed(2)),
            sag: parseFloat(sag.toFixed(2)),
            diameter
        };
    },

    /**
     * Calculate estimated weight improvement percentage against standard 1.50 index
     */
    calculateImprovement: (power, newIndex, diameter = 65) => {
        const standardStats = LensPhysics.calculateThickness(power, 1.50, diameter);
        const newStats = LensPhysics.calculateThickness(power, newIndex, diameter);

        // Compare max thickness (Edge for minus, Center for plus)
        const thicknessMetric = power < 0 ? 'edge' : 'center';

        const oldThick = standardStats[thicknessMetric];
        const newThick = newStats[thicknessMetric];

        const improvement = ((oldThick - newThick) / oldThick) * 100;

        return Math.max(0, parseFloat(improvement.toFixed(1))); // No negative improvement
    }
};

export default LensPhysics;
