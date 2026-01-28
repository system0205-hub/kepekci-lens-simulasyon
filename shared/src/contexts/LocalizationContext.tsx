import React, { createContext, useContext, ReactNode } from 'react';
import { LocalizationContextType } from '../types/localization';
import { turkishLocale } from '../locales/turkish';

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const formatPrice = (amount: number): string => {
    return turkishLocale.currency.format(amount);
  };

  const formatDate = (date: Date): string => {
    return turkishLocale.date.format(date);
  };

  const formatTime = (date: Date): string => {
    return turkishLocale.date.timeFormat(date);
  };

  const formatNumber = (value: number, decimals: number = 2): string => {
    return value.toLocaleString('tr-TR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const getText = (key: string): string => {
    const keys = key.split('.');
    let value: any = turkishLocale;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  const contextValue: LocalizationContextType = {
    locale: turkishLocale,
    formatPrice,
    formatDate,
    formatTime,
    formatNumber,
    getText
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};