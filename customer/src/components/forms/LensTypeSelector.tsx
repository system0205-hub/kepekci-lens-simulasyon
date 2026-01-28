import React, { useState } from 'react';
import { useLocalization } from '../../../../shared/src/contexts/LocalizationContext';
import { LensTypeSelectorProps, LensType, LENS_TYPE_DESCRIPTIONS } from '../../types/lens';

/**
 * LensTypeSelector Component
 * 
 * Provides selection for lens types: uzak, yakın, progresif, bifokal, multifokal
 * with Turkish labels and descriptions.
 * 
 * Requirements: 1.6
 */
export const LensTypeSelector: React.FC<LensTypeSelectorProps> = ({
  selectedType,
  onChange,
  error
}) => {
  const { locale } = useLocalization();
  const [touched, setTouched] = useState(false);

  // Handle lens type selection
  const handleTypeChange = (type: LensType) => {
    setTouched(true);
    onChange(type);
  };

  // Lens type option component
  const LensTypeOption: React.FC<{
    type: LensType;
    label: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
  }> = ({ type, label, description, isSelected, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-4 text-left border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md ${
        isSelected
          ? 'bg-blue-50 border-blue-500 shadow-md'
          : 'bg-white border-gray-300 hover:border-gray-400'
      }`}
      aria-pressed={isSelected}
      role="radio"
      aria-checked={isSelected}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 mr-3 transition-colors ${
          isSelected
            ? 'bg-blue-600 border-blue-600'
            : 'border-gray-300'
        }`}>
          {isSelected && (
            <div className="w-full h-full rounded-full bg-white scale-50"></div>
          )}
        </div>
        <div className="flex-1">
          <div className={`font-medium mb-1 ${
            isSelected ? 'text-blue-900' : 'text-gray-900'
          }`}>
            {label}
          </div>
          <div className={`text-sm ${
            isSelected ? 'text-blue-700' : 'text-gray-600'
          }`}>
            {description}
          </div>
        </div>
      </div>
    </button>
  );

  const hasError = error && touched;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {locale.lensType}
      </h2>
      
      <div 
        className="space-y-3"
        role="radiogroup"
        aria-labelledby="lens-type-heading"
        aria-invalid={hasError ? true : undefined}
        aria-describedby={hasError ? "lens-type-error" : undefined}
      >
        <LensTypeOption
          type="uzak"
          label={locale.lensTypes.uzak}
          description={LENS_TYPE_DESCRIPTIONS.uzak}
          isSelected={selectedType === 'uzak'}
          onClick={() => handleTypeChange('uzak')}
        />
        
        <LensTypeOption
          type="yakın"
          label={locale.lensTypes.yakın}
          description={LENS_TYPE_DESCRIPTIONS.yakın}
          isSelected={selectedType === 'yakın'}
          onClick={() => handleTypeChange('yakın')}
        />
        
        <LensTypeOption
          type="progresif"
          label={locale.lensTypes.progresif}
          description={LENS_TYPE_DESCRIPTIONS.progresif}
          isSelected={selectedType === 'progresif'}
          onClick={() => handleTypeChange('progresif')}
        />
        
        <LensTypeOption
          type="bifocal"
          label={locale.lensTypes.bifocal}
          description={LENS_TYPE_DESCRIPTIONS.bifocal}
          isSelected={selectedType === 'bifocal'}
          onClick={() => handleTypeChange('bifocal')}
        />
        
        <LensTypeOption
          type="multifocal"
          label={locale.lensTypes.multifocal}
          description={LENS_TYPE_DESCRIPTIONS.multifocal}
          isSelected={selectedType === 'multifocal'}
          onClick={() => handleTypeChange('multifocal')}
        />
      </div>

      {hasError && (
        <div 
          id="lens-type-error"
          className="text-red-600 text-sm mt-3 flex items-center"
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