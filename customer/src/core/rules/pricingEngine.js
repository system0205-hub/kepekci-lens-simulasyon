// Kaplama önerisi kuralları
export const COATING_RULES = {
  'ekran-agir': ['blue-cut'],
  'gece-surus': ['anti-refle', 'drive'],
  'dis-mekan': ['photochromic'],
  'ofis': ['anti-refle', 'hydrophobic'],
  'endustriyel': ['scratch-resistant', 'anti-fog'],
  'saglik': ['anti-fog', 'anti-refle'],
};

export function recommendCoatings(usage, lensType) {
  const keywords = usage.toLowerCase().split(/[\s,]+/);
  const coatings = [];
  
  Object.entries(COATING_RULES).forEach(([scenario, coatingList]) => {
    if (keywords.some(kw => scenario.includes(kw))) {
      coatings.push(...coatingList);
    }
  });
  
  if (lensType === 'progresif') {
    if (!coatings.includes('anti-refle')) {
      coatings.push('anti-refle');
    }
  }
  
  if (lensType === 'bifocal' || lensType === 'multifocal') {
    if (!coatings.includes('anti-refle')) {
      coatings.push('anti-refle');
    }
  }
  
  return [...new Set(coatings)];
}

function getCategory(index, diopter) {
  if (diopter <= 2) return 'economic';
  if (diopter <= 4) return 'balanced';
  if (diopter <= 6) return 'premium';
  return 'ultra';
}

function calculateCategoryScore(recommendation, priority) {
  const categoryScores = {
    '1.50': { economic: 10, balanced: 5, premium: 2, ultra: 1 },
    '1.56': { economic: 9, balanced: 7, premium: 4, ultra: 2 },
    '1.60': { economic: 7, balanced: 8, premium: 6, ultra: 3 },
    '1.67': { economic: 5, balanced: 9, premium: 8, ultra: 5 },
    '1.74': { economic: 3, balanced: 7, premium: 9, ultra: 10 },
  };
  
  const scores = categoryScores[recommendation];
  const priorityWeights = {
    'thin': { economic: 0.5, balanced: 1, premium: 1.5, ultra: 2 },
    'cheap': { economic: 2, balanced: 0.5, premium: 1, ultra: 0.5 },
    'balanced': { economic: 1, balanced: 2, premium: 1, ultra: 1 },
  };
  
  const weights = priorityWeights[priority] || priorityWeights['balanced'];
  
  return (scores.economic * weights.economic) +
         (scores.balanced * weights.balanced) +
         (scores.premium * weights.premium) +
         (scores.ultra * weights.ultra);
}
