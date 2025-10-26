/**
 * Root Layout
 *
 * Main layout component that wraps all pages
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Adoption Survey - Assess AI Tool Adoption in Software Development',
  description:
    'A secure, modular application for evaluating AI-augmented tool adoption in the software development lifecycle',
  keywords: ['AI', 'software development', 'survey', 'assessment', 'SDLC'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
