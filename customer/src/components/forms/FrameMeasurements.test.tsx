import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FrameMeasurements } from './FrameMeasurements';
import { LocalizationProvider } from '../../../../shared/src/contexts/LocalizationContext';
import { FrameData } from '../../types/frame';

// Test wrapper with LocalizationProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

describe('FrameMeasurements Component', () => {
  const defaultMeasurements: FrameData = {
    size: 'medium'
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders frame size options correctly', () => {
    render(
      <TestWrapper>
        <FrameMeasurements
          measurements={defaultMeasurements}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Küçük')).toBeInTheDocument();
    expect(screen.getByText('Orta')).toBeInTheDocument();
    expect(screen.getByText('Büyük')).toBeInTheDocument();
    expect(screen.getByText('48-52mm')).toBeInTheDocument();
    expect(screen.getByText('53-57mm')).toBeInTheDocument();
    expect(screen.getByText('58-62mm')).toBeInTheDocument();
  });

  it('shows medium size as selected by default', () => {
    render(
      <TestWrapper>
        <FrameMeasurements
          measurements={defaultMeasurements}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    const mediumButton = screen.getByRole('button', { name: /Orta/ });
    expect(mediumButton).toHaveAttribute('aria-pressed', 'true');
    expect(mediumButton).toHaveClass('bg-blue-600');
  });

  it('calls onChange when frame size is selected', () => {
    render(
      <TestWrapper>
        <FrameMeasurements
          measurements={defaultMeasurements}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    const smallButton = screen.getByRole('button', { name: /Küçük/ });
    fireEvent.click(smallButton);

    expect(mockOnChange).toHaveBeenCalledWith({
      size: 'small'
    });
  });

  it('toggles manual measurements section', () => {
    render(
      <TestWrapper>
        <FrameMeasurements
          measurements={defaultMeasurements}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    // Manual measurements should be hidden initially
    expect(screen.queryByLabelText(/Çerçeve Genişliği/)).not.toBeInTheDocument();

    // Click to show manual measurements
    const toggleButton = screen.getByRole('button', { name: /Manuel Ölçümler/ });
    fireEvent.click(toggleButton);

    // Manual measurements should now be visible
    expect(screen.getByLabelText(/Çerçeve Genişliği/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Çerçeve Yüksekliği/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Burun Köprüsü/)).toBeInTheDocument();
  });

  it('handles manual measurement input changes', async () => {
    render(
      <TestWrapper>
        <FrameMeasurements
          measurements={defaultMeasurements}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    // Show manual measurements
    const toggleButton = screen.getByRole('button', { name: /Manuel Ölçümler/ });
    fireEvent.click(toggleButton);

    // Input width value
    const widthInput = screen.getByLabelText(/Çerçeve Genişliği/);
    fireEvent.change(widthInput, { target: { value: '55' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        size: 'medium',
        width: 55
      });
    });
  });

  it('validates manual measurement inputs', async () => {
    render(
      <TestWrapper>
        <FrameMeasurements
          measurements={defaultMeasurements}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    // Show manual measurements
    const toggleButton = screen.getByRole('button', { name: /Manuel Ölçümler/ });
    fireEvent.click(toggleButton);

    // Input invalid width value
    const widthInput = screen.getByLabelText(/Çerçeve Genişliği/);
    fireEvent.change(widthInput, { target: { value: '80' } });
    fireEvent.blur(widthInput);

    await waitFor(() => {
      expect(screen.getByText('Çerçeve genişliği 40-70mm arasında olmalıdır')).toBeInTheDocument();
    });
  });

  it('clears manual measurements when empty string is entered', async () => {
    const measurementsWithValues: FrameData = {
      size: 'medium',
      width: 55,
      height: 35,
      bridge: 18
    };

    render(
      <TestWrapper>
        <FrameMeasurements
          measurements={measurementsWithValues}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    // Show manual measurements
    const toggleButton = screen.getByRole('button', { name: /Manuel Ölçümler/ });
    fireEvent.click(toggleButton);

    // Clear width value
    const widthInput = screen.getByLabelText(/Çerçeve Genişliği/);
    fireEvent.change(widthInput, { target: { value: '' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        size: 'medium',
        width: undefined,
        height: 35,
        bridge: 18
      });
    });
  });

  it('displays external validation errors', () => {
    const errors = {
      width: 'Custom width error',
      height: 'Custom height error'
    };

    render(
      <TestWrapper>
        <FrameMeasurements
          measurements={defaultMeasurements}
          onChange={mockOnChange}
          errors={errors}
        />
      </TestWrapper>
    );

    // Show manual measurements to see errors
    const toggleButton = screen.getByRole('button', { name: /Manuel Ölçümler/ });
    fireEvent.click(toggleButton);

    expect(screen.getByText('Custom width error')).toBeInTheDocument();
    expect(screen.getByText('Custom height error')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <FrameMeasurements
          measurements={defaultMeasurements}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    // Frame size buttons should have aria-pressed
    const buttons = screen.getAllByRole('button');
    const sizeButtons = buttons.filter(button => 
      button.textContent?.includes('Küçük') || 
      button.textContent?.includes('Orta') || 
      button.textContent?.includes('Büyük')
    );

    sizeButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-pressed');
    });
  });
});