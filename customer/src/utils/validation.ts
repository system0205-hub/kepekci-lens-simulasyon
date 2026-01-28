import { PrescriptionData, ValidationErrors } from '../types/prescription';
import { FrameData, FrameValidationErrors } from '../types/frame';
import { turkishLocale } from '../../../shared/src/locales/turkish';

/**
 * Validates prescription data according to the requirements:
 * - SPH: -20.00 to +20.00 diopters
 * - CYL: -6.00 to +6.00 diopters  
 * - AXIS: 0 to 180 degrees
 */
export const validatePrescription = (prescription: PrescriptionData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Right Eye SPH validation
  if (prescription.rightEye.sph < -20 || prescription.rightEye.sph > 20) {
    errors.rightEyeSph = turkishLocale.validation.sphRange;
  }

  // Right Eye CYL validation
  if (prescription.rightEye.cyl < -6 || prescription.rightEye.cyl > 6) {
    errors.rightEyeCyl = turkishLocale.validation.cylRange;
  }

  // Right Eye AXIS validation
  if (prescription.rightEye.axis < 0 || prescription.rightEye.axis > 180) {
    errors.rightEyeAxis = turkishLocale.validation.axisRange;
  }

  // Left Eye SPH validation
  if (prescription.leftEye.sph < -20 || prescription.leftEye.sph > 20) {
    errors.leftEyeSph = turkishLocale.validation.sphRange;
  }

  // Left Eye CYL validation
  if (prescription.leftEye.cyl < -6 || prescription.leftEye.cyl > 6) {
    errors.leftEyeCyl = turkishLocale.validation.cylRange;
  }

  // Left Eye AXIS validation
  if (prescription.leftEye.axis < 0 || prescription.leftEye.axis > 180) {
    errors.leftEyeAxis = turkishLocale.validation.axisRange;
  }

  return errors;
};

/**
 * Checks if a number is valid (not NaN and finite)
 */
export const isValidNumber = (value: number): boolean => {
  return !isNaN(value) && isFinite(value);
};

/**
 * Formats a number for display in input fields
 */
export const formatInputNumber = (value: number): string => {
  if (!isValidNumber(value)) return '';
  return value.toString();
};

/**
 * Parses input value to number with fallback
 */
export const parseInputNumber = (value: string, fallback: number = 0): number => {
  const parsed = parseFloat(value);
  return isValidNumber(parsed) ? parsed : fallback;
};

/**
 * Validates frame measurement data
 * - Width: 40-70mm (optional)
 * - Height: 25-60mm (optional)
 * - Bridge: 10-25mm (optional)
 */
export const validateFrameMeasurements = (frame: FrameData): FrameValidationErrors => {
  const errors: FrameValidationErrors = {};

  // Width validation (optional)
  if (frame.width !== undefined) {
    if (frame.width < 40 || frame.width > 70) {
      errors.width = 'Çerçeve genişliği 40-70mm arasında olmalıdır';
    }
  }

  // Height validation (optional)
  if (frame.height !== undefined) {
    if (frame.height < 25 || frame.height > 60) {
      errors.height = 'Çerçeve yüksekliği 25-60mm arasında olmalıdır';
    }
  }

  // Bridge validation (optional)
  if (frame.bridge !== undefined) {
    if (frame.bridge < 10 || frame.bridge > 25) {
      errors.bridge = 'Burun köprüsü 10-25mm arasında olmalıdır';
    }
  }

  return errors;
};