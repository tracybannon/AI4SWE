/**
 * Card Component
 *
 * A reusable card container component for consistent styling
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

/**
 * Card component for content containers
 */
export default function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>}
      {children}
    </div>
  );
}
