import React, { useState } from 'react';
import { useLocalization } from '../../../../shared/src/contexts/LocalizationContext';
import { PrioritySliderProps, Priority, PRIORITY_DESCRIPTIONS } from '../../types/usage';

/**
 * PrioritySlider Component
 * 
 * Provides selection between thin, cheap, and balanced priorities
 * for lens recommendations with visual slider interface.
 * 
 * Requirements: 1.8
 */
export const PrioritySlider: React.FC<PrioritySliderProps> = ({
  priority,
  onChange,
  error
}) => {
  const { locale } = useLocalization();
  const [touched, setTouched] = useState(false);

  // Priority options in order
  const priorityOptions: Priority[] = ['cheap', 'balanced', 'thin'];
  
  // Get current priority index
  const currentIndex = priorityOptions.indexOf(priority);

  // Handle priority selection
  const handlePriorityChange = (newPriority: Priority) => {
    setTouched(true);
    onChange(newPriority);
  };

  // Priority option component
  const PriorityOption: React.FC<{
    label: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
    position: 'left' | 'center' | 'right';
  }> = ({ label, description, isSelected, onClick, position }) => {
    const positionClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };

    return (
      <div className={`flex-1 ${positionClasses[position]}`}>
        <button
          type="button"
          onClick={onClick}
          className={`w-full p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSelected
              ? 'bg-blue-50 border-blue-500 shadow-md'
              : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }`}
          aria-pressed={isSelected}
          role="radio"
          aria-checked={isSelected}
        >
          <div className={`font-semibold mb-2 ${
            isSelected ? 'text-blue-900' : 'text-gray-900'
          }`}>
            {label}
          </div>
          <div className={`text-sm ${
            isSelected ? 'text-blue-700' : 'text-gray-600'
          }`}>
            {description}
          </div>
        </button>
      </div>
    );
  };

  // Visual slider track component
  const SliderTrack: React.FC = () => {
    const trackPosition = currentIndex * 50; // 0%, 50%, 100%
    
    return (
      <div className="relative mb-6">
        {/* Track background */}
        <div className="h-2 bg-gray-200 rounded-full">
          {/* Active track */}
          <div 
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${trackPosition + 50}%` }}
          />
        </div>
        
        {/* Track markers */}
        <div className="flex justify-between mt-2">
          {priorityOptions.map((priorityType, index) => (
            <button
              key={priorityType}
              type="button"
              onClick={() => handlePriorityChange(priorityType)}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                index <= currentIndex
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}
              aria-label={locale.priorities[priorityType]}
            >
              {index <= currentIndex && (
                <div className="w-full h-full rounded-full bg-white scale-50" />
              )}
            </button>
          ))}
        </div>
        
        {/* Track labels */}
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-600">{locale.priorities.cheap}</span>
          <span className="text-xs text-gray-600">{locale.priorities.balanced}</span>
          <span className="text-xs text-gray-600">{locale.priorities.thin}</span>
        </div>
      </div>
    );
  };

  const hasError = error && touched;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {locale.priority}
      </h2>
      
      {/* Visual Slider */}
      <SliderTrack />

      {/* Priority Options */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
        role="radiogroup"
        aria-labelledby="priority-heading"
        aria-invalid={hasError ? true : undefined}
        aria-describedby={hasError ? "priority-error" : undefined}
      >
        <PriorityOption
          label={locale.priorities.cheap}
          description={locale.priorityDescriptions.cheap}
          isSelected={priority === 'cheap'}
          onClick={() => handlePriorityChange('cheap')}
          position="left"
        />
        
        <PriorityOption
          label={locale.priorities.balanced}
          description={locale.priorityDescriptions.balanced}
          isSelected={priority === 'balanced'}
          onClick={() => handlePriorityChange('balanced')}
          position="center"
        />
        
        <PriorityOption
          label={locale.priorities.thin}
          description={locale.priorityDescriptions.thin}
          isSelected={priority === 'thin'}
          onClick={() => handlePriorityChange('thin')}
          position="right"
        />
      </div>

      {/* Current Selection Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
          <div>
            <div className="font-medium text-gray-900">
              Seçili: {locale.priorities[priority]}
            </div>
            <div className="text-sm text-gray-600">
              {PRIORITY_DESCRIPTIONS[priority]}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {hasError && (
        <div 
          id="priority-error"
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