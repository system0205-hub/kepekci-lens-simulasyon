import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../../../shared/src/contexts/LocalizationContext';
import { PrescriptionFormProps, ValidationErrors } from '../../types/prescription';
import { validatePrescription, parseInputNumber, formatInputNumber } from '../../utils/validation';

/**
 * PrescriptionForm Component
 * 
 * Provides input fields for SPH, CYL, AXIS values for both right and left eyes
 * with real-time validation and Turkish error messages.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  prescription,
  onChange,
  errors: externalErrors
}) => {
  const { locale } = useLocalization();
  const [internalErrors, setInternalErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Use external errors if provided, otherwise use internal validation
  const displayErrors = externalErrors || internalErrors;

  // Real-time validation
  const validateAndUpdate = useCallback((newPrescription: typeof prescription) => {
    const validationErrors = validatePrescription(newPrescription);
    setInternalErrors(validationErrors);
    onChange(newPrescription);
  }, [onChange]);

  // Handle input changes with validation
  const handleInputChange = (
    eye: 'rightEye' | 'leftEye',
    field: 'sph' | 'cyl' | 'axis',
    value: string
  ) => {
    const fieldKey = `${eye}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    setTouched(prev => ({ ...prev, [fieldKey]: true }));

    let parsedValue: number;

    if (field === 'axis') {
      parsedValue = parseInt(value) || 0;
    } else {
      parsedValue = parseInputNumber(value, 0);
    }

    const newPrescription = {
      ...prescription,
      [eye]: {
        ...prescription[eye],
        [field]: parsedValue
      }
    };

    validateAndUpdate(newPrescription);
  };

  // Handle input blur for better UX
  const handleInputBlur = (
    eye: 'rightEye' | 'leftEye',
    field: 'sph' | 'cyl' | 'axis'
  ) => {
    const fieldKey = `${eye}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    setTouched(prev => ({ ...prev, [fieldKey]: true }));
  };

  // Input field component with local state to handle efficient typing (especially identifiers like "-")
  const InputField: React.FC<{
    label: string;
    value: number;
    onChange: (value: string) => void;
    onBlur: () => void;
    error?: string;
    min: number;
    max: number;
    step?: string;
    fieldKey: string;
  }> = ({ label, value, onChange, onBlur, error, min, max, step = "0.25", fieldKey }) => {
    const hasError = error && touched[fieldKey];
    const [localValue, setLocalValue] = useState(value.toString());

    // Sync local state when prop value changes externally (but not while typing if possible)
    React.useEffect(() => {
      // Only override if the prop value is drastically different (e.g. valid number) 
      // and not just a formatting difference that interrupts typing.
      if (parseFloat(localValue) !== value && !isNaN(value)) {
        setLocalValue(value.toString());
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setLocalValue(val);

      // Allow "-" or empty string to exist locally without forcing parse yet
      if (val === '' || val === '-') {
        return;
      }

      // Pass to parent only if it looks like a number
      if (!isNaN(parseFloat(val))) {
        onChange(val);
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="number" // Still number type for mobile keyboards, but validation handles the edge cases
          step={step}
          min={min}
          max={max}
          value={localValue}
          onChange={handleChange}
          onBlur={() => {
            onBlur();
            // On blur, strict formatting
            if (localValue === '' || localValue === '-') {
              setLocalValue('0');
              onChange('0');
            } else {
              setLocalValue(parseFloat(localValue).toString());
            }
          }}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${hasError
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

  // Eye section component for reusability
  const EyeSection: React.FC<{
    title: string;
    eye: 'rightEye' | 'leftEye';
  }> = ({ title, eye }) => (
    <div>
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label={locale.sph}
          value={prescription[eye].sph}
          onChange={(value) => handleInputChange(eye, 'sph', value)}
          onBlur={() => handleInputBlur(eye, 'sph')}
          error={displayErrors[`${eye}Sph` as keyof ValidationErrors]}
          min={-20}
          max={20}
          step="0.25"
          fieldKey={`${eye}Sph`}
        />
        <InputField
          label={locale.cyl}
          value={prescription[eye].cyl}
          onChange={(value) => handleInputChange(eye, 'cyl', value)}
          onBlur={() => handleInputBlur(eye, 'cyl')}
          error={displayErrors[`${eye}Cyl` as keyof ValidationErrors]}
          min={-6}
          max={6}
          step="0.25"
          fieldKey={`${eye}Cyl`}
        />
        <InputField
          label={locale.axis}
          value={prescription[eye].axis}
          onChange={(value) => handleInputChange(eye, 'axis', value)}
          onBlur={() => handleInputBlur(eye, 'axis')}
          error={displayErrors[`${eye}Axis` as keyof ValidationErrors]}
          min={0}
          max={180}
          step="1"
          fieldKey={`${eye}Axis`}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {locale.prescription}
      </h2>
      <div className="space-y-6">
        <EyeSection title={locale.rightEye} eye="rightEye" />
        <EyeSection title={locale.leftEye} eye="leftEye" />
      </div>
    </div>
  );
};