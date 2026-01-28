// Reçete validasyonu
export function validatePrescription(prescription) {
  const errors = {};
  
  if (!prescription.right || prescription.right.sph === null || prescription.right.sph === undefined) {
    errors.rightSph = 'Sağ SPH gerekli';
  }
  
  if (!prescription.left || prescription.left.sph === null || prescription.left.sph === undefined) {
    errors.leftSph = 'Sol SPH gerekli';
  }
  
  if (!prescription.pd || prescription.pd === null || prescription.pd === undefined) {
    errors.pd = 'Göz arası (PD) gerekli';
  }
  
  if (prescription.pd && prescription.pd < 50) {
    errors.pd = 'PD en az 50 mm olmalı';
  }
  
  if (prescription.pd && prescription.pd > 75) {
    errors.pd = 'PD en fazla 75 mm olmalı';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
