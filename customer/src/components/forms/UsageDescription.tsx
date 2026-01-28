import React, { useState, useCallback } from 'react';
import { useLocalization } from '../../../../shared/src/contexts/LocalizationContext';
import { UsageDescriptionProps, USAGE_SUGGESTIONS } from '../../types/usage';

/**
 * UsageDescription Component
 * 
 * Provides free-text input for usage scenarios with suggestions
 * to help users describe how they will use their glasses.
 * 
 * Requirements: 1.7
 */
export const UsageDescription: React.FC<UsageDescriptionProps> = ({
  usage,
  onChange,
  suggestions = USAGE_SUGGESTIONS,
  error
}) => {
  const { locale } = useLocalization();
  const [touched, setTouched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle text area changes
  const handleUsageChange = useCallback((value: string) => {
    setTouched(true);
    onChange(value);
  }, [onChange]);

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    const newUsage = usage.trim() 
      ? `${usage.trim()}, ${suggestion.toLowerCase()}`
      : suggestion.toLowerCase();
    handleUsageChange(newUsage);
    setShowSuggestions(false);
  };

  // Handle input focus
  const handleFocus = () => {
    setShowSuggestions(true);
  };

  // Handle input blur with delay to allow suggestion clicks
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const hasError = error && touched;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {locale.usage}
      </h2>
      
      <p className="text-sm text-gray-600 mb-4">
        {locale.usageLabels.description}
      </p>

      <div className="relative">
        {/* Text Area */}
        <textarea
          value={usage}
          onChange={(e) => handleUsageChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={locale.usageLabels.placeholder}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 transition-colors ${
            hasError
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? "usage-error" : "usage-description"}
        />

        {/* Character count */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500">
            {usage.length}/500 karakter
          </div>
          
          {/* Suggestions toggle */}
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            {locale.usageLabels.suggestions}
            <svg
              className={`inline-block ml-1 h-4 w-4 transition-transform ${showSuggestions ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-700 mb-2 px-2">
                {locale.usageLabels.suggestions}:
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors focus:outline-none focus:bg-blue-50 focus:text-blue-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <div 
          id="usage-error"
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

      {/* Help text */}
      <div 
        id="usage-description"
        className="text-xs text-gray-500 mt-2"
      >
        Örnek: "Ofiste bilgisayar başında çalışıyorum, akşamları kitap okuyorum"
      </div>
    </div>
  );
};