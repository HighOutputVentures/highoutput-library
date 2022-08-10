import * as React from 'react';
import AuthContext from './AuthContext';
import type { AuthConfig } from './types';

export default function AuthProvider({children, ...config}: React.PropsWithChildren<AuthConfig>) {
  return <AuthContext.Provider value={config}>{children}</AuthContext.Provider>;
}