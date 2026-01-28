// Frame measurement types for the customer application

export type FrameSize = 'small' | 'medium' | 'large';

export interface FrameData {
  size: FrameSize;
  width?: number;
  height?: number;
  bridge?: number;
}

export interface FrameMeasurementsProps {
  measurements: FrameData;
  onChange: (measurements: FrameData) => void;
  errors?: FrameValidationErrors;
}

export interface FrameValidationErrors {
  size?: string;
  width?: string;
  height?: string;
  bridge?: string;
}