import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PrescriptionForm } from './PrescriptionForm';
import { LocalizationProvider } from '../../../../shared/src/contexts/LocalizationContext';
import { PrescriptionData } from '../../types/prescription';

// Mock prescription data
const mockPrescription: PrescriptionData = {
  rightEye: { sph: 0, cyl: 0, axis: 0 },
  leftEye: { sph: 0, cyl: 0, axis: 0 }
};

// Test wrapper with LocalizationProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
);

describe('PrescriptionForm', () => {
  it('renders prescription form with all input fields', () => {
    const mockOnChange = vi.fn();
    
    render(
      <TestWrapper>
        <PrescriptionForm
          prescription={mockPrescription}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    // Check if the form title is rendered
    expect(screen.getByText('Reçete')).toBeInTheDocument();
    
    // Check if eye section titles are rendered
    expect(screen.getByText('Sağ Göz')).toBeInTheDocument();
    expect(screen.getByText('Sol Göz')).toBeInTheDocument();
    
    // Check if all input labels are rendered (2 eyes × 3 fields = 6 labels)
    const sphLabels = screen.getAllByText('SPH (Küre)');
    const cylLabels = screen.getAllByText('CYL (Silindir)');
    const axisLabels = screen.getAllByText('AXIS (Eksen)');
    
    expect(sphLabels).toHaveLength(2);
    expect(cylLabels).toHaveLength(2);
    expect(axisLabels).toHaveLength(2);
  });

  it('calls onChange when input values change', () => {
    const mockOnChange = vi.fn();
    
    render(
      <TestWrapper>
        <PrescriptionForm
          prescription={mockPrescription}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    // Get the first SPH input (right eye)
    const sphInputs = screen.getAllByDisplayValue('0');
    const rightEyeSphInput = sphInputs[0];
    
    // Change the value
    fireEvent.change(rightEyeSphInput, { target: { value: '2.5' } });
    
    // Check if onChange was called
    expect(mockOnChange).toHaveBeenCalled();
    
    // Check if the correct prescription data was passed
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
    expect(lastCall[0].rightEye.sph).toBe(2.5);
  });

  it('displays validation errors when provided', () => {
    const mockOnChange = vi.fn();
    const errors = {
      rightEyeSph: 'SPH değeri -20.00 ile +20.00 arasında olmalıdır'
    };
    
    render(
      <TestWrapper>
        <PrescriptionForm
          prescription={mockPrescription}
          onChange={mockOnChange}
          errors={errors}
        />
      </TestWrapper>
    );

    // The error should not be visible initially (field not touched)
    expect(screen.queryByText('SPH değeri -20.00 ile +20.00 arasında olmalıdır')).not.toBeInTheDocument();
  });

  it('validates SPH range correctly', () => {
    const mockOnChange = vi.fn();
    
    render(
      <TestWrapper>
        <PrescriptionForm
          prescription={mockPrescription}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    const sphInputs = screen.getAllByDisplayValue('0');
    const rightEyeSphInput = sphInputs[0];
    
    // Test invalid value (out of range)
    fireEvent.change(rightEyeSphInput, { target: { value: '25' } });
    fireEvent.blur(rightEyeSphInput);
    
    // Check if validation error appears after blur
    expect(screen.getByText('SPH değeri -20.00 ile +20.00 arasında olmalıdır')).toBeInTheDocument();
  });

  it('validates CYL range correctly', () => {
    const mockOnChange = vi.fn();
    
    render(
      <TestWrapper>
        <PrescriptionForm
          prescription={mockPrescription}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    const cylInputs = screen.getAllByDisplayValue('0');
    const rightEyeCylInput = cylInputs[1]; // Second input should be CYL
    
    // Test invalid value (out of range)
    fireEvent.change(rightEyeCylInput, { target: { value: '10' } });
    fireEvent.blur(rightEyeCylInput);
    
    // Check if validation error appears after blur
    expect(screen.getByText('CYL değeri -6.00 ile +6.00 arasında olmalıdır')).toBeInTheDocument();
  });

  it('validates AXIS range correctly', () => {
    const mockOnChange = vi.fn();
    
    render(
      <TestWrapper>
        <PrescriptionForm
          prescription={mockPrescription}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    const axisInputs = screen.getAllByDisplayValue('0');
    const rightEyeAxisInput = axisInputs[2]; // Third input should be AXIS
    
    // Test invalid value (out of range)
    fireEvent.change(rightEyeAxisInput, { target: { value: '200' } });
    fireEvent.blur(rightEyeAxisInput);
    
    // Check if validation error appears after blur
    expect(screen.getByText('AXIS değeri 0 ile 180 arasında olmalıdır')).toBeInTheDocument();
  });

  it('handles both eyes independently', () => {
    const mockOnChange = vi.fn();
    
    render(
      <TestWrapper>
        <PrescriptionForm
          prescription={mockPrescription}
          onChange={mockOnChange}
        />
      </TestWrapper>
    );

    const sphInputs = screen.getAllByDisplayValue('0');
    const rightEyeSphInput = sphInputs[0];
    const leftEyeSphInput = sphInputs[3]; // Left eye SPH should be the 4th input
    
    // Change right eye
    fireEvent.change(rightEyeSphInput, { target: { value: '1.5' } });
    
    // Change left eye
    fireEvent.change(leftEyeSphInput, { target: { value: '-2.0' } });
    
    // Check if both changes were captured
    expect(mockOnChange).toHaveBeenCalledTimes(2);
    
    // Check the final state
    const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
    expect(lastCall[0].leftEye.sph).toBe(-2.0);
  });
});