/**
 * Session Provider Component
 *
 * Wraps the application with NextAuth SessionProvider for client-side session access
 */

'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import React from 'react';

interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Client-side session provider wrapper
 */
export default function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
