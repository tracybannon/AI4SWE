/**
 * Component Tests for Input
 *
 * Tests the Input UI component with validation and states
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '@/components/ui/Input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input field', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(<Input label="Email" id="email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should render required indicator when required', () => {
      render(<Input label="Email" id="email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render placeholder', () => {
      render(<Input placeholder="Enter email" />);
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    it('should render help text when provided', () => {
      render(<Input helpText="Enter a valid email address" />);
      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    });

    it('should render error message when provided', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should apply error styles when error is present', () => {
      const { container } = render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-red-500');
    });

    it('should hide help text when error is present', () => {
      render(<Input helpText="Help text" error="Error message" />);
      expect(screen.queryByText('Help text')).not.toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('should not apply error styles when no error', () => {
      const { container } = render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).not.toContain('border-red-500');
    });
  });

  describe('Input Types', () => {
    it('should support type="email"', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('should support type="password"', () => {
      render(<Input type="password" />);
      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should support type="text" by default', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });
  });

  describe('Value Changes', () => {
    it('should update value on change', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test@example.com' } });

      expect(handleChange).toHaveBeenCalled();
    });

    it('should display controlled value', () => {
      render(<Input value="test value" onChange={() => {}} />);
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('should handle empty value', () => {
      render(<Input value="" onChange={() => {}} />);
      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should link label to input with id', () => {
      render(<Input label="Email" id="email-input" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('id', 'email-input');
    });

    it('should be keyboard accessible', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      input.focus();
      expect(input).toHaveFocus();
    });

    it('should support required attribute', () => {
      render(<Input required />);
      expect(screen.getByRole('textbox')).toHaveAttribute('required');
    });

    it('should support disabled attribute', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should support readonly attribute', () => {
      render(<Input readOnly />);
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });
  });

  describe('Custom Props', () => {
    it('should pass through additional props', () => {
      render(<Input data-testid="custom-input" maxLength={100} />);
      const input = screen.getByTestId('custom-input');
      expect(input).toHaveAttribute('maxlength', '100');
    });

    it('should apply custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('custom-class');
    });

    it('should support name attribute', () => {
      render(<Input name="email-field" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email-field');
    });
  });
});
