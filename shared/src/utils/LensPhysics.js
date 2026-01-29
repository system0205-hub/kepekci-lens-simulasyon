/**
 * Lens Physics Calculation Engine
 * Uses calibrated data for realistic thickness simulation.
 */

// Kullanıcıdan gelen kalibre edilmiş 1.50 indeks verileri
// Eksik numaralar için enterpolasyon yapılır.
const REFERENCE_DATA_1_50 = {
    "-0.25": { "edge": 2.6, "center": 2 },
    "-0.5": { "edge": 3, "center": 2 },
    "-0.75": { "edge": 3.5, "center": 2 },
    "-1": { "edge": 4, "center": 2.4 },
    "-1.25": { "edge": 4.5, "center": 2.8 },
    "-1.5": { "edge": 5, "center": 3.2 },
    "-1.75": { "edge": 5.5, "center": 3.4 },
    // -2.00 eksik, enterpolasyonla bulunacak
    "-2.25": { "edge": 6.8, "center": 4.4 },
    "-2.5": { "edge": 7.2, "center": 4.6 },
    "-2.75": { "edge": 8, "center": 3.9 },
    "-3": { "edge": 7.7, "center": 4.6 },
    "-3.5": { "edge": 7.8, "center": 6.4 }, // -3.25 ara değer
    "-4": { "edge": 9.5, "center": 8 },
    "-4.5": { "edge": 8.3, "center": 8.2 },
    "-5": { "edge": 10.3, "center": 6.2 },
    "-5.5": { "edge": 10.1, "center": 6.7 },
    "-6": { "edge": 9.8, "center": 5.2 },
    "-6.5": { "edge": 10, "center": 6.8 },
    "-7": { "edge": 10.3, "center": 7.4 },
    "-7.5": { "edge": 13.4, "center": 6.4 },
    "-8": { "edge": 13.1, "center": 6.6 },
    "-8.5": { "edge": 13.7, "center": 7.3 },
    "-9": { "edge": 14.1, "center": 7.1 },
    "-9.5": { "edge": 13.2, "center": 8.1 },
    "-10": { "edge": 15.4, "center": 7.7 }
};

// İnceltme oranları (1.50 referans alınarak ne kadar inceleceği)
// Örnek: 1.56 %25 daha ince -> factor 0.75
const THINNING_RATIOS = {
    1.50: 1.00,
    1.56: 0.75, // %25 inceltme
    1.60: 0.65, // %35 inceltme (Kullanıcı %35 dedi)
    1.61: 0.65, // 1.60 ile aynı kabul edelim
    1.67: 0.50, // %50 inceltme
    1.70: 0.45, // Ara değer tahmini
    1.74: 0.40  // %60 inceltme
};

export const LensPhysics = {
    /**
     * 1.50 indeks için kalibre edilmiş veriyi getirir.
     * Eğer listede yoksa en yakın iki değerden enterpolasyon yapar.
     */
    getCalibratedBaseThickness: (power) => {
        // Pozitif numaralar için şimdilik basit formül kullanalım (henüz kalibre edilmedi)
        if (power >= 0) {
            // Basit bir yaklaşım
            return {
                edge: 2.0,
                center: 2.0 + (power * 0.8)
            };
        }

        // Tam eşleşme kontrolü (String key olarak)
        const key = power.toString();
        if (REFERENCE_DATA_1_50[key]) {
            return REFERENCE_DATA_1_50[key];
        }

        // Kayan noktalı sayı sorunları için (ör: -0.50 yerine -0.5 gelebilir)
        const numKeys = Object.keys(REFERENCE_DATA_1_50).map(parseFloat).sort((a, b) => b - a); // Büyükten küçüğe (-0.25 > -10)

        // Tam eşleşme (sayısal)
        const exactMatch = numKeys.find(k => Math.abs(k - power) < 0.01);
        if (exactMatch !== undefined) {
            return REFERENCE_DATA_1_50[exactMatch.toString()];
        }

        // Enterpolasyon
        // power = -3.25. Üst komşu -3, Alt komşu -3.5
        // Listemiz azalan sırada: -3, -3.25(aranan), -3.5
        const upper = numKeys.slice().reverse().find(k => k <= power); // -3.5 (daha küçük/negatif olarak daha büyük mutlak)
        const lower = numKeys.find(k => k >= power); // -3 (daha büyük)

        // Sınır dışı durumlar
        if (lower === undefined) return REFERENCE_DATA_1_50[numKeys[0].toString()]; // En düşük (-0.25)
        if (upper === undefined) return REFERENCE_DATA_1_50[numKeys[numKeys.length - 1].toString()]; // En yüksek (-10)

        const valLower = REFERENCE_DATA_1_50[lower.toString()];
        const valUpper = REFERENCE_DATA_1_50[upper.toString()];

        const ratio = (power - lower) / (upper - lower); // (-3.25 - (-3)) / (-3.5 - (-3)) = -0.25 / -0.5 = 0.5

        return {
            edge: valLower.edge + (valUpper.edge - valLower.edge) * ratio,
            center: valLower.center + (valUpper.center - valLower.center) * ratio
        };
    },

    /**
     * Calculate Center and Edge Thickness using Calibrated Data
     */
    calculateThickness: (power, index, diameter = 65, minThickness = 1.0) => {
        // 1. Baz değeri al (1.50 için)
        const baseStats = LensPhysics.getCalibratedBaseThickness(power);

        // 2. İnceltme oranını bul
        // En yakın indeksi bul
        const availableIndices = Object.keys(THINNING_RATIOS).map(parseFloat);
        const closestIndex = availableIndices.reduce((prev, curr) =>
            Math.abs(curr - index) < Math.abs(prev - index) ? curr : prev
        );
        const thinningFactor = THINNING_RATIOS[closestIndex];

        // 3. Yeni kalınlıkları hesapla
        // Çap farkı (kalibre edilen çap 70mm varsayılmıştır, çap değişirse oranla)
        const calibrationDiameter = 70; // Varsayım
        const diameterFactor = diameter / calibrationDiameter;

        // Kalınlık sadece malzemeye ve çapa bağlı değişir
        // Kenar kalınlığı diyoptrili camlarda çapla artar
        let edge = baseStats.edge * thinningFactor;

        // Çap düzeltmesi (basitçe)
        if (power < 0) {
            // Miyopta çap artarsa kenar kalınlaşır
            edge = edge * diameterFactor;
        }

        let center = baseStats.center;

        // Hipermetropta (ki şu an sadece miyop datası var) merkez kalınlaşır
        if (power > 0) {
            center = center * thinningFactor * diameterFactor;
        }

        return {
            center: parseFloat(Math.max(1.0, center).toFixed(2)), // Min 1.0mm
            edge: parseFloat(Math.max(0.5, edge).toFixed(2)),    // Min 0.5mm
            sag: 0, // Artık sag formülü kullanmıyoruz
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

        return Math.max(0, parseFloat(improvement.toFixed(1)));
    }
};

export default LensPhysics;
