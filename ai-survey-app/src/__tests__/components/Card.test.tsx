/**
 * Component Tests for Card
 *
 * Tests the Card UI component container
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '@/components/ui/Card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      render(
        <Card>
          <p>Card content</p>
        </Card>
      );
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      render(<Card title="Test Card">Content</Card>);
      expect(screen.getByText('Test Card')).toBeInTheDocument();
    });

    it('should not render title when not provided', () => {
      const { container } = render(<Card>Content</Card>);
      const headings = container.querySelectorAll('h2');
      expect(headings.length).toBe(0);
    });

    it('should apply default card styles', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('card');
    });

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('custom-class');
      expect(card.className).toContain('card');
    });
  });

  describe('Content', () => {
    it('should render multiple children', () => {
      render(
        <Card>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </Card>
      );
      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Second paragraph')).toBeInTheDocument();
    });

    it('should render complex nested content', () => {
      render(
        <Card title="Complex Card">
          <div>
            <h3>Subtitle</h3>
            <p>Description</p>
            <button>Action</button>
          </div>
        </Card>
      );
      expect(screen.getByText('Complex Card')).toBeInTheDocument();
      expect(screen.getByText('Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
    });
  });

  describe('Title Styling', () => {
    it('should apply correct heading level for title', () => {
      render(<Card title="Test Title">Content</Card>);
      const title = screen.getByText('Test Title');
      expect(title.tagName).toBe('H2');
    });

    it('should apply title styles', () => {
      render(<Card title="Styled Title">Content</Card>);
      const title = screen.getByText('Styled Title');
      expect(title.className).toContain('text-xl');
      expect(title.className).toContain('font-semibold');
    });
  });
});
