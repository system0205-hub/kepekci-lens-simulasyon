import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../../../shared/src/contexts/LocalizationContext';
import { FrameMeasurementsProps, FrameValidationErrors, FrameSize } from '../../types/frame';
import { validateFrameMeasurements, parseInputNumber, formatInputNumber } from '../../utils/validation';

/**
 * FrameMeasurements Component
 * 
 * Provides frame size selection (small, medium, large) and optional manual measurements
 * for more precise calculations.
 * 
 * Requirements: 1.5
 */
export const FrameMeasurements: React.FC<FrameMeasurementsProps> = ({
  measurements,
  onChange,
  errors: externalErrors
}) => {
  const { locale } = useLocalization();
  const [internalErrors, setInternalErrors] = useState<FrameValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showManualInputs, setShowManualInputs] = useState(false);

  // Use external errors if provided, otherwise use internal validation
  const displayErrors = externalErrors || internalErrors;

  // Real-time validation
  const validateAndUpdate = useCallback((newMeasurements: typeof measurements) => {
    const validationErrors = validateFrameMeasurements(newMeasurements);
    setInternalErrors(validationErrors);
    onChange(newMeasurements);
  }, [onChange]);

  // Handle frame size selection
  const handleSizeChange = (size: FrameSize) => {
    const newMeasurements = {
      ...measurements,
      size
    };
    validateAndUpdate(newMeasurements);
  };

  // Handle manual measurement input changes
  const handleMeasurementChange = (
    field: 'width' | 'height' | 'bridge',
    value: string
  ) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const parsedValue = value.trim() === '' ? undefined : parseInputNumber(value, 0);
    
    const newMeasurements = {
      ...measurements,
      [field]: parsedValue
    };

    validateAndUpdate(newMeasurements);
  };

  // Handle input blur for better UX
  const handleInputBlur = (field: 'width' | 'height' | 'bridge') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Frame size option component
  const FrameSizeOption: React.FC<{
    size: FrameSize;
    label: string;
    isSelected: boolean;
    onClick: () => void;
  }> = ({ size, label, isSelected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 px-4 text-center border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isSelected
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
      aria-pressed={isSelected}
    >
      <div className="font-medium">{label}</div>
      <div className="text-sm opacity-75 mt-1">
        {size === 'small' && '48-52mm'}
        {size === 'medium' && '53-57mm'}
        {size === 'large' && '58-62mm'}
      </div>
    </button>
  );

  // Manual measurement input component
  const MeasurementInput: React.FC<{
    label: string;
    value?: number;
    onChange: (value: string) => void;
    onBlur: () => void;
    error?: string;
    min: number;
    max: number;
    fieldKey: string;
    placeholder: string;
  }> = ({ label, value, onChange, onBlur, error, min, max, fieldKey, placeholder }) => {
    const hasError = error && touched[fieldKey];
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="number"
          step="1"
          min={min}
          max={max}
          value={value !== undefined ? formatInputNumber(value) : ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
            hasError
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? `${fieldKey}-error` : undefined}
        />
        {hasError && (
          <div 
            id={`${fieldKey}-error`}
            className="text-red-600 text-sm mt-1 flex items-center"
            role="alert"
          >
            <svg 
              className="h-4 w-4 mr-1 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            {error}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {locale.frameSize}
      </h2>
      
      {/* Frame Size Selection */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <FrameSizeOption
            size="small"
            label={locale.frameSizes.small}
            isSelected={measurements.size === 'small'}
            onClick={() => handleSizeChange('small')}
          />
          <FrameSizeOption
            size="medium"
            label={locale.frameSizes.medium}
            isSelected={measurements.size === 'medium'}
            onClick={() => handleSizeChange('medium')}
          />
          <FrameSizeOption
            size="large"
            label={locale.frameSizes.large}
            isSelected={measurements.size === 'large'}
            onClick={() => handleSizeChange('large')}
          />
        </div>
      </div>

      {/* Manual Measurements Toggle */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowManualInputs(!showManualInputs)}
          className="flex items-center text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <svg
            className={`h-5 w-5 mr-2 transition-transform ${showManualInputs ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {locale.manualMeasurements}
        </button>
        <p className="text-sm text-gray-500 mt-1 ml-7">
          {locale.optionalMeasurements}
        </p>
      </div>

      {/* Manual Measurements Inputs */}
      {showManualInputs && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <MeasurementInput
            label={locale.frameWidth}
            value={measurements.width}
            onChange={(value) => handleMeasurementChange('width', value)}
            onBlur={() => handleInputBlur('width')}
            error={displayErrors.width}
            min={40}
            max={70}
            fieldKey="width"
            placeholder="50"
          />
          <MeasurementInput
            label={locale.frameHeight}
            value={measurements.height}
            onChange={(value) => handleMeasurementChange('height', value)}
            onBlur={() => handleInputBlur('height')}
            error={displayErrors.height}
            min={25}
            max={60}
            fieldKey="height"
            placeholder="35"
          />
          <MeasurementInput
            label={locale.frameBridge}
            value={measurements.bridge}
            onChange={(value) => handleMeasurementChange('bridge', value)}
            onBlur={() => handleInputBlur('bridge')}
            error={displayErrors.bridge}
            min={10}
            max={25}
            fieldKey="bridge"
            placeholder="18"
          />
        </div>
      )}
    </div>
  );
};