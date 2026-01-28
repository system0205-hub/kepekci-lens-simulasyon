// Prescription data types for the customer application

export interface EyeData {
  sph: number; // -20.00 to +20.00
  cyl: number; // -6.00 to +6.00
  axis: number; // 0 to 180
}

export interface PrescriptionData {
  rightEye: EyeData;
  leftEye: EyeData;
}

export interface ValidationErrors {
  rightEyeSph?: string;
  rightEyeCyl?: string;
  rightEyeAxis?: string;
  leftEyeSph?: string;
  leftEyeCyl?: string;
  leftEyeAxis?: string;
}

export interface PrescriptionFormProps {
  prescription: PrescriptionData;
  onChange: (prescription: PrescriptionData) => void;
  errors?: ValidationErrors;
}