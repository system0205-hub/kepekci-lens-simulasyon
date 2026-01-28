// TL formatlama
export function formatTL(value) {
  if (!value && value !== 0) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return '0 TL';
}

// Sayı formatlama
export function formatNumber(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return new Intl.NumberFormat('tr-TR').format(value);
}
