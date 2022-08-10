import * as React from 'react';
import type { AuthConfig } from './types';

const AuthContext = React.createContext<AuthConfig>({
  hostname: '',
});

export default AuthContext;
