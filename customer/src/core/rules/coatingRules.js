// İndeks önerisi kuralları
export const INDEX_RECOMMENDATION_RULES = [
  {
    condition: (d) => d <= 1.00,
    recommendation: '1.50',
    reason: 'Düşük numara için standart cam yeterli'
  },
  {
    condition: (d) => d > 1.00 && d <= 2.50,
    recommendation: '1.56',
    reason: 'Hafif incelme, fiyat dengesi'
  },
  {
    condition: (d) => d > 2.50 && d <= 4.50,
    recommendation: '1.60',
    reason: 'Orta numara için iyi denge'
  },
  {
    condition: (d) => d > 4.50 && d <= 6.00,
    recommendation: '1.67',
    reason: 'Yüksek numara için ultra ince'
  },
  {
    condition: (d) => d > 6.00,
    recommendation: '1.74',
    reason: 'Çok yüksek numara için en ince'
  },
];

export function recommendIndex(totalDiopter, priority) {
  const priorityFactors = {
    'thin': { offset: 1, weight: 1.5 },
    'cheap': { offset: -1, weight: 0.5 },
    'balanced': { offset: 0, weight: 1.0 },
  };
  
  const factor = priorityFactors[priority] || priorityFactors['balanced'];
  
  for (const rule of INDEX_RECOMMENDATION_RULES) {
    if (rule.condition(totalDiopter + factor.offset)) {
      return rule.recommendation;
    }
  }
  
  return INDEX_RECOMMENDATION_RULES[INDEX_RECOMMENDATION_RULES.length - 1].recommendation;
}

function getIndexLabel(index) {
  const labels = {
    '1.50': '1.50 Standart',
    '1.56': '1.56 İnceltilmiş',
    '1.60': '1.60 Ekstra İnce',
    '1.67': '1.67 Ultra İnce',
    '1.74': '1.74 En İnce',
  };
  return labels[index] || index;
}
