import * as React from 'react';

export type AuthConfig = {
  hostname: string;
};

const AuthContext = React.createContext<AuthConfig>({
  hostname: '',
});

export default AuthContext;
