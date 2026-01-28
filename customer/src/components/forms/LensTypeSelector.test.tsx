import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LensTypeSelector } from './LensTypeSelector';
import { LensType } from '../../types/lens';

// Mock the localization context
const mockLocale = {
  lensType: 'Lens Tipi',
  lensTypes: {
    uzak: 'Uzak Görüş',
    yakın: 'Yakın Görüş',
    progresif: 'Progresif',
    bifocal: 'Bifokal',
    multifocal: 'Multifokal'
  }
};

vi.mock('../../../../shared/src/contexts/LocalizationContext', () => ({
  useLocalization: () => ({
    locale: mockLocale
  })
}));

describe('LensTypeSelector', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all lens type options', () => {
    render(
      <LensTypeSelector
        selectedType="uzak"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Lens Tipi')).toBeInTheDocument();
    expect(screen.getByText('Uzak Görüş')).toBeInTheDocument();
    expect(screen.getByText('Yakın Görüş')).toBeInTheDocument();
    expect(screen.getByText('Progresif')).toBeInTheDocument();
    expect(screen.getByText('Bifokal')).toBeInTheDocument();
    expect(screen.getByText('Multifokal')).toBeInTheDocument();
  });

  it('shows the selected lens type as active', () => {
    render(
      <LensTypeSelector
        selectedType="progresif"
        onChange={mockOnChange}
      />
    );

    const progresifOption = screen.getByRole('radio', { name: /progresif/i });
    expect(progresifOption).toHaveAttribute('aria-checked', 'true');
    expect(progresifOption).toHaveClass('bg-blue-50', 'border-blue-500');
  });

  it('calls onChange when a lens type is selected', () => {
    render(
      <LensTypeSelector
        selectedType="uzak"
        onChange={mockOnChange}
      />
    );

    const yakinOption = screen.getByRole('radio', { name: /yakın görüş/i });
    fireEvent.click(yakinOption);

    expect(mockOnChange).toHaveBeenCalledWith('yakın');
  });

  it('displays error message when error prop is provided and component is touched', () => {
    const { rerender } = render(
      <LensTypeSelector
        selectedType="uzak"
        onChange={mockOnChange}
        error="Lens tipi seçimi zorunludur"
      />
    );

    // Error should not be visible initially (not touched)
    expect(screen.queryByText('Lens tipi seçimi zorunludur')).not.toBeInTheDocument();

    // Click to make component touched
    const yakinOption = screen.getByRole('radio', { name: /yakın görüş/i });
    fireEvent.click(yakinOption);

    // Re-render with error to simulate touched state
    rerender(
      <LensTypeSelector
        selectedType="yakın"
        onChange={mockOnChange}
        error="Lens tipi seçimi zorunludur"
      />
    );

    // Now error should be visible
    expect(screen.getByText('Lens tipi seçimi zorunludur')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <LensTypeSelector
        selectedType="uzak"
        onChange={mockOnChange}
      />
    );

    const radioGroup = screen.getByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();
    expect(radioGroup).toHaveAttribute('aria-labelledby', 'lens-type-heading');

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons).toHaveLength(5);

    // Check that exactly one radio button is checked
    const checkedButtons = radioButtons.filter(button => 
      button.getAttribute('aria-checked') === 'true'
    );
    expect(checkedButtons).toHaveLength(1);
  });

  it('shows descriptions for each lens type', () => {
    render(
      <LensTypeSelector
        selectedType="uzak"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Uzak mesafe görüş için optimize edilmiş tek odaklı lens')).toBeInTheDocument();
    expect(screen.getByText('Okuma ve yakın mesafe çalışma için optimize edilmiş lens')).toBeInTheDocument();
    expect(screen.getByText('Uzak, orta ve yakın mesafeyi kademesiz geçişle sağlayan lens')).toBeInTheDocument();
    expect(screen.getByText('Uzak ve yakın mesafe için iki ayrı odak noktası olan lens')).toBeInTheDocument();
    expect(screen.getByText('Birden fazla odak noktası ile çeşitli mesafeleri destekleyen lens')).toBeInTheDocument();
  });

  it('applies hover and focus styles correctly', () => {
    render(
      <LensTypeSelector
        selectedType="uzak"
        onChange={mockOnChange}
      />
    );

    const yakinOption = screen.getByRole('radio', { name: /yakın görüş/i });
    
    // Check that unselected option has correct base classes
    expect(yakinOption).toHaveClass('bg-white', 'border-gray-300');
    
    // Check focus ring class is present
    expect(yakinOption).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });

  it('handles all lens type values correctly', () => {
    const lensTypes: LensType[] = ['uzak', 'yakın', 'progresif', 'bifocal', 'multifocal'];
    
    lensTypes.forEach(lensType => {
      const { rerender } = render(
        <LensTypeSelector
          selectedType={lensType}
          onChange={mockOnChange}
        />
      );

      const selectedOption = screen.getByRole('radio', { checked: true });
      expect(selectedOption).toHaveAttribute('aria-checked', 'true');
      
      // Clean up for next iteration
      rerender(<div />);
    });
  });
});