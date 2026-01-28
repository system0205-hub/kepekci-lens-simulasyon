import { calculateLensThickness } from '../rules/thicknessCalculator.js';

const RecommendationEngine = {
  generate(formData) {
    const recommendations = [];
    
    const rightSph = parseFloat(formData.prescription.rightEye.sph) || 0;
    const leftSph = parseFloat(formData.prescription.leftEye.sph) || 0;
    const maxSph = Math.max(Math.abs(rightSph), Math.abs(leftSph));
    
    const rightCyl = parseFloat(formData.prescription.rightEye.cyl) || 0;
    const leftCyl = parseFloat(formData.prescription.leftEye.cyl) || 0;
    const maxCyl = Math.max(Math.abs(rightCyl), Math.abs(leftCyl));
    
    const totalPower = maxSph + (maxCyl * 0.2);
    
    const frameSize = formData.frame.size;
    const lensType = formData.lensType;
    const priority = formData.priority;
    const hasSGK = false;

    const recommendedIndices = this.getRecommendedIndices(totalPower);
    
    recommendedIndices.forEach((indexValue) => {
      const thicknessData = calculateLensThickness(
        {
          right: { sph: rightSph, cyl: rightCyl, axis: 0 },
          left: { sph: leftSph, cyl: leftCyl, axis: 0 }
        },
        indexValue.toFixed(2),
        frameSize
      );

      const thickness = thicknessData ? thicknessData.total : 5;
      const basePrice = this.calculateBasePrice(totalPower, indexValue);
      const coatingPrice = this.getCoatingPrice(lensType);
      const totalPrice = this.calculateTotalPrice(basePrice, coatingPrice, hasSGK);
      
      const coating = this.getCoatingForLensType(lensType);
      const category = this.getCategory(priority, totalPrice);

      recommendations.push({
        index: indexValue,
        lensIndex: indexValue.toFixed(2),
        thickness: thickness,
        basePrice: basePrice,
        coatingPrice: coatingPrice,
        totalPrice: totalPrice,
        coatings: [coating],
        category: category,
        rating: this.calculateRating(thickness, totalPrice, category)
      });
    });

    recommendations.sort((a, b) => {
      const categoryScore = {
        economy: 1,
        standard: 2,
        premium: 3
      };
      
      if (priority.price > priority.quality) {
        return a.totalPrice - b.totalPrice;
      }
      
      return b.rating - a.rating;
    });

    return recommendations.slice(0, 3);
  },

  getRecommendedIndices(totalPower) {
    if (totalPower <= 1.00) return [1.50, 1.56];
    if (totalPower <= 2.50) return [1.56, 1.60, 1.50];
    if (totalPower <= 4.00) return [1.60, 1.67, 1.56];
    if (totalPower <= 6.00) return [1.67, 1.74, 1.60];
    return [1.74, 1.67];
  },

  calculateBasePrice(power, index) {
    const basePrices = {
      '1.50': 1200,
      '1.56': 1800,
      '1.60': 2400,
      '1.67': 3200,
      '1.74': 4800
    };

    const basePrice = basePrices[index] || 1200;
    const powerMultiplier = 1 + (power * 0.1);
    
    return Math.round(basePrice * powerMultiplier);
  },

  getCoatingPrice(lensType) {
    const coatingPrices = {
      'single_vision': 0,
      'bifocal': 400,
      'progressive': 600,
      'photochromic': 1200,
      'blue_cut': 600,
      'anti_reflex': 800
    };

    return coatingPrices[lensType] || 0;
  },

  calculateTotalPrice(basePrice, coatingPrice, hasSGK) {
    const laborCost = 600;
    const sgkContribution = hasSGK ? 150 : 0;
    
    const subtotal = basePrice + coatingPrice + laborCost;
    const kdv = subtotal * 0.20;
    const total = subtotal + kdv - sgkContribution;
    
    return Math.round(total);
  },

  getCoatingForLensType(lensType) {
    const coatings = {
      'single_vision': 'Standart',
      'bifocal': 'Anti-Refleks',
      'progressive': 'Anti-Refleks',
      'photochromic': 'Photochromic',
      'blue_cut': 'Blue Cut',
      'anti_reflex': 'Anti-Refleks'
    };

    return coatings[lensType] || 'Standart';
  },

  getCategory(priority, totalPrice) {
    if (priority.price > 50 && priority.quality < 50) {
      return 'economy';
    }
    if (priority.quality > 50 && priority.price < 50) {
      return 'premium';
    }
    return 'standard';
  },

  calculateRating(thickness, totalPrice, category) {
    let rating = 4.0;

    if (category === 'premium') {
      rating += 1.0;
    } else if (category === 'economy') {
      rating -= 0.5;
    }

    if (thickness <= 3) {
      rating += 0.5;
    } else if (thickness > 7) {
      rating -= 0.5;
    }

    return Math.min(5.0, Math.max(1.0, rating));
  }
};

export default RecommendationEngine;
