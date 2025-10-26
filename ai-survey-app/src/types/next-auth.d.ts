/**
 * NextAuth Type Definitions
 *
 * Extends NextAuth types to include custom user properties
 */

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extended User interface
   */
  interface User {
    id: string;
    email: string;
    name: string | null;
  }

  /**
   * Extended Session interface
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT interface
   */
  interface JWT {
    id: string;
    email: string;
    name: string | null;
  }
}
