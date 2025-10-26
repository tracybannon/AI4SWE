/**
 * Layout Component
 *
 * Main layout wrapper with header and footer
 */

import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component that wraps all pages
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} AI Adoption Survey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
