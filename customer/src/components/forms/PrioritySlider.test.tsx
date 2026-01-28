import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrioritySlider } from './PrioritySlider';
import { LocalizationProvider } from '../../../../shared/src/contexts/LocalizationContext';
import { Priority } from '../../types/usage';

// Mock localization context
const MockLocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

describe('PrioritySlider', () => {
  const defaultProps = {
    priority: 'balanced' as Priority,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <MockLocalizationProvider>
        <PrioritySlider {...defaultProps} {...props} />
      </MockLocalizationProvider>
    );
  };

  describe('Rendering', () => {
    it('renders with correct title', () => {
      renderComponent();
      
      expect(screen.getByText('Öncelik')).toBeInTheDocument();
    });

    it('renders all priority options', () => {
      renderComponent();
      
      expect(screen.getByText('Ekonomik')).toBeInTheDocument();
      expect(screen.getByText('Dengeli')).toBeInTheDocument();
      expect(screen.getByText('İnce Lens')).toBeInTheDocument();
    });

    it('renders priority descriptions', () => {
      renderComponent();
      
      expect(screen.getByText('En ekonomik seçenekler - Bütçe dostu çözümler')).toBeInTheDocument();
      expect(screen.getByText('Kalınlık ve fiyat dengesi - Optimal seçim')).toBeInTheDocument();
      expect(screen.getByText('En ince lens seçenekleri - Estetik görünüm öncelikli')).toBeInTheDocument();
    });

    it('displays current selection', () => {
      renderComponent({ priority: 'thin' });
      
      expect(screen.getByText('Seçili: İnce Lens')).toBeInTheDocument();
    });

    it('renders visual slider track', () => {
      renderComponent();
      
      // Check for slider track elements
      const sliderButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('Ekonomik') ||
        button.getAttribute('aria-label')?.includes('Dengeli') ||
        button.getAttribute('aria-label')?.includes('İnce Lens')
      );
      
      expect(sliderButtons).toHaveLength(3);
    });
  });

  describe('Priority Selection', () => {
    it('highlights the selected priority option', () => {
      renderComponent({ priority: 'cheap' });
      
      const cheapOption = screen.getByRole('radio', { name: /ekonomik/i });
      const balancedOption = screen.getByRole('radio', { name: /dengeli/i });
      const thinOption = screen.getByRole('radio', { name: /ince lens/i });
      
      expect(cheapOption).toHaveAttribute('aria-checked', 'true');
      expect(balancedOption).toHaveAttribute('aria-checked', 'false');
      expect(thinOption).toHaveAttribute('aria-checked', 'false');
    });

    it('calls onChange when a priority option is clicked', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      renderComponent({ priority: 'balanced', onChange: mockOnChange });
      
      const thinOption = screen.getByRole('radio', { name: /ince lens/i });
      await user.click(thinOption);
      
      expect(mockOnChange).toHaveBeenCalledWith('thin');
    });

    it('calls onChange when slider track button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      renderComponent({ priority: 'balanced', onChange: mockOnChange });
      
      // Find slider track buttons by aria-label
      const sliderButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label') === 'Ekonomik'
      );
      
      expect(sliderButtons).toHaveLength(1);
      await user.click(sliderButtons[0]);
      
      expect(mockOnChange).toHaveBeenCalledWith('cheap');
    });

    it('updates visual selection when priority changes', () => {
      const { rerender } = renderComponent({ priority: 'cheap' });
      
      expect(screen.getByText('Seçili: Ekonomik')).toBeInTheDocument();
      
      rerender(
        <MockLocalizationProvider>
          <PrioritySlider priority="thin" onChange={jest.fn()} />
        </MockLocalizationProvider>
      );
      
      expect(screen.getByText('Seçili: İnce Lens')).toBeInTheDocument();
    });
  });

  describe('Visual Slider', () => {
    it('positions slider track correctly for different priorities', () => {
      // Test cheap priority (index 0)
      const { rerender } = renderComponent({ priority: 'cheap' });
      let sliderTrack = document.querySelector('.bg-blue-500.rounded-full');
      expect(sliderTrack).toHaveStyle('width: 50%');
      
      // Test balanced priority (index 1)
      rerender(
        <MockLocalizationProvider>
          <PrioritySlider priority="balanced" onChange={jest.fn()} />
        </MockLocalizationProvider>
      );
      sliderTrack = document.querySelector('.bg-blue-500.rounded-full');
      expect(sliderTrack).toHaveStyle('width: 100%');
      
      // Test thin priority (index 2)
      rerender(
        <MockLocalizationProvider>
          <PrioritySlider priority="thin" onChange={jest.fn()} />
        </MockLocalizationProvider>
      );
      sliderTrack = document.querySelector('.bg-blue-500.rounded-full');
      expect(sliderTrack).toHaveStyle('width: 150%');
    });

    it('shows correct number of active markers', () => {
      renderComponent({ priority: 'balanced' });
      
      // Should have 2 active markers (cheap + balanced)
      const activeMarkers = document.querySelectorAll('.bg-blue-500.border-blue-500');
      expect(activeMarkers).toHaveLength(2);
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error prop is provided and component is touched', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Öncelik seçimi zorunludur';
      renderComponent({ error: errorMessage });
      
      // Component needs to be touched to show error
      const thinOption = screen.getByRole('radio', { name: /ince lens/i });
      await user.click(thinOption);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('applies error styling when error is present and touched', async () => {
      const user = userEvent.setup();
      renderComponent({ error: 'Test error' });
      
      const radioGroup = screen.getByRole('radiogroup');
      const thinOption = screen.getByRole('radio', { name: /ince lens/i });
      await user.click(thinOption);
      
      expect(radioGroup).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not display error message when not touched', () => {
      const errorMessage = 'Öncelik seçimi zorunludur';
      renderComponent({ error: errorMessage });
      
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper radiogroup role and attributes', () => {
      renderComponent();
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();
      expect(radioGroup).toHaveAttribute('aria-labelledby', 'priority-heading');
    });

    it('has proper radio button attributes', () => {
      renderComponent({ priority: 'thin' });
      
      const cheapOption = screen.getByRole('radio', { name: /ekonomik/i });
      const thinOption = screen.getByRole('radio', { name: /ince lens/i });
      
      expect(cheapOption).toHaveAttribute('aria-checked', 'false');
      expect(cheapOption).toHaveAttribute('aria-pressed', 'false');
      expect(thinOption).toHaveAttribute('aria-checked', 'true');
      expect(thinOption).toHaveAttribute('aria-pressed', 'true');
    });

    it('has proper ARIA attributes when error is present', async () => {
      const user = userEvent.setup();
      renderComponent({ error: 'Test error' });
      
      const radioGroup = screen.getByRole('radiogroup');
      const thinOption = screen.getByRole('radio', { name: /ince lens/i });
      await user.click(thinOption);
      
      expect(radioGroup).toHaveAttribute('aria-invalid', 'true');
      expect(radioGroup).toHaveAttribute('aria-describedby', 'priority-error');
    });

    it('error message has role="alert"', async () => {
      const user = userEvent.setup();
      renderComponent({ error: 'Test error' });
      
      const thinOption = screen.getByRole('radio', { name: /ince lens/i });
      await user.click(thinOption);
      
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveAttribute('id', 'priority-error');
    });

    it('slider track buttons have proper aria-labels', () => {
      renderComponent();
      
      const sliderButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')
      );
      
      const ariaLabels = sliderButtons.map(button => button.getAttribute('aria-label'));
      expect(ariaLabels).toContain('Ekonomik');
      expect(ariaLabels).toContain('Dengeli');
      expect(ariaLabels).toContain('İnce Lens');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive grid classes', () => {
      renderComponent();
      
      const gridContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
      expect(gridContainer).toBeInTheDocument();
    });
  });
});