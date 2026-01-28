import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsageDescription } from './UsageDescription';
import { LocalizationProvider } from '../../../../shared/src/contexts/LocalizationContext';
import { turkishLocale } from '../../../../shared/src/locales/turkish';

// Mock localization context
const MockLocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

describe('UsageDescription', () => {
  const defaultProps = {
    usage: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <MockLocalizationProvider>
        <UsageDescription {...defaultProps} {...props} />
      </MockLocalizationProvider>
    );
  };

  describe('Rendering', () => {
    it('renders with correct title and description', () => {
      renderComponent();
      
      expect(screen.getByText('Kullanım Amacı')).toBeInTheDocument();
      expect(screen.getByText('Kullanım amacınızı belirtmek daha iyi öneriler almamızı sağlar')).toBeInTheDocument();
    });

    it('renders textarea with correct placeholder', () => {
      renderComponent();
      
      const textarea = screen.getByPlaceholderText('Gözlüklerinizi nasıl kullanacağınızı açıklayın...');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('rows', '4');
    });

    it('displays character count', () => {
      renderComponent({ usage: 'Test usage' });
      
      expect(screen.getByText('10/500 karakter')).toBeInTheDocument();
    });

    it('displays help text', () => {
      renderComponent();
      
      expect(screen.getByText(/Örnek: "Ofiste bilgisayar başında çalışıyorum/)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when text is entered', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      renderComponent({ onChange: mockOnChange });
      
      const textarea = screen.getByPlaceholderText('Gözlüklerinizi nasıl kullanacağınızı açıklayın...');
      await user.type(textarea, 'Ofis çalışması');
      
      expect(mockOnChange).toHaveBeenCalledWith('Ofis çalışması');
    });

    it('shows suggestions when textarea is focused', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const textarea = screen.getByPlaceholderText('Gözlüklerinizi nasıl kullanacağınızı açıklayın...');
      await user.click(textarea);
      
      await waitFor(() => {
        expect(screen.getByText('Ofis çalışması ve bilgisayar kullanımı')).toBeInTheDocument();
        expect(screen.getByText('Araba kullanma ve trafik')).toBeInTheDocument();
      });
    });

    it('shows/hides suggestions when toggle button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const toggleButton = screen.getByText('Öneriler');
      
      // Initially suggestions should not be visible
      expect(screen.queryByText('Ofis çalışması ve bilgisayar kullanımı')).not.toBeInTheDocument();
      
      // Click to show suggestions
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('Ofis çalışması ve bilgisayar kullanımı')).toBeInTheDocument();
      });
      
      // Click again to hide suggestions
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Ofis çalışması ve bilgisayar kullanımı')).not.toBeInTheDocument();
      });
    });

    it('adds suggestion to existing text when suggestion is clicked', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      renderComponent({ usage: 'Mevcut metin', onChange: mockOnChange });
      
      // Show suggestions
      const toggleButton = screen.getByText('Öneriler');
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('Ofis çalışması ve bilgisayar kullanımı')).toBeInTheDocument();
      });
      
      // Click on a suggestion
      const suggestion = screen.getByText('Ofis çalışması ve bilgisayar kullanımı');
      await user.click(suggestion);
      
      expect(mockOnChange).toHaveBeenCalledWith('Mevcut metin, ofis çalışması ve bilgisayar kullanımı');
    });

    it('replaces empty text with suggestion when suggestion is clicked', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      renderComponent({ usage: '', onChange: mockOnChange });
      
      // Show suggestions
      const toggleButton = screen.getByText('Öneriler');
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('Okuma ve yakın mesafe çalışma')).toBeInTheDocument();
      });
      
      // Click on a suggestion
      const suggestion = screen.getByText('Okuma ve yakın mesafe çalışma');
      await user.click(suggestion);
      
      expect(mockOnChange).toHaveBeenCalledWith('okuma ve yakın mesafe çalışma');
    });
  });

  describe('Error Handling', () => {
    it('displays error message when error prop is provided and component is touched', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Bu alan zorunludur';
      renderComponent({ error: errorMessage });
      
      // Component needs to be touched to show error
      const textarea = screen.getByPlaceholderText('Gözlüklerinizi nasıl kullanacağınızı açıklayın...');
      await user.type(textarea, 'a');
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('applies error styling when error is present and touched', async () => {
      const user = userEvent.setup();
      renderComponent({ error: 'Test error' });
      
      const textarea = screen.getByPlaceholderText('Gözlüklerinizi nasıl kullanacağınızı açıklayın...');
      await user.type(textarea, 'a');
      
      expect(textarea).toHaveClass('border-red-300');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not display error message when not touched', () => {
      const errorMessage = 'Bu alan zorunludur';
      renderComponent({ error: errorMessage });
      
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderComponent();
      
      const textarea = screen.getByPlaceholderText('Gözlüklerinizi nasıl kullanacağınızı açıklayın...');
      expect(textarea).toHaveAttribute('aria-describedby', 'usage-description');
    });

    it('has proper ARIA attributes when error is present', async () => {
      const user = userEvent.setup();
      renderComponent({ error: 'Test error' });
      
      const textarea = screen.getByPlaceholderText('Gözlüklerinizi nasıl kullanacağınızı açıklayın...');
      await user.type(textarea, 'a');
      
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
      expect(textarea).toHaveAttribute('aria-describedby', 'usage-error');
    });

    it('error message has role="alert"', async () => {
      const user = userEvent.setup();
      renderComponent({ error: 'Test error' });
      
      const textarea = screen.getByPlaceholderText('Gözlüklerinizi nasıl kullanacağınızı açıklayın...');
      await user.type(textarea, 'a');
      
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveAttribute('id', 'usage-error');
    });
  });

  describe('Custom Suggestions', () => {
    it('renders custom suggestions when provided', async () => {
      const user = userEvent.setup();
      const customSuggestions = ['Özel öneri 1', 'Özel öneri 2'];
      renderComponent({ suggestions: customSuggestions });
      
      const toggleButton = screen.getByText('Öneriler');
      await user.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('Özel öneri 1')).toBeInTheDocument();
        expect(screen.getByText('Özel öneri 2')).toBeInTheDocument();
        expect(screen.queryByText('Ofis çalışması ve bilgisayar kullanımı')).not.toBeInTheDocument();
      });
    });
  });
});